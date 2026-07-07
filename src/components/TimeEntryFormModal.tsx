import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Eye, X, User, Briefcase, Clock } from 'lucide-react';
import type { Worker, Customer, Department } from '../types_timesheet';
import type { OnA2UIAction } from '../a2ui/types';

interface FormState {
  workerName: string;
  workerEmail: string;
  customerName: string;
  startDate: string;
  duration: string;
  startTime: string;
  endTime: string;
  status: 'OPEN' | 'SUBMITTED' | 'APPROVED';
  location: string;
  useStartEndTimes: boolean;
}

interface TimeEntryFormModalProps {
  id: string;
  modalMode: 'create' | 'edit' | 'view';
  initialFormState: FormState;
  autocompletes: {
    workers: Worker[];
    customers: Customer[];
    departments: Department[];
  };
  onAction?: OnA2UIAction;
}

export default function TimeEntryFormModal({
  id,
  modalMode,
  initialFormState,
  autocompletes,
  onAction,
}: TimeEntryFormModalProps) {
  const [formState, setFormState] = useState<FormState>(initialFormState);

  // Sync state if initial values change
  useEffect(() => {
    setFormState(initialFormState);
  }, [initialFormState]);

  const handleClose = () => {
    onAction?.({
      componentId: id,
      surface: "TimeEntryFormModal",
      actionType: "close_modal",
      payload: {},
      timestamp: new Date().toISOString()
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAction?.({
      componentId: id,
      surface: "TimeEntryFormModal",
      actionType: "save_entry",
      payload: { formState },
      timestamp: new Date().toISOString()
    });
  };

  return (
    <div className="modal-backdrop animate-fade-in" onClick={handleClose}>
      <div className="modal-content animate-slide-up" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title-group">
            {modalMode === 'create' && <Plus className="text-primary" />}
            {modalMode === 'edit' && <Edit2 className="text-amber" />}
            {modalMode === 'view' && <Eye className="text-success" />}
            <h2>
              {modalMode === 'create' && 'Log New Time Entry'}
              {modalMode === 'edit' && 'Edit Time Entry'}
              {modalMode === 'view' && 'View Time Entry Details'}
            </h2>
          </div>
          <button className="btn-close" onClick={handleClose}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-grid">
            {/* Worker Section */}
            <div className="form-section">
              <h3>
                <User size={16} style={{ marginRight: '6px' }} /> Worker Identity
              </h3>
              <div className="form-group">
                <label htmlFor="workerName">Worker Full Name *</label>
                <input
                  id="workerName"
                  type="text"
                  placeholder="e.g. John Doe"
                  disabled={modalMode === 'view'}
                  value={formState.workerName}
                  onChange={(e) => setFormState({ ...formState, workerName: e.target.value })}
                  list="workers-list"
                  required
                />
                <datalist id="workers-list">
                  {autocompletes.workers.map((w) => (
                    <option key={w.id} value={w.name} />
                  ))}
                </datalist>
              </div>

              <div className="form-group">
                <label htmlFor="workerEmail">Email Address</label>
                <input
                  id="workerEmail"
                  type="email"
                  placeholder="e.g. john.doe@company.com"
                  disabled={modalMode === 'view'}
                  value={formState.workerEmail}
                  onChange={(e) => setFormState({ ...formState, workerEmail: e.target.value })}
                />
              </div>
            </div>

            {/* Allocation Section */}
            <div className="form-section">
              <h3>
                <Briefcase size={16} style={{ marginRight: '6px' }} /> Client & Location
              </h3>
              <div className="form-group">
                <label htmlFor="customerName">Client / Customer *</label>
                <input
                  id="customerName"
                  type="text"
                  placeholder="e.g. Hooli"
                  disabled={modalMode === 'view'}
                  value={formState.customerName}
                  onChange={(e) => setFormState({ ...formState, customerName: e.target.value })}
                  list="customers-list"
                  required
                />
                <datalist id="customers-list">
                  {autocompletes.customers.map((c) => (
                    <option key={c.id} value={c.customer} />
                  ))}
                </datalist>
              </div>

              <div className="form-group">
                <label htmlFor="location">Department Location *</label>
                <select
                  id="location"
                  disabled={modalMode === 'view'}
                  value={formState.location}
                  onChange={(e) => setFormState({ ...formState, location: e.target.value })}
                  required
                >
                  <option value="New York">New York (HQ)</option>
                  <option value="San Francisco">San Francisco (West)</option>
                  <option value="Chicago">Chicago (Midwest)</option>
                  <option value="Seattle">Seattle (Northwest)</option>
                  <option value="Austin">Austin (South)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Time Configuration */}
          <div className="form-section time-section-box">
            <h3>
              <Clock size={16} style={{ marginRight: '6px' }} /> Time Sheet Records
            </h3>

            <div className="form-grid">
              <div className="form-group">
                <label htmlFor="startDate">Work Log Date *</label>
                <input
                  id="startDate"
                  type="date"
                  disabled={modalMode === 'view'}
                  value={formState.startDate}
                  onChange={(e) => setFormState({ ...formState, startDate: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="status">Approval Status</label>
                <select
                  id="status"
                  disabled={modalMode === 'view'}
                  value={formState.status}
                  onChange={(e) =>
                    setFormState({ ...formState, status: e.target.value as any })
                  }
                >
                  <option value="OPEN">OPEN (Editable Draft)</option>
                  <option value="SUBMITTED">SUBMITTED (Locked for Review)</option>
                  <option value="APPROVED">APPROVED (Locked & Verified)</option>
                </select>
              </div>
            </div>

            {/* Option to toggle duration or start/end times */}
            {modalMode !== 'view' && (
              <div className="checkbox-group">
                <input
                  type="checkbox"
                  id="useStartEndTimes"
                  checked={formState.useStartEndTimes}
                  onChange={(e) =>
                    setFormState({ ...formState, useStartEndTimes: e.target.checked })
                  }
                />
                <label htmlFor="useStartEndTimes">
                  Use Start & End times instead of flat duration
                </label>
              </div>
            )}

            <div className="form-grid time-inputs-row">
              {formState.useStartEndTimes ? (
                <>
                  <div className="form-group">
                    <label htmlFor="startTime">Start Time *</label>
                    <input
                      id="startTime"
                      type="time"
                      disabled={modalMode === 'view'}
                      value={formState.startTime}
                      onChange={(e) => setFormState({ ...formState, startTime: e.target.value })}
                      required={formState.useStartEndTimes}
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="endTime">End Time *</label>
                    <input
                      id="endTime"
                      type="time"
                      disabled={modalMode === 'view'}
                      value={formState.endTime}
                      onChange={(e) => setFormState({ ...formState, endTime: e.target.value })}
                      required={formState.useStartEndTimes}
                    />
                  </div>
                </>
              ) : (
                <div className="form-group">
                  <label htmlFor="duration">Logged Duration (HH:MM) *</label>
                  <input
                    id="duration"
                    type="text"
                    placeholder="e.g. 08:30"
                    pattern="^[0-9]{2}:[0-5][0-9]$"
                    title="Format must be HH:MM (e.g. 08:00 or 12:45)"
                    disabled={modalMode === 'view'}
                    value={formState.duration}
                    onChange={(e) => setFormState({ ...formState, duration: e.target.value })}
                    required={!formState.useStartEndTimes}
                  />
                </div>
              )}
            </div>
          </div>

          {/* Form Buttons */}
          <div className="form-actions">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={handleClose}
            >
              Cancel
            </button>
            {modalMode !== 'view' && (
              <button type="submit" className="btn btn-primary">
                {modalMode === 'create' ? 'Create Entry' : 'Save Changes'}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
