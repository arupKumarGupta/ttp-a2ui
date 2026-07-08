import { Calendar, MapPin, Clock, Eye, Edit2, Trash2 } from 'lucide-react';
import type { TimeEntry } from '../types_timesheet';
import { getEntryMinutes, formatMinutes, getStatusBadgeClass } from '../utils_timesheet';
import type { OnA2UIAction } from '../a2ui/types';

interface FlatTableProps {
  id: string;
  data: TimeEntry[];
  currentPage?: number;
  totalPages?: number;
  totalItemsCount?: number;
  onAction?: OnA2UIAction;
}

export default function FlatTable({
  id,
  data,
  currentPage = 1,
  totalPages = 1,
  totalItemsCount = 0,
  onAction,
}: FlatTableProps) {
  
  const handleView = (entry: TimeEntry) => {
    onAction?.({
      componentId: id,
      surface: "FlatTable",
      actionType: "open_view",
      payload: { entry },
      timestamp: new Date().toISOString()
    });
  };

  const handleEdit = (entry: TimeEntry) => {
    onAction?.({
      componentId: id,
      surface: "FlatTable",
      actionType: "open_edit",
      payload: { entry },
      timestamp: new Date().toISOString()
    });
  };

  const handleDelete = (entryId: string) => {
    onAction?.({
      componentId: id,
      surface: "FlatTable",
      actionType: "delete_entry",
      payload: { id: entryId },
      timestamp: new Date().toISOString()
    });
  };

  const handlePageChange = (page: number) => {
    onAction?.({
      componentId: id,
      surface: "FlatTable",
      actionType: "set_current_page",
      payload: { page },
      timestamp: new Date().toISOString()
    });
  };

  const itemsPerPage = 10;
  const startRange = totalItemsCount > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0;
  const endRange = Math.min(currentPage * itemsPerPage, totalItemsCount);

  return (
    <div className="table-card">
      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Worker</th>
              <th>Customer</th>
              <th>Date</th>
              <th>Dept / Location</th>
              <th>Status</th>
              <th>Duration</th>
              <th className="text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {data.length === 0 ? (
              <tr>
                <td colSpan={7} style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
                  No time entries matching the current filter.
                </td>
              </tr>
            ) : (
              data.map((entry) => {
                const isReadOnly = entry.status === 'SUBMITTED' || entry.status === 'APPROVED';
                const durationMins = getEntryMinutes(entry);

                return (
                  <tr key={entry.id} className="table-row hover-row animate-fade-in">
                    <td>
                      <div className="worker-info">
                        <span className="worker-avatar">
                          {entry.worker.name ? entry.worker.name.split(" ").map(n => n.charAt(0)).join("").slice(0, 2).toUpperCase() : ""}
                        </span>
                        <div>
                          <div className="worker-name">{entry.worker.name}</div>
                          <div className="worker-email">{entry.worker.email}</div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className="customer-tag">{entry.timeAgainst.customer}</span>
                    </td>
                    <td>
                      <span className="date-badge">
                        <Calendar size={12} style={{ marginRight: '4px' }} />
                        {entry.startDate}
                      </span>
                    </td>
                    <td>
                      <div className="dept-info">
                        <MapPin size={12} className="location-pin" />
                        <span>{entry.department.location}</span>
                      </div>
                    </td>
                    <td>
                      <span className={getStatusBadgeClass(entry.status)}>
                        {entry.status}
                      </span>
                    </td>
                    <td>
                      <div className="duration-info">
                        <span>
                          <Clock size={12} className="clock-icon" />
                          {formatMinutes(durationMins)}
                        </span>
                        {entry.startTime && entry.endTime && (
                          <span className="times-sub">
                            ({entry.startTime} - {entry.endTime})
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="text-right">
                      <div className="actions-cell">
                        {isReadOnly ? (
                          <button
                            className="action-btn btn-view"
                            onClick={() => handleView(entry)}
                            title="View details (submitted/approved)"
                          >
                            <Eye size={16} />
                            <span>View</span>
                          </button>
                        ) : (
                          <button
                            className="action-btn btn-edit"
                            onClick={() => handleEdit(entry)}
                            title="Edit entry"
                          >
                            <Edit2 size={16} />
                            <span>Edit</span>
                          </button>
                        )}
                        <button
                          className="action-btn btn-delete"
                          onClick={() => handleDelete(entry.id)}
                          title="Delete entry"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="table-footer">
          <div className="footer-info">
            <p>
              Showing <strong>{startRange}</strong> to <strong>{endRange}</strong> of{' '}
              <strong>{totalItemsCount}</strong> entries
            </p>
          </div>
          <div className="pagination">
            <button
              className="pag-btn"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              Previous
            </button>
            <div className="pag-pages">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  className={`pag-page-btn ${currentPage === page ? 'active' : ''}`}
                  onClick={() => handlePageChange(page)}
                >
                  {page}
                </button>
              ))}
            </div>
            <button
              className="pag-btn"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
