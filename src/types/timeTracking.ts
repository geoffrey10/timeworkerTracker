export type CheckType = 'CHECK_IN' | 'CHECK_OUT';

export interface TimeRecord {
  id: string;
  date: string;
  time: string;
  type: CheckType;
}

export interface DailyStats {
  date: string;
  checkIn: string | null;
  checkOut: string | null;
  workingHours: number;
}

export interface WeeklyStats {
  weekStart: string;
  weekEnd: string;
  totalHours: number;
  checkCount: number;
  averageHoursPerCheck: number;
  dailyStats: DailyStats[];
}