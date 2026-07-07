import React, { useState, useEffect } from "react";
import { Check } from "lucide-react";
import type { OnA2UIAction } from "../a2ui/types";

interface TaskItem {
  taskId: string;
  label: string;
  completed: boolean;
  priority: "high" | "medium" | "low";
}

interface TaskBoardProps {
  id: string;
  title: string;
  tasks: TaskItem[];
  onAction?: OnA2UIAction;
}

export const TaskBoard: React.FC<TaskBoardProps> = ({
  id,
  title,
  tasks: initialTasks,
  onAction
}) => {
  const [tasks, setTasks] = useState<TaskItem[]>(initialTasks);

  // Sync internal state if props change from agent payload
  useEffect(() => {
    setTasks(initialTasks);
  }, [initialTasks]);

  const handleToggleTask = (task: TaskItem) => {
    const nextCompleted = !task.completed;
    
    // Optimistic update
    setTasks(prev => 
      prev.map(t => t.taskId === task.taskId ? { ...t, completed: nextCompleted } : t)
    );

    // Notify agent/backend
    if (onAction) {
      onAction({
        componentId: id,
        surface: "TaskBoard",
        actionType: "toggle_task",
        payload: {
          taskId: task.taskId,
          label: task.label,
          completed: nextCompleted
        },
        timestamp: new Date().toISOString()
      });
    }
  };

  const getPriorityClass = (priority: string) => {
    switch (priority) {
      case "high": return "priority-high";
      case "medium": return "priority-medium";
      default: return "priority-low";
    }
  };

  return (
    <div className="task-board animate-fade-in">
      <div className="task-list-title">
        <h3>{title}</h3>
        <span style={{ fontSize: "0.75rem", color: "var(--text-secondary)" }}>
          {tasks.filter(t => t.completed).length} / {tasks.length} Completed
        </span>
      </div>

      <div className="task-items">
        {tasks.map(task => (
          <div 
            key={task.taskId} 
            className="task-item"
            onClick={() => handleToggleTask(task)}
          >
            <div className="task-item-left">
              <div className={`task-checkbox-custom ${task.completed ? "checked" : ""}`}>
                {task.completed && <Check size={12} strokeWidth={3} />}
              </div>
              <span className={`task-label ${task.completed ? "checked" : ""}`}>
                {task.label}
              </span>
            </div>
            
            <span className={`task-badge-priority ${getPriorityClass(task.priority)}`}>
              {task.priority}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
