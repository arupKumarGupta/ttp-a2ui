import React from "react";

interface StackProps {
  gap?: string;
  children: React.ReactNode;
}

export const Stack: React.FC<StackProps> = ({ gap = "16px", children }) => {
  return (
    <div className="surface-stack animate-fade-in" style={{ gap }}>
      {children}
    </div>
  );
};

interface GridProps {
  columns?: number;
  gap?: string;
  children: React.ReactNode;
}

export const Grid: React.FC<GridProps> = ({ columns, gap = "20px", children }) => {
  const gridTemplateColumns = columns 
    ? `repeat(${columns}, minmax(0, 1fr))` 
    : undefined;

  return (
    <div 
      className="surface-grid animate-fade-in" 
      style={{ 
        gap,
        gridTemplateColumns
      }}
    >
      {children}
    </div>
  );
};
