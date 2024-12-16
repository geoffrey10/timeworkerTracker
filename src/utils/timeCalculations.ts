import { TimeRecord, DailyStats, WeeklyStats } from '../types/timeTracking';
import { startOfWeek, endOfWeek, parseISO, format } from 'date-fns';

export const calculateWorkingHours = (checkIn: string, checkOut: string): number => {
  const [checkInHours, checkInMinutes] = checkIn.split(':').map(Number);
  const [checkOutHours, checkOutMinutes] = checkOut.split(':').map(Number);
  
  const totalMinutes = 
    (checkOutHours * 60 + checkOutMinutes) - 
    (checkInHours * 60 + checkInMinutes);
  
  return totalMinutes / 60;
};

export const calculateDailyStats = (records: TimeRecord[]): DailyStats[] => {
  const dailyMap = new Map<string, TimeRecord[]>();
  
  // Group records by date
  records.forEach(record => {
    if (!dailyMap.has(record.date)) {
      dailyMap.set(record.date, []);
    }
    dailyMap.get(record.date)?.push(record);
  });

  return Array.from(dailyMap.entries()).map(([date, dayRecords]) => {
    // Get all check-ins and check-outs for the day
    const checkIns = dayRecords.filter(r => r.type === 'CHECK_IN');
    const checkOuts = dayRecords.filter(r => r.type === 'CHECK_OUT');

    // Get earliest check-in and latest check-out
    const earliestCheckIn = checkIns.length > 0 
      ? checkIns.reduce((earliest, current) => 
          current.time < earliest.time ? current : earliest
        ).time
      : null;

    const latestCheckOut = checkOuts.length > 0
      ? checkOuts.reduce((latest, current) => 
          current.time > latest.time ? current : latest
        ).time
      : null;

    const workingHours = earliestCheckIn && latestCheckOut 
      ? calculateWorkingHours(earliestCheckIn, latestCheckOut)
      : 0;

    return {
      date,
      checkIn: earliestCheckIn,
      checkOut: latestCheckOut,
      workingHours,
    };
  }).sort((a, b) => b.date.localeCompare(a.date));
};

export const calculateWeeklyStats = (dailyStats: DailyStats[]): WeeklyStats[] => {
  const weekMap = new Map<string, DailyStats[]>();

  // Group daily stats by week
  dailyStats.forEach(stat => {
    const date = parseISO(stat.date);
    const weekStartDate = startOfWeek(date, { weekStartsOn: 1 });
    const weekKey = format(weekStartDate, 'yyyy-MM-dd');

    if (!weekMap.has(weekKey)) {
      weekMap.set(weekKey, []);
    }
    weekMap.get(weekKey)?.push(stat);
  });

  return Array.from(weekMap.entries()).map(([weekStart, stats]) => {
    const startDate = parseISO(weekStart);
    const endDate = endOfWeek(startDate, { weekStartsOn: 1 });

    // Calculate total hours and check count
    const completedChecks = stats.filter(s => s.checkIn && s.checkOut);
    const totalHours = completedChecks.reduce((sum, stat) => sum + stat.workingHours, 0);
    const checkCount = completedChecks.length;

    return {
      weekStart: weekStart,
      weekEnd: format(endDate, 'yyyy-MM-dd'),
      totalHours,
      checkCount,
      averageHoursPerCheck: checkCount > 0 ? totalHours / checkCount : 0,
      dailyStats: stats,
    };
  }).sort((a, b) => b.weekStart.localeCompare(a.weekStart));
};