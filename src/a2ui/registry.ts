import React from "react";
import { Stack, Grid } from "../components/Layouts";
import { Card } from "../components/Card";
import { FlightCard } from "../components/FlightCard";
import { WeatherWidget } from "../components/WeatherWidget";
import { TaskBoard } from "../components/TaskBoard";
import { FormWidget } from "../components/FormWidget";
import DashboardStats from "../components/DashboardStats";
import ControlBar from "../components/ControlBar";
import FlatTable from "../components/FlatTable";
import WorkerGroupTable from "../components/WorkerGroupTable";
import CustomerGroupTable from "../components/CustomerGroupTable";
import TimeEntryFormModal from "../components/TimeEntryFormModal";
import TabBar from "../components/TabBar";

/**
 * Registry mapping component string keys to React components.
 */
export const A2UIRegistry: Record<string, React.ComponentType<any>> = {
  Stack,
  Grid,
  Card,
  FlightCard,
  WeatherWidget,
  TaskBoard,
  FormWidget,
  DashboardStats,
  ControlBar,
  FlatTable,
  WorkerGroupTable,
  CustomerGroupTable,
  TimeEntryFormModal,
  TabBar
};

/**
 * Helper to check if a component is registered.
 */
export const isComponentRegistered = (name: string): boolean => {
  return Object.prototype.hasOwnProperty.call(A2UIRegistry, name);
};
