import type { TimeEntry } from './types_timesheet';

// Helper to convert duration/times to minutes
export const getEntryMinutes = (entry: TimeEntry): number => {
  if (entry.duration) {
    const [hours, minutes] = entry.duration.split(':').map(Number);
    return hours * 60 + minutes;
  } else if (entry.startTime && entry.endTime) {
    const [startH, startM] = entry.startTime.split(':').map(Number);
    const [endH, endM] = entry.endTime.split(':').map(Number);
    const startMin = startH * 60 + startM;
    const endMin = endH * 60 + endM;
    return Math.max(0, endMin - startMin); // Assumes single-day shifts
  }
  return 0;
};

// Helper to format minutes to "HH:MM"
export const formatMinutes = (totalMinutes: number): string => {
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
};

// Helper to return status badge classes
export const getStatusBadgeClass = (status: string): string => {
  switch (status) {
    case 'APPROVED':
      return 'badge badge-approved';
    case 'SUBMITTED':
      return 'badge badge-submitted';
    default:
      return 'badge badge-open';
  }
};
