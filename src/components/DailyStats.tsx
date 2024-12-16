import React from 'react';
import { CalendarDays } from 'lucide-react';
import { DailyStats as DailyStatsType } from '../types/timeTracking';

interface DailyStatsProps {
  stats: DailyStatsType[];
}

export default function DailyStats({ stats }: DailyStatsProps) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
        <CalendarDays className="w-5 h-5" />
        Daily Records
      </h2>
      
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b">
              <th className="py-2 text-left">Date</th>
              <th className="py-2 text-left">Earliest Check In</th>
              <th className="py-2 text-left">Latest Check Out</th>
              <th className="py-2 text-left">Hours</th>
            </tr>
          </thead>
          <tbody>
            {stats.map((stat) => (
              <tr key={stat.date} className="border-b">
                <td className="py-2">{stat.date}</td>
                <td className="py-2">
                  {stat.checkIn ? (
                    <span className="text-blue-600">{stat.checkIn}</span>
                  ) : '-'}
                </td>
                <td className="py-2">
                  {stat.checkOut ? (
                    <span className="text-green-600">{stat.checkOut}</span>
                  ) : '-'}
                </td>
                <td className="py-2">
                  {stat.workingHours > 0 ? stat.workingHours.toFixed(2) : '-'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}