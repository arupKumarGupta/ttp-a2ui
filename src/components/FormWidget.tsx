import React, { useState } from "react";
import { Send } from "lucide-react";
import type { OnA2UIAction } from "../a2ui/types";

interface FormField {
  name: string;
  label: string;
  type: "text" | "number" | "select";
  placeholder?: string;
  options?: string[];
  defaultValue?: string;
}

interface FormWidgetProps {
  id: string;
  title: string;
  subtitle?: string;
  fields: FormField[];
  submitLabel?: string;
  onAction?: OnA2UIAction;
}

export const FormWidget: React.FC<FormWidgetProps> = ({
  id,
  title,
  subtitle,
  fields,
  submitLabel = "Submit",
  onAction
}) => {
  // Initialize state with default values
  const [formData, setFormData] = useState<Record<string, string>>(() => {
    const initial: Record<string, string> = {};
    fields.forEach(field => {
      initial[field.name] = field.defaultValue || "";
    });
    return initial;
  });

  const handleChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onAction) {
      onAction({
        componentId: id,
        surface: "FormWidget",
        actionType: "submit_form",
        payload: formData,
        timestamp: new Date().toISOString()
      });
    }
  };

  return (
    <div className="form-widget animate-fade-in">
      <h3 className="form-title">{title}</h3>
      {subtitle && <p className="form-subtitle">{subtitle}</p>}

      <form onSubmit={handleSubmit} className="form-fields">
        {fields.map(field => (
          <div key={field.name} className="form-group">
            <label className="form-label">{field.label}</label>
            
            {field.type === "select" ? (
              <select
                className="form-input"
                value={formData[field.name] || ""}
                onChange={e => handleChange(field.name, e.target.value)}
              >
                <option value="" disabled>Select option...</option>
                {field.options?.map(opt => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            ) : (
              <input
                type={field.type}
                className="form-input"
                placeholder={field.placeholder}
                value={formData[field.name] || ""}
                onChange={e => handleChange(field.name, e.target.value)}
              />
            )}
          </div>
        ))}

        <button type="submit" className="form-button-submit">
          <Send size={14} />
          {submitLabel}
        </button>
      </form>
    </div>
  );
};
