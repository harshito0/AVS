import React from 'react';

export const DashboardSkeleton: React.FC = () => {
  return (
    <div className="space-y-6 animate-pulse">
      {/* 4 KPI Skeleton Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-5">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="crm-card p-5 bg-white border border-[#E3EAE5] rounded-xl flex flex-col justify-between h-36">
            <div className="flex items-center justify-between">
              <div className="h-3 w-28 bg-slate-200 rounded-md" />
              <div className="w-9 h-9 rounded-lg bg-slate-100" />
            </div>
            <div className="h-8 w-32 bg-slate-200 rounded-md my-2" />
            <div className="h-3 w-36 bg-slate-100 rounded-md" />
          </div>
        ))}
      </div>

      {/* Middle Analytics Grid: Revenue (2 cols) & Appointment Overview (1 col) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 crm-card p-6 bg-white border border-[#E3EAE5] rounded-xl h-[380px] flex flex-col justify-between">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div className="h-5 w-40 bg-slate-200 rounded-md" />
            <div className="h-8 w-32 bg-slate-100 rounded-lg" />
          </div>
          <div className="flex-1 my-6 bg-slate-50/60 rounded-xl flex items-center justify-center">
            <div className="w-12 h-12 rounded-full border-2 border-slate-200 border-t-forest-700 animate-spin" />
          </div>
          <div className="h-4 w-48 bg-slate-100 rounded-md" />
        </div>

        <div className="crm-card p-6 bg-white border border-[#E3EAE5] rounded-xl h-[380px] flex flex-col justify-between">
          <div className="h-5 w-44 bg-slate-200 rounded-md pb-4 border-b border-slate-100" />
          <div className="w-44 h-44 rounded-full bg-slate-100 mx-auto my-4" />
          <div className="space-y-2">
            <div className="h-3 w-full bg-slate-100 rounded-md" />
            <div className="h-3 w-3/4 bg-slate-100 rounded-md" />
          </div>
        </div>
      </div>

      {/* Row 3: Location Performance, Top Services, Recent Appointments */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="crm-card p-6 bg-white border border-[#E3EAE5] rounded-xl h-80 flex flex-col justify-between">
            <div className="h-5 w-36 bg-slate-200 rounded-md pb-4 border-b border-slate-100" />
            <div className="space-y-3 my-4">
              <div className="h-10 w-full bg-slate-50 rounded-lg" />
              <div className="h-10 w-full bg-slate-50 rounded-lg" />
              <div className="h-10 w-full bg-slate-50 rounded-lg" />
            </div>
            <div className="h-3 w-28 bg-slate-100 rounded-md" />
          </div>
        ))}
      </div>
    </div>
  );
};
