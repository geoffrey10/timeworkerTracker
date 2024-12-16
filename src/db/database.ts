import Dexie, { Table } from 'dexie';
import { TimeRecord } from '../types/timeTracking';

export class TimeTrackerDB extends Dexie {
  timeRecords!: Table<TimeRecord>;

  constructor() {
    super('TimeTrackerDB');
    this.version(1).stores({
      timeRecords: '++id, date, time, type'
    });
  }
}

export const db = new TimeTrackerDB();