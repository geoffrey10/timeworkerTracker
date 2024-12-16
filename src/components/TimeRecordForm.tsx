import React from 'react';
import { Clock, Download } from 'lucide-react';
import { CheckType } from '../types/timeTracking';

interface TimeRecordFormProps {
  onCheck: (type: CheckType) => void;
  lastCheckType: CheckType | null;
  onExport: () => void;
}

export default function TimeRecordForm({ onCheck, lastCheckType, onExport }: TimeRecordFormProps) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <Clock className="w-5 h-5" />
          Time Clock
        </h2>
        <div className="flex items-center gap-4">
          <button
            onClick={onExport}
            className="flex items-center gap-2 px-4 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
          >
            <Download className="w-4 h-4" />
            Export CSV
          </button>
          <div className="text-lg font-mono">
            {new Date().toLocaleDateString()}
          </div>
        </div>
      </div>
      
      <div className="flex gap-4">
        <button
          onClick={() => onCheck('CHECK_IN')}
          disabled={lastCheckType === 'CHECK_IN'}
          className={`flex-1 py-3 px-6 rounded-lg transition-colors ${
            lastCheckType === 'CHECK_IN'
              ? 'bg-gray-200 cursor-not-allowed'
              : 'bg-blue-500 hover:bg-blue-600 text-white'
          }`}
        >
          Check In
        </button>
        <button
          onClick={() => onCheck('CHECK_OUT')}
          disabled={lastCheckType !== 'CHECK_IN'}
          className={`flex-1 py-3 px-6 rounded-lg transition-colors ${
            lastCheckType !== 'CHECK_IN'
              ? 'bg-gray-200 cursor-not-allowed'
              : 'bg-green-500 hover:bg-green-600 text-white'
          }`}
        >
          Check Out
        </button>
      </div>
    </div>
  );
}