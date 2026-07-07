import { Search, Calendar, X, RotateCcw } from 'lucide-react';
import type { ViewByOption } from '../types_timesheet';
import type { OnA2UIAction } from '../a2ui/types';

interface ControlBarProps {
  id: string;
  searchQuery: string;
  selectedDate: string;
  viewBy: ViewByOption;
  onAction?: OnA2UIAction;
}

export default function ControlBar({
  id,
  searchQuery,
  selectedDate,
  viewBy,
  onAction,
}: ControlBarProps) {
  
  const handleSearchChange = (query: string) => {
    onAction?.({
      componentId: id,
      surface: "ControlBar",
      actionType: "change_search",
      payload: { query },
      timestamp: new Date().toISOString()
    });
  };

  const handleDateChange = (date: string) => {
    onAction?.({
      componentId: id,
      surface: "ControlBar",
      actionType: "change_date",
      payload: { date },
      timestamp: new Date().toISOString()
    });
  };

  const handleViewChange = (view: ViewByOption) => {
    onAction?.({
      componentId: id,
      surface: "ControlBar",
      actionType: "change_view",
      payload: { view },
      timestamp: new Date().toISOString()
    });
  };

  return (
    <section className="control-bar-card">
      <div className="control-bar">
        <div className="search-box">
          <Search size={18} className="search-icon" />
          <input
            type="text"
            placeholder="Search by worker, customer, location..."
            value={searchQuery}
            onChange={(e) => handleSearchChange(e.target.value)}
          />
          {searchQuery && (
            <button className="clear-btn" onClick={() => handleSearchChange('')}>
              <X size={14} />
            </button>
          )}
        </div>

        <div className="date-picker-group">
          <Calendar size={18} className="control-icon" />
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => handleDateChange(e.target.value)}
            className="date-input"
          />
          {selectedDate && (
            <button
              className="btn-reset"
              onClick={() => handleDateChange('')}
              title="Clear date filter"
            >
              <RotateCcw size={14} />
            </button>
          )}
        </div>

        <div className="view-by-group">
          <span className="control-label">View By:</span>
          <div className="btn-toggle-group">
            <button
              className={`toggle-btn ${viewBy === 'none' ? 'active' : ''}`}
              onClick={() => handleViewChange('none')}
            >
              Flat List
            </button>
            <button
              className={`toggle-btn ${viewBy === 'worker' ? 'active' : ''}`}
              onClick={() => handleViewChange('worker')}
            >
              Worker
            </button>
            <button
              className={`toggle-btn ${viewBy === 'customer' ? 'active' : ''}`}
              onClick={() => handleViewChange('customer')}
            >
              Customer
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
