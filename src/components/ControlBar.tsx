import React, { useState, useRef, useEffect } from 'react';
import { Search, Calendar, X, ChevronDown } from 'lucide-react';
import type { ViewByOption } from '../types_timesheet';
import type { OnA2UIAction } from '../a2ui/types';

interface ControlBarProps {
  id: string;
  searchQuery: string;
  datePreset?: string; // 'all' | 'last_week' | 'this_month' | 'last_month' | 'custom'
  startDate?: string;
  endDate?: string;
  viewBy: ViewByOption;
  onAction?: OnA2UIAction;
}

export default function ControlBar({
  id,
  searchQuery,
  datePreset = 'all',
  startDate = '',
  endDate = '',
  viewBy,
  onAction,
}: ControlBarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [tempStartDate, setTempStartDate] = useState(startDate);
  const [tempEndDate, setTempEndDate] = useState(endDate);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Sync state if props update from server
  useEffect(() => {
    setTempStartDate(startDate);
    setTempEndDate(endDate);
  }, [startDate, endDate]);

  // Click outside listener to close dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearchChange = (query: string) => {
    onAction?.({
      componentId: id,
      surface: "ControlBar",
      actionType: "change_search",
      payload: { query },
      timestamp: new Date().toISOString()
    });
  };

  const handlePresetSelect = (preset: string) => {
    if (preset === 'custom') {
      return;
    }
    
    onAction?.({
      componentId: id,
      surface: "ControlBar",
      actionType: "change_date_range",
      payload: { preset, startDate: '', endDate: '' },
      timestamp: new Date().toISOString()
    });
    setIsOpen(false);
  };

  const handleApplyCustomRange = (e: React.FormEvent) => {
    e.preventDefault();
    if (!tempStartDate || !tempEndDate) return;

    onAction?.({
      componentId: id,
      surface: "ControlBar",
      actionType: "change_date_range",
      payload: { preset: 'custom', startDate: tempStartDate, endDate: tempEndDate },
      timestamp: new Date().toISOString()
    });
    setIsOpen(false);
  };

  const handleClearDateFilter = (e: React.MouseEvent) => {
    e.stopPropagation();
    onAction?.({
      componentId: id,
      surface: "ControlBar",
      actionType: "change_date_range",
      payload: { preset: 'all', startDate: '', endDate: '' },
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

  const getFilterLabel = () => {
    if (datePreset === 'all' || !datePreset) return 'All Dates';
    if (datePreset === 'last_week') return 'Last Week';
    if (datePreset === 'last_month') return 'Last Month';
    if (datePreset === 'this_month') return 'This Month';
    if (datePreset === 'custom') {
      if (startDate && endDate) {
        return `${startDate} to ${endDate}`;
      }
      return 'Custom Range';
    }
    return 'All Dates';
  };

  return (
    <section className="control-bar-card">
      <div className="control-bar">
        {/* Search */}
        <div className="search-box">
          <Search size={18} color="#9ca3af" className="search-icon" />
          <input
            type="text"
            placeholder="Search by worker, customer, location..."
            value={searchQuery}
            onChange={(e) => handleSearchChange(e.target.value)}
          />
          {searchQuery && (
            <button className="clear-btn" onClick={() => handleSearchChange('')}>
              <X size={14} color="#9ca3af" />
            </button>
          )}
        </div>

        {/* Date Dropdown */}
        <div className="date-picker-group-container" ref={dropdownRef} style={{ position: 'relative' }}>
          <button 
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '10px 14px',
              background: 'var(--bg-input, #1a1d28)',
              border: '1px solid var(--border-color, #242838)',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '0.85rem',
              color: 'var(--text-primary)',
              minWidth: '220px',
              justifyContent: 'space-between',
              userSelect: 'none',
              fontFamily: 'var(--font-sans)',
              transition: 'border-color 0.2s'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Calendar size={16} color="#8b5cf6" />
              <span style={{ fontWeight: 500 }}>{getFilterLabel()}</span>
            </div>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              {datePreset !== 'all' && (
                <span 
                  onClick={handleClearDateFilter}
                  style={{
                    color: 'var(--text-muted)',
                    cursor: 'pointer',
                    padding: '2px',
                    display: 'flex',
                    alignItems: 'center'
                  }}
                  title="Clear Date Filter"
                >
                  <X size={12} color="#9ca3af" />
                </span>
              )}
              <ChevronDown size={14} color="#9ca3af" />
            </div>
          </button>

          {isOpen && (
            <div 
              style={{
                position: 'absolute',
                top: 'calc(100% + 6px)',
                left: 0,
                background: 'var(--bg-card, #14161f)',
                border: '1px solid var(--border-color, #242838)',
                borderRadius: '8px',
                boxShadow: 'var(--shadow-lg, 0 10px 15px rgba(0,0,0,0.5))',
                zIndex: 100,
                width: '320px',
                padding: '16px',
                display: 'flex',
                flexDirection: 'column',
                gap: '10px'
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Filter by Date
              </div>

              {/* Presets */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                {[
                  { key: 'all', label: 'All Dates' },
                  { key: 'last_week', label: 'Last Week (Last 7 Days)' },
                  { key: 'this_month', label: 'This Month' },
                  { key: 'last_month', label: 'Last Month' }
                ].map((preset) => (
                  <button
                    key={preset.key}
                    type="button"
                    onClick={() => handlePresetSelect(preset.key)}
                    style={{
                      textAlign: 'left',
                      padding: '8px 10px',
                      background: datePreset === preset.key ? 'rgba(139, 92, 246, 0.1)' : 'transparent',
                      border: 'none',
                      borderRadius: '4px',
                      color: datePreset === preset.key ? '#8b5cf6' : 'var(--text-primary)',
                      fontSize: '0.8rem',
                      fontWeight: datePreset === preset.key ? 600 : 500,
                      cursor: 'pointer',
                      transition: 'all 0.15s'
                    }}
                    onMouseEnter={(e) => {
                      if (datePreset !== preset.key) e.currentTarget.style.background = 'var(--bg-input)';
                    }}
                    onMouseLeave={(e) => {
                      if (datePreset !== preset.key) e.currentTarget.style.background = 'transparent';
                    }}
                  >
                    {preset.label}
                  </button>
                ))}
              </div>

              {/* Custom Date Range Option */}
              <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '10px', marginTop: '4px' }}>
                <button
                  type="button"
                  onClick={() => handlePresetSelect('custom')}
                  style={{
                    width: '100%',
                    textAlign: 'left',
                    padding: '6px 10px',
                    background: 'transparent',
                    border: 'none',
                    color: datePreset === 'custom' ? '#8b5cf6' : 'var(--text-primary)',
                    fontSize: '0.8rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    marginBottom: '8px'
                  }}
                >
                  📅 Custom Date Range
                </button>

                <form onSubmit={handleApplyCustomRange} style={{ display: 'flex', flexDirection: 'column', gap: '8px', padding: '0 10px' }}>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      <label style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>Start Date</label>
                      <input 
                        type="date" 
                        value={tempStartDate}
                        onChange={(e) => setTempStartDate(e.target.value)}
                        required
                        style={{
                          background: 'var(--bg-input)',
                          border: '1px solid var(--border-color)',
                          borderRadius: '4px',
                          color: 'var(--text-primary)',
                          fontSize: '0.75rem',
                          padding: '6px 8px',
                          outline: 'none',
                          width: '100%',
                          boxSizing: 'border-box'
                        }}
                      />
                    </div>
                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      <label style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>End Date</label>
                      <input 
                        type="date" 
                        value={tempEndDate}
                        onChange={(e) => setTempEndDate(e.target.value)}
                        required
                        style={{
                          background: 'var(--bg-input)',
                          border: '1px solid var(--border-color)',
                          borderRadius: '4px',
                          color: 'var(--text-primary)',
                          fontSize: '0.75rem',
                          padding: '6px 8px',
                          outline: 'none',
                          width: '100%',
                          boxSizing: 'border-box'
                        }}
                      />
                    </div>
                  </div>
                  <button 
                    type="submit"
                    style={{
                      background: 'var(--color-primary, #8b5cf6)',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      padding: '8px',
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                      transition: 'background 0.2s',
                      marginTop: '4px'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.background = '#7c3aed'}
                    onMouseLeave={(e) => e.currentTarget.style.background = 'var(--color-primary)'}
                  >
                    Apply Range
                  </button>
                </form>
              </div>
            </div>
          )}
        </div>

        {/* View Toggle */}
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
