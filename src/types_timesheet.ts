export interface Worker {
  id: string;
  name: string;
  email: string;
}

export interface Customer {
  customer: string; // client name
  id: string;
}

export interface Department {
  location: string;
  id: string;
}

export interface TimeEntry {
  id: string;
  worker: Worker;
  timeAgainst: Customer;
  status: 'OPEN' | 'SUBMITTED' | 'APPROVED';
  duration: string | null;
  startTime: string | null;
  endTime: string | null;
  startDate: string; // YYYY-MM-DD
  department: Department;
}

export type ViewByOption = 'none' | 'worker' | 'customer';

// Grouping interfaces for Worker-first view
export interface GroupedWorkerDate {
  date: string;
  entries: TimeEntry[];
  totalMinutes: number;
}

export interface GroupedWorker {
  worker: Worker;
  totalMinutes: number;
  dateGroups: GroupedWorkerDate[];
  totalEntriesCount: number;
}

// Grouping interfaces for Customer-first view
export interface GroupedCustomerWorker {
  worker: Worker;
  entries: TimeEntry[];
  totalMinutes: number;
}

export interface GroupedCustomer {
  customer: Customer;
  totalMinutes: number;
  workerGroups: GroupedCustomerWorker[];
  totalEntriesCount: number;
}
