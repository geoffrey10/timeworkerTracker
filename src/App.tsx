import React from 'react';
import TimeRecordForm from './components/TimeRecordForm';
import DailyStats from './components/DailyStats';
import WeeklyStats from './components/WeeklyStats';
import { useTimeRecords } from './hooks/useTimeRecords';
import { calculateDailyStats, calculateWeeklyStats } from './utils/timeCalculations';

function App() {
  const { records, addRecord, getLastRecordType, exportToCSV } = useTimeRecords();
  const dailyStats = calculateDailyStats(records);
  const weeklyStats = calculateWeeklyStats(dailyStats);

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-4xl mx-auto px-4 space-y-6">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">
          Work Time Tracker
        </h1>

        <TimeRecordForm
          onCheck={addRecord}
          lastCheckType={getLastRecordType()}
          onExport={exportToCSV}
        />

        <DailyStats stats={dailyStats} />
        
        <WeeklyStats stats={weeklyStats} />
      </div>
    </div>
  );
}

export default App;