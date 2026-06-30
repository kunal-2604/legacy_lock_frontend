import { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Check, ChevronDown } from "lucide-react";

export default function CustomSelect({
  value,
  onChange,
  options = [],
  placeholder = "Select option",
  disabled = false,
}) {
  const [open, setOpen] = useState(false);
  const [menuStyle, setMenuStyle] = useState({});
  const triggerRef = useRef(null);
  const menuRef = useRef(null);

  const selectedOption = useMemo(() => {
    return options.find((option) => String(option.value) === String(value));
  }, [options, value]);

  function updateMenuPosition() {
    const trigger = triggerRef.current;
    if (!trigger) return;

    const rect = trigger.getBoundingClientRect();

    setMenuStyle({
      position: "fixed",
      top: `${rect.bottom + 8}px`,
      left: `${rect.left}px`,
      width: `${rect.width}px`,
      zIndex: 99999,
    });
  }

  function toggleOpen() {
    if (disabled) return;

    setOpen((prev) => {
      const next = !prev;

      if (next) {
        requestAnimationFrame(updateMenuPosition);
      }

      return next;
    });
  }

  function handleSelect(option) {
    if (disabled) return;

    onChange?.(option.value);
    setOpen(false);
  }

  useEffect(() => {
    if (!open) return;

    function handleOutside(event) {
      const target = event.target;

      if (triggerRef.current?.contains(target)) return;
      if (menuRef.current?.contains(target)) return;

      setOpen(false);
    }

    function handleReposition() {
      updateMenuPosition();
    }

    document.addEventListener("mousedown", handleOutside);
    document.addEventListener("touchstart", handleOutside);
    window.addEventListener("resize", handleReposition);
    window.addEventListener("scroll", handleReposition, true);

    return () => {
      document.removeEventListener("mousedown", handleOutside);
      document.removeEventListener("touchstart", handleOutside);
      window.removeEventListener("resize", handleReposition);
      window.removeEventListener("scroll", handleReposition, true);
    };
  }, [open]);

  return (
    <>
      <div className="custom-select">
        <button
          ref={triggerRef}
          type="button"
          className={`custom-select-trigger ${open ? "open" : ""}`}
          onClick={toggleOpen}
          disabled={disabled}
        >
          <span className={selectedOption ? "selected" : "placeholder"}>
            {selectedOption ? selectedOption.label : placeholder}
          </span>

          <ChevronDown size={17} />
        </button>
      </div>

      {open &&
        createPortal(
          <div
            ref={menuRef}
            className="custom-select-menu portal-menu"
            style={menuStyle}
          >
            {options.length === 0 ? (
              <div className="custom-select-empty">No receivers available</div>
            ) : (
              options.map((option) => {
                const active = String(option.value) === String(value);

                return (
                  <button
                    type="button"
                    key={option.value}
                    className={`custom-select-option ${active ? "active" : ""}`}
                    onClick={() => handleSelect(option)}
                  >
                    <span>{option.label}</span>
                    {active && <Check size={16} />}
                  </button>
                );
              })
            )}
          </div>,
          document.body
        )}
    </>
  );
}
