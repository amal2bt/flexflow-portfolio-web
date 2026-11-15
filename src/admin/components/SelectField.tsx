import { useEffect, useRef, useState, type ReactNode } from "react";

export function SelectField({ 
  label, 
  value, 
  options,
  onChange
}: { 
  label: string; 
  value: string; 
  options: Array<{ value: string; label?: ReactNode }>;
  onChange?: (value: string) => void;
}) {
  const [selectedValue, setSelectedValue] = useState(value);
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setSelectedValue(value);
  }, [value]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selectedOption = options.find((o) => o.value === selectedValue) || options[0];

  return (
    <div className="field" ref={containerRef} style={{ position: "relative" }}>
      <span>{label}</span>
      <input type="hidden" name={label} value={selectedValue} />
      
      <div className="custom-select">
        <button
          type="button"
          className="custom-select-trigger"
          onClick={() => setIsOpen(!isOpen)}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            width: "100%",
            background: "white",
            border: "1px solid var(--border-color, #ccc)",
            padding: "8px 12px",
            borderRadius: "4px",
            cursor: "pointer",
            textAlign: "left"
          }}
        >
          <span>{selectedOption?.label ?? selectedOption?.value}</span>
          <span style={{ fontSize: "10px", marginLeft: "8px" }}>▼</span>
        </button>

        {isOpen && (
          <div
            className="custom-select-options"
            style={{
              position: "absolute",
              top: "100%",
              left: 0,
              right: 0,
              background: "white",
              border: "1px solid var(--border-color, #ccc)",
              borderRadius: "4px",
              boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
              zIndex: 999, // Ensure it sits above modal contents
              maxHeight: "160px", // Reduced height so it fits nicely
              overflowY: "auto",
              marginTop: "4px"
            }}
          >
            {options.map((o) => (
              <div
                key={o.value}
                onClick={() => {
                  setSelectedValue(o.value);
                  setIsOpen(false);
                  onChange?.(o.value);
                }}
                style={{
                  padding: "8px 12px",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  background: o.value === selectedValue ? "var(--hover-bg, #f0f0f0)" : "white"
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = "var(--hover-bg, #f8f8f8)")}
                onMouseLeave={(e) => (e.currentTarget.style.background = o.value === selectedValue ? "var(--hover-bg, #f0f0f0)" : "white")}
              >
                {o.label ?? o.value}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}