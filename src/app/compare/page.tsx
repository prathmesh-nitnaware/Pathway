"use client";

import { useCompareStore } from "@/store/useCompareStore";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Trash2, IndianRupee, Star, MapPin, CheckCircle2 } from "lucide-react";

export default function ComparePage() {
  const { compareColleges, removeCollege, clearCompare } = useCompareStore();

  const parsePackage = (pkgStr: string) => {
    if (!pkgStr) return 0;
    const val = parseFloat(pkgStr.replace(/[^0-9.]/g, ''));
    if (isNaN(val)) return 0;
    if (pkgStr.toUpperCase().includes('CPA')) {
      return val * 100; // Convert Crores to Lakhs
    }
    return val;
  };

  const maxPackage = Math.max(...compareColleges.map(c => parsePackage(c.highestPackage)));
  const maxAvgPackage = Math.max(...compareColleges.map(c => parsePackage(c.avgPackage)));

  const minFees = Math.min(...compareColleges.map(c => c.fees));
  const maxRating = Math.max(...compareColleges.map(c => c.rating));

  if (compareColleges.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="bg-gray-100 p-6 rounded-full mb-6">
          <CheckCircle2 className="w-16 h-16 text-gray-400" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">No colleges to compare</h2>
        <p className="text-gray-500 mb-8">Add colleges to your compare list to see them side-by-side.</p>
        <Link 
          href="/"
          className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
        >
          Browse Colleges
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <Link href="/" className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <ArrowLeft className="w-6 h-6 text-gray-600" />
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Compare Colleges</h1>
        </div>
        <button 
          onClick={clearCompare}
          className="flex items-center gap-2 px-4 py-2 text-red-600 font-medium hover:bg-red-50 rounded-lg transition-colors"
        >
          <Trash2 className="w-4 h-4" /> Clear All
        </button>
      </div>

      <div className="overflow-x-auto pb-8">
        <div className="inline-block min-w-full align-middle">
          <div className="overflow-hidden border border-gray-200 rounded-2xl bg-white shadow-sm">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr className="bg-gray-50/50">
                  <th scope="col" className="py-6 px-6 text-left text-sm font-semibold text-gray-500 uppercase tracking-wider w-48 shrink-0 border-r border-gray-200">
                    Features
                  </th>
                  {compareColleges.map((college) => (
                    <th key={college.id} scope="col" className="py-6 px-6 text-center border-r border-gray-200 last:border-r-0 relative group min-w-[300px] w-1/3">
                      <button 
                        onClick={() => removeCollege(college.id)}
                        className="absolute top-4 right-4 p-1.5 bg-red-100 text-red-600 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-200"
                        title="Remove"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                      <div className="relative h-32 w-full rounded-xl overflow-hidden mb-4">
                        <Image 
                          src={college.image || "https://images.unsplash.com/photo-1562774053-701939374585"} 
                          alt={college.name} 
                          fill 
                          className="object-cover" 
                        />
                      </div>
                      <Link href={`/colleges/${college.id}`} className="block">
                        <h3 className="text-lg font-bold text-gray-900 hover:text-blue-600 transition-colors line-clamp-2 leading-tight h-12 flex items-center justify-center">
                          {college.name}
                        </h3>
                      </Link>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                <tr>
                  <td className="py-4 px-6 text-sm font-medium text-gray-900 bg-gray-50/50 border-r border-gray-200">Location</td>
                  {compareColleges.map((college) => (
                    <td key={college.id} className="py-4 px-6 text-sm text-gray-700 text-center border-r border-gray-200 last:border-r-0">
                      <div className="flex items-center justify-center gap-1">
                        <MapPin className="w-4 h-4 text-gray-400" />
                        {college.location}
                      </div>
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="py-4 px-6 text-sm font-medium text-gray-900 bg-gray-50/50 border-r border-gray-200">User Rating</td>
                  {compareColleges.map((college) => {
                    const isWinner = college.rating === maxRating && compareColleges.length > 1;
                    return (
                      <td key={college.id} className={`py-4 px-6 text-sm text-center border-r border-gray-200 last:border-r-0 ${isWinner ? 'bg-green-50' : ''}`}>
                        <div className={`flex items-center justify-center gap-1 font-bold ${isWinner ? 'text-green-700' : 'text-gray-700'}`}>
                          <Star className={`w-4 h-4 ${isWinner ? 'text-green-600' : 'text-yellow-500'} fill-current`} />
                          {college.rating.toFixed(1)}
                        </div>
                      </td>
                    );
                  })}
                </tr>
                <tr>
                  <td className="py-4 px-6 text-sm font-medium text-gray-900 bg-gray-50/50 border-r border-gray-200">Average Fees (Yearly)</td>
                  {compareColleges.map((college) => {
                    const isWinner = college.fees === minFees && compareColleges.length > 1;
                    return (
                      <td key={college.id} className={`py-4 px-6 text-sm font-bold text-center border-r border-gray-200 last:border-r-0 ${isWinner ? 'bg-green-50 text-green-700' : 'text-gray-900'}`}>
                        <div className="flex items-center justify-center">
                          <IndianRupee className="w-4 h-4" />
                          {(college.fees / 100000).toFixed(2)} Lakhs
                        </div>
                      </td>
                    );
                  })}
                </tr>
                <tr>
                  <td className="py-4 px-6 text-sm font-medium text-gray-900 bg-gray-50/50 border-r border-gray-200">Highest Package</td>
                  {compareColleges.map((college) => {
                    const val = parsePackage(college.highestPackage);
                    const isWinner = val === maxPackage && compareColleges.length > 1;
                    return (
                      <td key={college.id} className={`py-4 px-6 text-sm font-bold text-center border-r border-gray-200 last:border-r-0 ${isWinner ? 'bg-green-50 text-green-700' : 'text-emerald-600'}`}>
                        {college.highestPackage}
                      </td>
                    );
                  })}
                </tr>
                <tr>
                  <td className="py-4 px-6 text-sm font-medium text-gray-900 bg-gray-50/50 border-r border-gray-200">Average Package</td>
                  {compareColleges.map((college) => {
                    const val = parsePackage(college.avgPackage);
                    const isWinner = val === maxAvgPackage && compareColleges.length > 1;
                    return (
                      <td key={college.id} className={`py-4 px-6 text-sm font-bold text-center border-r border-gray-200 last:border-r-0 ${isWinner ? 'bg-green-50 text-green-700' : 'text-blue-600'}`}>
                        {college.avgPackage}
                      </td>
                    );
                  })}
                </tr>
                <tr>
                  <td className="py-4 px-6 text-sm font-medium text-gray-900 bg-gray-50/50 border-r border-gray-200">Established</td>
                  {compareColleges.map((college) => (
                    <td key={college.id} className="py-4 px-6 text-sm text-gray-700 text-center border-r border-gray-200 last:border-r-0">
                      {college.establishedYear}
                    </td>
                  ))}
                </tr>
                <tr className="bg-gray-50/50">
                  <td className="py-6 px-6 border-r border-gray-200"></td>
                  {compareColleges.map((college) => (
                    <td key={college.id} className="py-6 px-6 text-center border-r border-gray-200 last:border-r-0">
                      <Link 
                        href={`/colleges/${college.id}`}
                        className="inline-block px-6 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
                      >
                        View Details
                      </Link>
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
