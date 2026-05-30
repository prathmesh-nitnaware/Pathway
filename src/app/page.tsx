"use client";

import { useState, useEffect, useCallback } from "react";
import CollegeCard from "@/components/colleges/CollegeCard";
import CollegeCardSkeleton from "@/components/colleges/CollegeCardSkeleton";
import { useCompareStore } from "@/store/useCompareStore";
import { useSession } from "next-auth/react";
import { Search, MapPin, IndianRupee, Filter } from "lucide-react";
import Link from "next/link";
import toast from "react-hot-toast";

function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);
  return debouncedValue;
}

export default function Home() {
  const [colleges, setColleges] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [search, setSearch] = useState("");
  const [location, setLocation] = useState("");
  const [rating, setRating] = useState("");
  const [fees, setFees] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const debouncedSearch = useDebounce(search, 500);
  const debouncedLocation = useDebounce(location, 500);
  
  const { compareColleges, addCollege, removeCollege } = useCompareStore();

  const { data: session } = useSession();
  const [savedCollegeIds, setSavedCollegeIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (session) {
      fetch("/api/save")
        .then((res) => res.json())
        .then((data) => {
          if (Array.isArray(data)) {
            setSavedCollegeIds(new Set(data.map((item: any) => item.collegeId)));
          }
        })
        .catch(console.error);
    } else {
      setSavedCollegeIds(new Set());
    }
  }, [session]);

  const fetchColleges = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: "9",
      });
      if (debouncedSearch) params.append("search", debouncedSearch);
      if (debouncedLocation) params.append("location", debouncedLocation);
      if (rating) params.append("rating", rating);
      if (fees) params.append("fees", fees);

      const res = await fetch(`/api/colleges?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setColleges(data.data);
        setTotalPages(data.meta.totalPages || 1);
      }
    } catch (error) {
      console.error("Error fetching colleges", error);
    } finally {
      setLoading(false);
    }
  }, [debouncedSearch, debouncedLocation, rating, fees, page]);

  useEffect(() => {
    setPage(1); // Reset page on filter change
  }, [debouncedSearch, debouncedLocation, rating, fees]);

  useEffect(() => {
    fetchColleges();
  }, [fetchColleges]);

  const handleSaveToggle = async (collegeId: string, isSaving: boolean) => {
    if (!session) return;
    
    try {
      if (isSaving) {
        const res = await fetch("/api/save", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ collegeId }),
        });
        if (res.ok) {
          setSavedCollegeIds(new Set([...savedCollegeIds, collegeId]));
          toast.success("College saved to your list!");
        }
      } else {
        // Find saved record if needed, but wait, the API requires the saved record ID to delete.
        // Actually, we could adjust the DELETE API to accept `collegeId` instead of the saved item ID.
        // Let's assume we change the DELETE API to use `?collegeId=123`. I'll update that next.
        const res = await fetch(`/api/save?collegeId=${collegeId}`, {
          method: "DELETE",
        });
        if (res.ok) {
          const newSet = new Set(savedCollegeIds);
          newSet.delete(collegeId);
          setSavedCollegeIds(newSet);
          toast.success("Removed from saved colleges");
        }
      }
    } catch (error) {
      console.error("Error toggling save:", error);
      toast.error("Failed to update saved colleges");
    }
  };

  const handleCompareToggle = (college: any, isAdding: boolean) => {
    if (isAdding) {
      addCollege(college);
    } else {
      removeCollege(college.id);
    }
  };

  return (
    <div className="flex flex-col md:flex-row gap-8">
      {/* Sidebar Filters */}
      <div className="w-full md:w-64 shrink-0 space-y-6">
        <div className="bg-white/70 backdrop-blur-md p-5 rounded-xl shadow-sm border border-gray-200/50">
          <div className="flex items-center gap-2 mb-4 font-semibold text-gray-900 border-b pb-3">
            <Filter className="w-5 h-5 text-blue-600" />
            <h2>Filters</h2>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="College name, course..."
                  className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-shadow"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="City or state..."
                  className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-shadow"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Min Rating</label>
              <select 
                className="w-full p-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white"
                value={rating}
                onChange={(e) => setRating(e.target.value)}
              >
                <option value="">Any Rating</option>
                <option value="4.5">4.5 & Above</option>
                <option value="4.0">4.0 & Above</option>
                <option value="3.5">3.5 & Above</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Max Fees (Yearly)</label>
              <div className="relative">
                <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                <select 
                  className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white"
                  value={fees}
                  onChange={(e) => setFees(e.target.value)}
                >
                  <option value="">Any Fees</option>
                  <option value="100000">Under 1 Lakh</option>
                  <option value="300000">Under 3 Lakhs</option>
                  <option value="500000">Under 5 Lakhs</option>
                </select>
              </div>
            </div>
          </div>
        </div>
        
        {compareColleges.length > 0 && (
          <div className="bg-blue-50 p-5 rounded-xl border border-blue-100">
            <h3 className="font-semibold text-blue-900 mb-2">Compare ({compareColleges.length}/3)</h3>
            <div className="space-y-2 mb-4">
              {compareColleges.map(c => (
                <div key={c.id} className="text-sm bg-white p-2 rounded shadow-sm flex justify-between items-center">
                  <span className="truncate pr-2">{c.name}</span>
                  <button onClick={() => removeCollege(c.id)} className="text-red-500 font-bold">&times;</button>
                </div>
              ))}
            </div>
            <Link 
              href="/compare" 
              className="block w-full py-2 text-center bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
            >
              Compare Now
            </Link>
          </div>
        )}
      </div>

      {/* Main Content */}
      <div className="flex-1">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Find Your Dream College</h1>
          <p className="text-gray-500 mt-2">Discover thousands of colleges based on your preferences.</p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <CollegeCardSkeleton key={i} />
            ))}
          </div>
        ) : colleges.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {colleges.map((college) => {
                const isComparing = compareColleges.some(c => c.id === college.id);
                const isSaved = savedCollegeIds.has(college.id);
                return (
                  <CollegeCard 
                    key={college.id} 
                    college={college} 
                    isComparing={isComparing}
                    isSaved={isSaved}
                    onCompareToggle={handleCompareToggle}
                    onSaveToggle={handleSaveToggle}
                  />
                )
              })}
            </div>
            
            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-10 flex justify-center gap-2">
                <button
                  disabled={page === 1}
                  onClick={() => setPage(p => p - 1)}
                  className="px-4 py-2 border rounded-lg disabled:opacity-50 hover:bg-gray-50 transition-colors bg-white"
                >
                  Previous
                </button>
                <span className="px-4 py-2 flex items-center font-medium">
                  Page {page} of {totalPages}
                </span>
                <button
                  disabled={page === totalPages}
                  onClick={() => setPage(p => p + 1)}
                  className="px-4 py-2 border rounded-lg disabled:opacity-50 hover:bg-gray-50 transition-colors bg-white"
                >
                  Next
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-20 bg-white rounded-xl border border-gray-100 shadow-sm">
            <GraduationCap className="mx-auto h-12 w-12 text-gray-300 mb-4" />
            <h3 className="text-lg font-medium text-gray-900">No colleges found</h3>
            <p className="mt-1 text-gray-500">Try adjusting your filters or search terms.</p>
            <button 
              onClick={() => {
                setSearch(""); setLocation(""); setRating(""); setFees("");
              }}
              className="mt-4 text-blue-600 font-medium hover:underline"
            >
              Clear all filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function GraduationCap(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M21.42 10.922a2 2 0 0 1-.019 3.838L12.83 19.83a2 2 0 0 1-1.66 0L2.6 14.76a2 2 0 0 1-.019-3.838l8.57-4.07a2 2 0 0 1 1.708 0Z" />
      <path d="M22 10v6" />
      <path d="M6 12.5V16a6 3 0 0 0 12 0v-3.5" />
    </svg>
  )
}
