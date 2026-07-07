import React from 'react';
import { ChevronDown, ChevronRight, Calendar, MapPin, Clock, Eye, Edit2, Trash2 } from 'lucide-react';
import type { GroupedWorker, TimeEntry } from '../types_timesheet';
import { getEntryMinutes, formatMinutes, getStatusBadgeClass } from '../utils_timesheet';
import type { OnA2UIAction } from '../a2ui/types';

interface WorkerGroupTableProps {
  id: string;
  data: GroupedWorker[];
  expandedGroups: Record<string, boolean>;
  onAction?: OnA2UIAction;
}

export default function WorkerGroupTable({
  id,
  data,
  expandedGroups,
  onAction,
}: WorkerGroupTableProps) {
  
  const handleToggleGroup = (groupKey: string) => {
    onAction?.({
      componentId: id,
      surface: "WorkerGroupTable",
      actionType: "toggle_group",
      payload: { groupKey },
      timestamp: new Date().toISOString()
    });
  };

  const handleView = (entry: TimeEntry) => {
    onAction?.({
      componentId: id,
      surface: "WorkerGroupTable",
      actionType: "open_view",
      payload: { entry },
      timestamp: new Date().toISOString()
    });
  };

  const handleEdit = (entry: TimeEntry) => {
    onAction?.({
      componentId: id,
      surface: "WorkerGroupTable",
      actionType: "open_edit",
      payload: { entry },
      timestamp: new Date().toISOString()
    });
  };

  const handleDelete = (entryId: string) => {
    onAction?.({
      componentId: id,
      surface: "WorkerGroupTable",
      actionType: "delete_entry",
      payload: { id: entryId },
      timestamp: new Date().toISOString()
    });
  };

  return (
    <table className="data-table grouped-table">
      <thead>
        <tr>
          <th>Worker / Work Date</th>
          <th>Customer Allocation</th>
          <th>Department Location</th>
          <th>Status</th>
          <th>Total Logged</th>
          <th className="text-right">Actions</th>
        </tr>
      </thead>
      <tbody>
        {data.map((group) => {
          const workerKey = `worker:${group.worker.id}`;
          const isWorkerExpanded = !!expandedGroups[workerKey];

          return (
            <React.Fragment key={group.worker.id}>
              {/* Worker Header Row */}
              <tr
                className={`group-header-row ${isWorkerExpanded ? 'expanded' : ''}`}
                onClick={() => handleToggleGroup(workerKey)}
              >
                <td colSpan={4}>
                  <div className="group-title-cell">
                    <span className="collapse-toggle">
                      {isWorkerExpanded ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
                    </span>
                    <div className="worker-avatar small-avatar">
                      {group.worker.name.charAt(0)}
                    </div>
                    <div>
                      <span className="group-main-name">{group.worker.name}</span>
                      <span className="group-sub-text">{group.worker.email}</span>
                    </div>
                  </div>
                </td>
                <td className="font-semibold text-primary">
                  <span className="total-badge">
                    {formatMinutes(group.totalMinutes)}
                  </span>
                </td>
                <td className="text-right font-medium text-muted">
                  {group.totalEntriesCount} {group.totalEntriesCount === 1 ? 'entry' : 'entries'}
                </td>
              </tr>

              {/* Worker's Dates (Collapsible) */}
              {isWorkerExpanded &&
                group.dateGroups.map((dateGroup) => {
                  const dateKey = `worker:${group.worker.id}:${dateGroup.date}`;
                  const isDateExpanded = !!expandedGroups[dateKey];

                  return (
                    <React.Fragment key={dateGroup.date}>
                      {/* Date Row under Worker */}
                      <tr
                        className={`nested-sub-header-row ${isDateExpanded ? 'expanded' : ''}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleToggleGroup(dateKey);
                        }}
                      >
                        <td colSpan={4}>
                          <div className="group-title-cell sub-group-cell">
                            <span className="collapse-toggle sub-toggle">
                              {isDateExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                            </span>
                            <Calendar size={14} className="nested-calendar-icon" />
                            <span className="date-title">{dateGroup.date}</span>
                          </div>
                        </td>
                        <td colSpan={2} className="text-right font-semibold">
                          <span className="subtotal-badge">
                            {formatMinutes(dateGroup.totalMinutes)}
                          </span>
                        </td>
                      </tr>

                      {/* Actual leaf rows (Entries on that Date) */}
                      {isDateExpanded &&
                        dateGroup.entries.map((entry) => {
                          const isReadOnly = entry.status === 'SUBMITTED' || entry.status === 'APPROVED';
                          const durationMins = getEntryMinutes(entry);

                          return (
                            <tr key={entry.id} className="leaf-row animate-fade-in">
                              <td className="pl-nested-leaf">
                                <div className="leaf-indicator"></div>
                                <span className="leaf-id-tag">ID: {entry.id}</span>
                              </td>
                              <td>
                                <span className="customer-tag">{entry.timeAgainst.customer}</span>
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
                                  <Clock size={12} className="clock-icon" />
                                  <span>{formatMinutes(durationMins)}</span>
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
                                      <Eye size={14} />
                                      <span>View</span>
                                    </button>
                                  ) : (
                                    <button
                                      className="action-btn btn-edit"
                                      onClick={() => handleEdit(entry)}
                                      title="Edit entry"
                                    >
                                      <Edit2 size={14} />
                                      <span>Edit</span>
                                    </button>
                                  )}
                                  <button
                                    className="action-btn btn-delete"
                                    onClick={() => handleDelete(entry.id)}
                                    title="Delete entry"
                                  >
                                    <Trash2 size={14} />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                    </React.Fragment>
                  );
                })}
            </React.Fragment>
          );
        })}
      </tbody>
    </table>
  );
}
