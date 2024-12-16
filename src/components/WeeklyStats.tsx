import React from 'react';
import { BarChart } from 'lucide-react';
import { WeeklyStats as WeeklyStatsType } from '../types/timeTracking';

interface WeeklyStatsProps {
  stats: WeeklyStatsType[];
}

export default function WeeklyStats({ stats }: WeeklyStatsProps) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
        <BarChart className="w-5 h-5" />
        Weekly Statistics
      </h2>
      
      <div className="space-y-6">
        {stats.map((week) => (
          <div key={week.weekStart} className="border-b pb-6">
            <h3 className="font-medium mb-3">
              Week: {week.weekStart} to {week.weekEnd}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600">Average Hours/Check</p>
                <p className="text-2xl font-semibold text-blue-600">
                  {week.averageHoursPerCheck.toFixed(2)}
                </p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600">Total Hours</p>
                <p className="text-2xl font-semibold text-green-600">
                  {week.totalHours.toFixed(2)}
                </p>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600">Check Count</p>
                <p className="text-2xl font-semibold text-purple-600">
                  {week.checkCount}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}