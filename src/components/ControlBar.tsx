import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import { Search, Calendar, X, ChevronDown } from 'lucide-react';
import type { ViewByOption } from '../types_timesheet';
import type { OnA2UIAction } from '../a2ui/types';

const PickerContainer = styled.div`
  position: relative;
  display: flex;
  align-items: center;
`;

const PickerButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  height: 40px;
  box-sizing: border-box;
  padding: 0 14px;
  background: var(--bg-input, #1a1d28);
  border: 1px solid var(--border-color, #242838);
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.85rem;
  color: var(--text-primary);
  min-width: 220px;
  justify-content: space-between;
  user-select: none;
  font-family: var(--font-sans);
  transition: border-color 0.2s;
  
  &:hover {
    border-color: var(--color-primary, #8b5cf6);
  }
`;

const DropdownMenu = styled.div`
  position: absolute;
  top: calc(100% + 6px);
  left: 0;
  background-color: var(--bg-card, #14161f);
  border: 1px solid var(--border-color, #242838);
  border-radius: 8px;
  box-shadow: var(--shadow-lg, 0 10px 15px rgba(0,0,0,0.5));
  z-index: 100;
  width: 320px;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const PresetButton = styled.button<{ $active: boolean }>`
  text-align: left;
  padding: 8px 10px;
  background: ${props => props.$active ? 'rgba(139, 92, 246, 0.1)' : 'transparent'};
  border: none;
  border-radius: 4px;
  color: ${props => props.$active ? '#8b5cf6' : 'var(--text-primary)'};
  font-size: 0.8rem;
  font-weight: ${props => props.$active ? 600 : 500};
  cursor: pointer;
  transition: all 0.15s;
  
  &:hover {
    background: ${props => props.$active ? 'rgba(139, 92, 246, 0.1)' : 'var(--bg-input)'};
  }
`;

const CustomRangeTitle = styled.button<{ $active: boolean }>`
  width: 100%;
  text-align: left;
  padding: 6px 10px;
  background: transparent;
  border: none;
  color: ${props => props.$active ? '#8b5cf6' : 'var(--text-primary)'};
  font-size: 0.8rem;
  font-weight: 600;
  cursor: pointer;
  margin-bottom: 8px;
`;

const CustomForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 0 10px;
`;

const DateInputsRow = styled.div`
  display: flex;
  gap: 8px;
`;

const InputGroup = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const InputLabel = styled.label`
  font-size: 0.65rem;
  color: var(--text-muted);
`;

const DateInput = styled.input`
  background: var(--bg-input);
  border: 1px solid var(--border-color);
  border-radius: 4px;
  color: var(--text-primary);
  font-size: 0.75rem;
  padding: 6px 8px;
  outline: none;
  width: 100%;
  box-sizing: border-box;
  cursor: pointer;
  
  &:focus {
    border-color: var(--color-primary);
  }

  &::-webkit-calendar-picker-indicator {
    filter: invert(1);
    cursor: pointer;
  }
`;

const ApplyButton = styled.button`
  background: var(--color-primary, #8b5cf6);
  color: white;
  border: none;
  border-radius: 4px;
  padding: 8px;
  font-size: 0.75rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
  margin-top: 4px;
  
  &:hover {
    background: #7c3aed;
  }
`;

// Force Lucide icons stroke via styled-components !important rules
const StyledCalendar = styled(Calendar)`
  color: #8b5cf6 !important;
  stroke: #8b5cf6 !important;
`;

const StyledChevronDown = styled(ChevronDown)`
  color: #9ca3af !important;
  stroke: #9ca3af !important;
`;

const StyledX = styled(X)`
  color: #9ca3af !important;
  stroke: #9ca3af !important;
`;

const StyledSearch = styled(Search)`
  color: #9ca3af !important;
  stroke: #9ca3af !important;
`;

interface ControlBarProps {
  id: string;
  searchQuery: string;
  datePreset?: string;
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
          <StyledSearch size={18} className="search-icon" />
          <input
            type="text"
            placeholder="Search by worker, customer, location..."
            value={searchQuery}
            onChange={(e) => handleSearchChange(e.target.value)}
          />
          {searchQuery && (
            <button className="clear-btn" onClick={() => handleSearchChange('')}>
              <StyledX size={14} />
            </button>
          )}
        </div>

        {/* Date Dropdown */}
        <PickerContainer ref={dropdownRef}>
          <PickerButton type="button" onClick={() => setIsOpen(!isOpen)}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <StyledCalendar size={16} />
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
                  <StyledX size={12} />
                </span>
              )}
              <StyledChevronDown size={14} />
            </div>
          </PickerButton>

          {isOpen && (
            <DropdownMenu onClick={(e) => e.stopPropagation()}>
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
                  <PresetButton
                    key={preset.key}
                    type="button"
                    $active={datePreset === preset.key}
                    onClick={() => handlePresetSelect(preset.key)}
                  >
                    {preset.label}
                  </PresetButton>
                ))}
              </div>

              {/* Custom Date Range Option */}
              <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '10px', marginTop: '4px' }}>
                <CustomRangeTitle
                  type="button"
                  $active={datePreset === 'custom'}
                  onClick={() => handlePresetSelect('custom')}
                >
                  📅 Custom Date Range
                </CustomRangeTitle>

                <CustomForm onSubmit={handleApplyCustomRange}>
                  <DateInputsRow>
                    <InputGroup>
                      <InputLabel>Start Date</InputLabel>
                      <DateInput 
                        type="date" 
                        value={tempStartDate}
                        onChange={(e) => setTempStartDate(e.target.value)}
                        onClick={(e) => { try { e.currentTarget.showPicker(); } catch(_) {} }}
                        required
                      />
                    </InputGroup>
                    <InputGroup>
                      <InputLabel>End Date</InputLabel>
                      <DateInput 
                        type="date" 
                        value={tempEndDate}
                        onChange={(e) => setTempEndDate(e.target.value)}
                        onClick={(e) => { try { e.currentTarget.showPicker(); } catch(_) {} }}
                        required
                      />
                    </InputGroup>
                  </DateInputsRow>
                  <ApplyButton type="submit">
                    Apply Range
                  </ApplyButton>
                </CustomForm>
              </div>
            </DropdownMenu>
          )}
        </PickerContainer>

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
