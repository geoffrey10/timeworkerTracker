import React from 'react';
import { ClipboardList } from 'lucide-react';
import { TimeRecord } from '../types/timeTracking';

interface TimeRecordListProps {
  records: TimeRecord[];
}

export default function TimeRecordList({ records }: TimeRecordListProps) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
        <ClipboardList className="w-5 h-5" />
        Check Records
      </h2>
      
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b">
              <th className="py-2 text-left">Date</th>
              <th className="py-2 text-left">Time</th>
              <th className="py-2 text-left">Type</th>
            </tr>
          </thead>
          <tbody>
            {records.map((record) => (
              <tr key={record.id} className="border-b">
                <td className="py-2">{record.date}</td>
                <td className="py-2">{record.time}</td>
                <td className="py-2">
                  <span className={`px-2 py-1 rounded-full text-sm ${
                    record.type === 'CHECK_IN' 
                      ? 'bg-blue-100 text-blue-800' 
                      : 'bg-green-100 text-green-800'
                  }`}>
                    {record.type === 'CHECK_IN' ? 'Check In' : 'Check Out'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}