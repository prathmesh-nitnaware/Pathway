"use client";

import Image from "next/image";
import Link from "next/link";
import { Star, MapPin, IndianRupee, Heart, BarChart2 } from "lucide-react";
import { useState } from "react";
import { useSession } from "next-auth/react";
import toast from "react-hot-toast";

interface CollegeCardProps {
  college: any;
  isSaved?: boolean;
  onSaveToggle?: (collegeId: string, isSaved: boolean) => void;
  onCompareToggle?: (college: any, isAdding: boolean) => void;
  isComparing?: boolean;
}

export default function CollegeCard({ college, isSaved = false, onSaveToggle, onCompareToggle, isComparing = false }: CollegeCardProps) {
  const { data: session } = useSession();
  const [saving, setSaving] = useState(false);

  const handleSave = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!session) {
      toast.error("Please log in to save colleges.");
      return;
    }
    
    setSaving(true);
    try {
      if (onSaveToggle) {
        onSaveToggle(college.id, !isSaved);
      }
    } finally {
      setSaving(false);
    }
  };

  const handleCompare = (e: React.MouseEvent) => {
    e.preventDefault();
    if (onCompareToggle) {
      onCompareToggle(college, !isComparing);
    }
  };

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-xl bg-white shadow-md transition-all hover:shadow-xl hover:-translate-y-1">
      <Link href={`/colleges/${college.id}`} className="block flex-1">
        <div className="relative h-48 w-full overflow-hidden bg-gray-200">
          <Image
            src={college.image || "https://images.unsplash.com/photo-1562774053-701939374585"}
            alt={college.name}
            fill
            priority
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          <div className="absolute top-3 right-3 flex gap-2">
            <button
              onClick={handleCompare}
              className={`flex h-8 w-8 items-center justify-center rounded-full bg-white/90 shadow-sm backdrop-blur transition-colors ${
                isComparing ? "text-blue-600" : "text-gray-600 hover:text-blue-600"
              }`}
              title={isComparing ? "Remove from comparison" : "Add to comparison"}
            >
              <BarChart2 className="h-4 w-4" />
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className={`flex h-8 w-8 items-center justify-center rounded-full bg-white/90 shadow-sm backdrop-blur transition-colors ${
                isSaved ? "text-red-500" : "text-gray-600 hover:text-red-500"
              }`}
              title={isSaved ? "Remove from saved" : "Save college"}
            >
              <Heart className={`h-4 w-4 ${isSaved ? "fill-current" : ""}`} />
            </button>
          </div>
        </div>
        
        <div className="flex flex-1 flex-col p-5">
          <div className="mb-2 flex items-start justify-between gap-2">
            <h3 className="line-clamp-2 font-bold text-gray-900 text-lg leading-tight group-hover:text-blue-600 transition-colors">
              {college.name}
            </h3>
            <div className="flex items-center gap-1 rounded bg-yellow-50 px-2 py-1 text-xs font-bold text-yellow-700 shrink-0">
              <Star className="h-3 w-3 fill-current" />
              <span>{college.rating.toFixed(1)}</span>
            </div>
          </div>
          
          <div className="mb-4 flex items-center text-sm text-gray-500">
            <MapPin className="mr-1 h-3.5 w-3.5 shrink-0" />
            <span className="truncate">{college.location}</span>
          </div>
          
          <div className="mt-auto grid grid-cols-2 gap-4 border-t border-gray-100 pt-4 text-sm">
            <div>
              <p className="text-xs text-gray-500 mb-0.5">Average Fees</p>
              <div className="flex items-center font-semibold text-gray-900">
                <IndianRupee className="h-3.5 w-3.5" />
                <span>{(college.fees / 100000).toFixed(2)}L</span>
              </div>
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-0.5">Highest Package</p>
              <div className="font-semibold text-emerald-600">
                {college.highestPackage}
              </div>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
}
