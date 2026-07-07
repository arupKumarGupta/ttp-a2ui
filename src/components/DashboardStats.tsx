import { Clock, CheckCircle2, Clock3, AlertCircle } from 'lucide-react';

interface StatsProps {
  stats: {
    totalCount: number;
    totalHours: string;
    approvedCount: number;
    submittedCount: number;
    openCount: number;
  };
}

export default function DashboardStats({ stats }: StatsProps) {
  return (
    <section className="stats-grid">
      <div className="stat-card">
        <div className="stat-icon icon-blue">
          <Clock size={20} />
        </div>
        <div className="stat-content">
          <span className="stat-label">Total Hours Filtered</span>
          <span className="stat-value">{stats.totalHours} hrs</span>
        </div>
      </div>
      <div className="stat-card">
        <div className="stat-icon icon-green">
          <CheckCircle2 size={20} />
        </div>
        <div className="stat-content">
          <span className="stat-label">Approved Entries</span>
          <span className="stat-value">
            {stats.approvedCount} <span className="stat-sub">/ {stats.totalCount}</span>
          </span>
        </div>
      </div>
      <div className="stat-card">
        <div className="stat-icon icon-amber">
          <Clock3 size={20} />
        </div>
        <div className="stat-content">
          <span className="stat-label">Submitted / Pending</span>
          <span className="stat-value">
            {stats.submittedCount} <span className="stat-sub">/ {stats.totalCount}</span>
          </span>
        </div>
      </div>
      <div className="stat-card">
        <div className="stat-icon icon-purple">
          <AlertCircle size={20} />
        </div>
        <div className="stat-content">
          <span className="stat-label">Open Drafts</span>
          <span className="stat-value">
            {stats.openCount} <span className="stat-sub">/ {stats.totalCount}</span>
          </span>
        </div>
      </div>
    </section>
  );
}
