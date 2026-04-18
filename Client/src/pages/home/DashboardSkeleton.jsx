import React from 'react';

const DashboardSkeleton = () => {
  return (
    <div className="animate-pulse w-full">
      {/* 1. Hero Banner Skeleton */}
      <div className="mb-8 p-8 rounded-3xl bg-[#1e2330]/80 border border-slate-700/50 flex flex-col md:flex-row items-center justify-between gap-6 overflow-hidden h-auto md:h-40">
        
        {/* Left Side: Title & Subtitle */}
        <div className="space-y-4 w-full md:w-1/3">
          <div className="h-8 bg-slate-700/50 rounded-lg w-3/4"></div>
          <div className="h-4 bg-slate-700/50 rounded-lg w-full"></div>
          <div className="h-4 bg-slate-700/50 rounded-lg w-5/6"></div>
        </div>

        {/* Middle: Stats Cards */}
        <div className="flex gap-4 md:gap-6 w-full justify-center md:w-auto">
          <div className="h-24 w-24 bg-slate-700/50 rounded-2xl"></div>
          <div className="h-24 w-24 bg-slate-700/50 rounded-xl"></div>
        </div>

        {/* Right Side: Buttons */}
        <div className="flex flex-col gap-3 w-full md:w-48">
          <div className="h-12 bg-slate-700/50 rounded-2xl w-full"></div>
          <div className="h-12 bg-slate-700/50 rounded-2xl w-full"></div>
        </div>
      </div>

      {/* 2. Grid Section Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 pt-1 pb-10 px-4 md:px-0">
        
        {/* 'Create New' Card Skeleton */}
        <div className="min-h-[300px] rounded-2xl border-2 border-dashed border-slate-700 bg-slate-800/20 p-4 flex flex-col gap-4 items-center justify-center">
          <div className="w-16 h-16 rounded-2xl bg-slate-700/50"></div>
          <div className="h-5 bg-slate-700/50 rounded w-1/2"></div>
        </div>

        {/* Fake Resume Cards */}
        {[1, 2, 3, 4].map((item) => (
          <div key={item} className="min-h-[300px] rounded-2xl bg-[#1e2330]/60 border border-slate-700 p-4 flex flex-col gap-4">
            {/* Thumbnail */}
            <div className="w-full h-40 bg-slate-700/50 rounded-xl"></div>
            {/* Title */}
            <div className="h-6 bg-slate-700/50 rounded w-3/4 mt-2"></div>
            {/* Date */}
            <div className="h-3 bg-slate-700/50 rounded w-1/2"></div>
            {/* Bottom Row / Actions */}
            <div className="flex justify-between items-center mt-auto pt-4">
               <div className="h-8 w-16 bg-slate-700/50 rounded-lg"></div>
               <div className="flex gap-2">
                 <div className="h-8 w-8 bg-slate-700/50 rounded-full"></div>
                 <div className="h-8 w-8 bg-slate-700/50 rounded-full"></div>
               </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DashboardSkeleton;