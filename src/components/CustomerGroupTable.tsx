import React from 'react';
import { ChevronDown, ChevronRight, Briefcase, Calendar, MapPin, Clock, Eye, Edit2, Trash2 } from 'lucide-react';
import type { GroupedCustomer, TimeEntry } from '../types_timesheet';
import { getEntryMinutes, formatMinutes, getStatusBadgeClass } from '../utils_timesheet';
import type { OnA2UIAction } from '../a2ui/types';

interface CustomerGroupTableProps {
  id: string;
  data: GroupedCustomer[];
  expandedGroups: Record<string, boolean>;
  currentPage?: number;
  totalPages?: number;
  totalItemsCount?: number;
  onAction?: OnA2UIAction;
}

export default function CustomerGroupTable({
  id,
  data,
  expandedGroups,
  currentPage = 1,
  totalPages = 1,
  totalItemsCount = 0,
  onAction,
}: CustomerGroupTableProps) {
  
  const handleToggleGroup = (groupKey: string) => {
    onAction?.({
      componentId: id,
      surface: "CustomerGroupTable",
      actionType: "toggle_group",
      payload: { groupKey },
      timestamp: new Date().toISOString()
    });
  };

  const handleView = (entry: TimeEntry) => {
    onAction?.({
      componentId: id,
      surface: "CustomerGroupTable",
      actionType: "open_view",
      payload: { entry },
      timestamp: new Date().toISOString()
    });
  };

  const handleEdit = (entry: TimeEntry) => {
    onAction?.({
      componentId: id,
      surface: "CustomerGroupTable",
      actionType: "open_edit",
      payload: { entry },
      timestamp: new Date().toISOString()
    });
  };

  const handleDelete = (entryId: string) => {
    onAction?.({
      componentId: id,
      surface: "CustomerGroupTable",
      actionType: "delete_entry",
      payload: { id: entryId },
      timestamp: new Date().toISOString()
    });
  };

  const handlePageChange = (page: number) => {
    onAction?.({
      componentId: id,
      surface: "CustomerGroupTable",
      actionType: "set_current_page",
      payload: { page },
      timestamp: new Date().toISOString()
    });
  };

  const itemsPerPage = 5;
  const startRange = totalItemsCount > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0;
  const endRange = Math.min(currentPage * itemsPerPage, totalItemsCount);

  return (
    <div className="table-card">
      <div className="table-container">
        <table className="data-table grouped-table">
          <thead>
            <tr>
              <th>Customer / Allocated Employee</th>
              <th>Work Location</th>
              <th>Timesheet Status</th>
              <th>Total Logged</th>
              <th>Time Entries Detail</th>
              <th className="text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {data.length === 0 ? (
              <tr>
                <td colSpan={6} style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
                  No customer groups matching the current filter.
                </td>
              </tr>
            ) : (
              data.map((group) => {
                const customerKey = `customer:${group.customer.id}`;
                const isCustomerExpanded = !!expandedGroups[customerKey];

                return (
                  <React.Fragment key={group.customer.id}>
                    {/* Customer Header Row */}
                    <tr
                      className={`group-header-row customer-row ${isCustomerExpanded ? 'expanded' : ''}`}
                      onClick={() => handleToggleGroup(customerKey)}
                    >
                      <td colSpan={3}>
                        <div className="group-title-cell">
                          <span className="collapse-toggle">
                            {isCustomerExpanded ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
                          </span>
                          <div className="customer-avatar-icon">
                            <Briefcase size={16} />
                          </div>
                          <div>
                            <span className="group-main-name">{group.customer.customer}</span>
                            <span className="group-sub-text">Client ID: {group.customer.id}</span>
                          </div>
                        </div>
                      </td>
                      <td className="font-semibold text-success">
                        <span className="total-badge total-badge-green">
                          {formatMinutes(group.totalMinutes)}
                        </span>
                      </td>
                      <td colSpan={2} className="text-right font-medium text-muted">
                        {group.totalEntriesCount} {group.totalEntriesCount === 1 ? 'entry' : 'entries'}
                      </td>
                    </tr>

                    {/* Customer's Employees (Collapsible) */}
                    {isCustomerExpanded &&
                      group.workerGroups.map((workerGroup) => {
                        const workerKey = `customer:${group.customer.id}:${workerGroup.worker.id}`;
                        const isWorkerExpanded = !!expandedGroups[workerKey];

                        return (
                          <React.Fragment key={workerGroup.worker.id}>
                            {/* Employee sub-row under Customer */}
                            <tr
                              className={`nested-sub-header-row ${isWorkerExpanded ? 'expanded' : ''}`}
                              onClick={(e) => {
                                e.stopPropagation();
                                handleToggleGroup(workerKey);
                              }}
                            >
                              <td colSpan={3}>
                                <div className="group-title-cell sub-group-cell">
                                  <span className="collapse-toggle sub-toggle">
                                    {isWorkerExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                                  </span>
                                  <div className="worker-avatar micro-avatar">
                                    {workerGroup.worker.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()}
                                  </div>
                                  <div>
                                    <span className="worker-nested-name">{workerGroup.worker.name}</span>
                                    <span className="worker-nested-email">{workerGroup.worker.email}</span>
                                  </div>
                                </div>
                              </td>
                              <td colSpan={3} className="text-right font-semibold">
                                <span className="subtotal-badge subtotal-badge-blue">
                                  {formatMinutes(workerGroup.totalMinutes)}
                                </span>
                              </td>
                            </tr>

                            {/* Expansion of Employee details to show nested table */}
                            {isWorkerExpanded && (
                              <tr>
                                <td colSpan={6} className="nested-table-container-cell">
                                  <div className="nested-table-wrapper animate-slide-down">
                                    <table className="nested-detail-table">
                                      <thead>
                                        <tr>
                                          <th>Entry ID</th>
                                          <th>Work Date</th>
                                          <th>Dept / Location</th>
                                          <th>Status</th>
                                          <th>Duration Details</th>
                                          <th className="text-right">Actions</th>
                                        </tr>
                                      </thead>
                                      <tbody>
                                        {workerGroup.entries.map((entry) => {
                                          const isReadOnly = entry.status === 'SUBMITTED' || entry.status === 'APPROVED';
                                          const durationMins = getEntryMinutes(entry);

                                          return (
                                            <tr key={entry.id} className="nested-detail-row">
                                              <td>
                                                <span className="nested-entry-id">{entry.id}</span>
                                              </td>
                                              <td>
                                                <span className="date-badge">
                                                  <Calendar size={11} style={{ marginRight: '4px' }} />
                                                  {entry.startDate}
                                                </span>
                                              </td>
                                              <td>
                                                <div className="dept-info">
                                                  <MapPin size={11} className="location-pin" />
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
                                                    <Clock size={11} className="clock-icon" />
                                                    <strong>{formatMinutes(durationMins)}</strong>
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
                                                      title="View details"
                                                    >
                                                      <Eye size={13} />
                                                      <span>View</span>
                                                    </button>
                                                  ) : (
                                                    <button
                                                      className="action-btn btn-edit"
                                                      onClick={() => handleEdit(entry)}
                                                      title="Edit entry"
                                                    >
                                                      <Edit2 size={13} />
                                                      <span>Edit</span>
                                                    </button>
                                                  )}
                                                  <button
                                                    className="action-btn btn-delete"
                                                    onClick={() => handleDelete(entry.id)}
                                                    title="Delete entry"
                                                  >
                                                    <Trash2 size={13} />
                                                  </button>
                                                </div>
                                              </td>
                                            </tr>
                                          );
                                        })}
                                      </tbody>
                                    </table>
                                  </div>
                                </td>
                              </tr>
                            )}
                          </React.Fragment>
                        );
                      })}
                  </React.Fragment>
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
              <strong>{totalItemsCount}</strong> customers
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
