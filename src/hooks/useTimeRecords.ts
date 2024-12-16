import { useLiveQuery } from 'dexie-react-hooks';
import { TimeRecord } from '../types/timeTracking';
import { db } from '../db/database';

export function useTimeRecords() {
  const records = useLiveQuery(
    () => db.timeRecords.orderBy('date').reverse().toArray(),
    []
  ) ?? [];

  const addRecord = async (type: TimeRecord['type']) => {
    const now = new Date();
    const newRecord: Omit<TimeRecord, 'id'> = {
      date: now.toISOString().split('T')[0],
      time: now.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
      }),
      type,
    };

    await db.timeRecords.add(newRecord);
    return newRecord;
  };

  const getLastRecordType = () => {
    return records.length > 0 ? records[0].type : null;
  };

  const exportToCSV = () => {
    const headers = ['Date', 'Time', 'Type'];
    const csvContent = [
      headers.join(','),
      ...records.map(record => 
        [record.date, record.time, record.type].join(',')
      )
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `time-records-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return {
    records,
    addRecord,
    getLastRecordType,
    exportToCSV,
  };
}