"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import CollegeCard from "@/components/colleges/CollegeCard";
import CollegeCardSkeleton from "@/components/colleges/CollegeCardSkeleton";
import { useCompareStore } from "@/store/useCompareStore";
import { HeartCrack } from "lucide-react";
import Link from "next/link";

export default function SavedCollegesPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  
  const [savedColleges, setSavedColleges] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const { compareColleges, addCollege, removeCollege } = useCompareStore();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
      return;
    }

    if (status === "authenticated") {
      fetchSavedColleges();
    }
  }, [status, router]);

  const fetchSavedColleges = async () => {
    try {
      const res = await fetch("/api/save");
      if (res.ok) {
        const data = await res.json();
        // data contains array of SavedCollege records, each with a nested college object
        setSavedColleges(data);
      }
    } catch (error) {
      console.error("Error fetching saved colleges:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveToggle = async (collegeId: string, isSaved: boolean) => {
    if (!isSaved) {
      // Find the specific saved record ID for this college
      const savedRecord = savedColleges.find((sc) => sc.collegeId === collegeId);
      if (!savedRecord) return;

      try {
        const res = await fetch(`/api/save/${savedRecord.id}`, {
          method: "DELETE",
        });
        
        if (res.ok) {
          setSavedColleges((prev) => prev.filter((sc) => sc.id !== savedRecord.id));
        }
      } catch (error) {
        console.error("Error removing saved college", error);
      }
    }
  };

  const handleCompareToggle = (college: any, isAdding: boolean) => {
    if (isAdding) {
      addCollege(college);
    } else {
      removeCollege(college.id);
    }
  };

  if (loading || status === "loading") {
    return (
      <div className="py-10">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">My Saved Colleges</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
            <CollegeCardSkeleton key={i} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="py-10">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">My Saved Colleges</h1>
      
      {savedColleges.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {savedColleges.map((savedItem) => {
            const college = savedItem.college;
            const isComparing = compareColleges.some(c => c.id === college.id);
            return (
              <CollegeCard 
                key={college.id} 
                college={college} 
                isSaved={true}
                isComparing={isComparing}
                onSaveToggle={handleSaveToggle}
                onCompareToggle={handleCompareToggle}
              />
            )
          })}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-gray-100 shadow-sm">
          <div className="bg-gray-50 p-6 rounded-full mb-6">
            <HeartCrack className="w-16 h-16 text-gray-300" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">No saved colleges</h2>
          <p className="text-gray-500 mb-8 text-center max-w-md">
            You haven't saved any colleges yet. Browse our list and click the heart icon to save colleges you're interested in.
          </p>
          <Link 
            href="/"
            className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
          >
            Explore Colleges
          </Link>
        </div>
      )}
    </div>
  );
}
