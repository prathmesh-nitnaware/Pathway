"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import { MapPin, Star, IndianRupee, Building, Users, Calendar, Briefcase, GraduationCap } from "lucide-react";
import { useCompareStore } from "@/store/useCompareStore";

export default function CollegeDetailPage() {
  const { id } = useParams();
  const [college, setCollege] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  
  const { compareColleges, addCollege, removeCollege } = useCompareStore();

  useEffect(() => {
    const fetchCollege = async () => {
      try {
        const res = await fetch(`/api/colleges/${id}`);
        if (res.ok) {
          const data = await res.json();
          setCollege(data);
        }
      } catch (error) {
        console.error("Error fetching college:", error);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchCollege();
  }, [id]);

  if (loading) {
    return <div className="animate-pulse h-96 bg-gray-200 rounded-xl" />;
  }

  if (!college) {
    return <div className="text-center py-20">College not found</div>;
  }

  const isComparing = compareColleges.some(c => c.id === college.id);

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="h-64 sm:h-80 relative w-full">
          <Image
            src={college.image || "https://images.unsplash.com/photo-1562774053-701939374585"}
            alt={college.name}
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
          <div className="absolute bottom-0 left-0 p-6 md:p-10 w-full text-white">
            <h1 className="text-3xl md:text-5xl font-bold mb-3">{college.name}</h1>
            <div className="flex flex-wrap items-center gap-4 text-sm md:text-base text-gray-200">
              <span className="flex items-center"><MapPin className="w-4 h-4 mr-1" /> {college.location}</span>
              <span className="flex items-center"><Calendar className="w-4 h-4 mr-1" /> Estd {college.establishedYear}</span>
              <span className="flex items-center bg-yellow-500 text-yellow-950 px-2 py-0.5 rounded font-bold">
                <Star className="w-4 h-4 mr-1 fill-current" /> {college.rating.toFixed(1)}
              </span>
            </div>
          </div>
        </div>
        <div className="p-4 md:p-6 flex flex-wrap items-center justify-between gap-4 border-t border-gray-100 bg-white">
          <div className="flex items-center gap-6">
            <div>
              <p className="text-xs text-gray-500 uppercase font-semibold">Average Fees</p>
              <p className="text-lg font-bold text-gray-900 flex items-center">
                <IndianRupee className="w-4 h-4" /> {(college.fees / 100000).toFixed(2)}L
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase font-semibold">Highest Package</p>
              <p className="text-lg font-bold text-emerald-600">{college.highestPackage}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button 
              onClick={() => isComparing ? removeCollege(college.id) : addCollege(college)}
              className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                isComparing ? "bg-gray-200 text-gray-700 hover:bg-gray-300" : "bg-blue-600 text-white hover:bg-blue-700"
              }`}
            >
              {isComparing ? "Remove from Compare" : "Compare"}
            </button>
            <button className="px-6 py-2 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition-colors">
              Save
            </button>
          </div>
        </div>
      </div>

      {/* Content Tabs */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
        <div className="flex border-b border-gray-200 overflow-x-auto">
          {['overview', 'courses', 'placements', 'reviews'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-8 py-4 font-medium text-sm whitespace-nowrap transition-colors ${
                activeTab === tab 
                  ? "border-b-2 border-blue-600 text-blue-600" 
                  : "text-gray-500 hover:text-gray-900 hover:bg-gray-50"
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        <div className="p-6 md:p-8">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">About College</h3>
                <p className="text-gray-600 leading-relaxed whitespace-pre-wrap">{college.description}</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                <div className="bg-gray-50 p-6 rounded-xl border border-gray-100">
                  <Building className="w-8 h-8 text-blue-600 mb-3" />
                  <h4 className="font-semibold text-gray-900">Campus Size</h4>
                  <p className="text-gray-500 mt-1">Spread across 250+ acres of lush green campus with modern amenities.</p>
                </div>
                <div className="bg-gray-50 p-6 rounded-xl border border-gray-100">
                  <Users className="w-8 h-8 text-blue-600 mb-3" />
                  <h4 className="font-semibold text-gray-900">Student Life</h4>
                  <p className="text-gray-500 mt-1">Active student clubs, technical societies, and annual cultural fests.</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'courses' && (
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <GraduationCap className="text-blue-600" /> Offered Courses
              </h3>
              <div className="grid gap-4">
                {college.courses?.map((course: any) => (
                  <div key={course.id} className="flex flex-col sm:flex-row justify-between p-5 border border-gray-200 rounded-xl hover:border-blue-300 transition-colors bg-white">
                    <div>
                      <h4 className="font-bold text-gray-900 text-lg">{course.courseName}</h4>
                      <p className="text-gray-500 mt-1">{course.duration} | Full Time</p>
                    </div>
                    <div className="mt-4 sm:mt-0 sm:text-right">
                      <p className="font-bold text-gray-900 text-xl flex items-center sm:justify-end">
                        <IndianRupee className="w-5 h-5" /> {course.fees.toLocaleString('en-IN')}
                      </p>
                      <p className="text-gray-500 text-sm mt-1">Total Fees</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'placements' && (
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <Briefcase className="text-blue-600" /> Placement Highlights
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
                <div className="bg-emerald-50 p-6 rounded-xl border border-emerald-100 flex flex-col items-center justify-center text-center">
                  <p className="text-emerald-800 font-medium mb-2">Highest Package</p>
                  <p className="text-4xl font-bold text-emerald-600">{college.highestPackage}</p>
                </div>
                <div className="bg-blue-50 p-6 rounded-xl border border-blue-100 flex flex-col items-center justify-center text-center">
                  <p className="text-blue-800 font-medium mb-2">Average Package</p>
                  <p className="text-4xl font-bold text-blue-600">{college.avgPackage}</p>
                </div>
              </div>
              <h4 className="font-bold text-gray-900 mb-4">Top Recruiters</h4>
              <div className="flex flex-wrap gap-3">
                {['Google', 'Microsoft', 'Amazon', 'Apple', 'Meta', 'TCS', 'Infosys'].map((company, i) => (
                  <span key={i} className="px-4 py-2 bg-gray-100 rounded-full text-gray-700 font-medium border border-gray-200">
                    {company}
                  </span>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'reviews' && (
            <div>
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-xl font-bold text-gray-900">Student Reviews</h3>
                <div className="flex items-center gap-2">
                  <div className="flex items-center bg-yellow-500 text-yellow-950 px-3 py-1 rounded-lg font-bold text-lg">
                    <Star className="w-5 h-5 mr-1 fill-current" /> {college.rating.toFixed(1)}
                  </div>
                  <span className="text-gray-500 font-medium">({college.reviews?.length || 0} Reviews)</span>
                </div>
              </div>
              <div className="space-y-6">
                {college.reviews?.map((review: any) => (
                  <div key={review.id} className="p-6 bg-white border border-gray-200 rounded-xl">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-700 font-bold">
                          {review.user?.name?.charAt(0) || 'U'}
                        </div>
                        <div>
                          <p className="font-bold text-gray-900">{review.user?.name || 'Anonymous User'}</p>
                          <div className="flex items-center gap-1 text-yellow-500">
                            {[...Array(5)].map((_, i) => (
                              <Star key={i} className={`w-3.5 h-3.5 ${i < Math.floor(review.rating) ? 'fill-current' : 'text-gray-300'}`} />
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                    <p className="text-gray-700 leading-relaxed">{review.reviewText}</p>
                  </div>
                ))}
                {(!college.reviews || college.reviews.length === 0) && (
                  <p className="text-gray-500 italic text-center py-8">No reviews yet for this college.</p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
