export default function CollegeCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden animate-pulse">
      <div className="h-48 bg-gray-200 w-full" />
      <div className="p-5">
        <div className="flex justify-between items-start mb-4">
          <div className="space-y-2 flex-1">
            <div className="h-6 bg-gray-200 rounded w-3/4" />
            <div className="h-4 bg-gray-200 rounded w-1/2" />
          </div>
          <div className="h-6 w-12 bg-gray-200 rounded shrink-0 ml-4" />
        </div>
        <div className="space-y-3 mb-6">
          <div className="h-4 bg-gray-200 rounded w-full" />
          <div className="h-4 bg-gray-200 rounded w-5/6" />
        </div>
        <div className="flex items-center gap-2">
          <div className="h-10 bg-gray-200 rounded-lg flex-1" />
          <div className="h-10 w-10 bg-gray-200 rounded-lg shrink-0" />
        </div>
      </div>
    </div>
  );
}
