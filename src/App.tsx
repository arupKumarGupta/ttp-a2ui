import { useState, useEffect } from "react";
import PlaygroundView from "./PlaygroundView";
import TimesheetView from "./TimesheetView";

export default function App() {
  const [route, setRoute] = useState<string>(window.location.hash || "#/");

  useEffect(() => {
    const handleHashChange = () => {
      setRoute(window.location.hash || "#/");
    };
    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  const isTimesheetRoute = route.startsWith("#/timesheet") || window.location.pathname === "/timesheet";

  if (isTimesheetRoute) {
    return <TimesheetView />;
  }

  return <PlaygroundView />;
}
