import { useEffect, useRef, useState } from "react";

function SelectField({ value, onChange, options }) {
    const [open, setOpen] = useState(false);
    const rootRef = useRef(null);

    const selected = options.find((option) => String(option.value) === String(value));

    useEffect(() => {
        if (!open) return;

        function handlePointerDown(event) {
            if (!rootRef.current?.contains(event.target)) {
                setOpen(false);
            }
        }

        function handleKeyDown(event) {
            if (event.key === "Escape") {
                setOpen(false);
            }
        }

        document.addEventListener("mousedown", handlePointerDown);
        document.addEventListener("keydown", handleKeyDown);

        return () => {
            document.removeEventListener("mousedown", handlePointerDown);
            document.removeEventListener("keydown", handleKeyDown);
        };
    }, [open]);

    function handleSelect(nextValue) {
        onChange(nextValue);
        setOpen(false);
    }

    return (
        <div ref={rootRef} className="relative">
            <button
                type="button"
                aria-haspopup="listbox"
                aria-expanded={open}
                onClick={() => setOpen((current) => !current)}
                className="input-field flex w-full min-w-40 cursor-pointer items-center justify-between gap-3 text-left"
            >
                <span>{selected?.label ?? ""}</span>
                <span className={`text-[10px] text-gold transition-transform duration-300 ${open ? "rotate-180" : ""}`}>
                    ▼
                </span>
            </button>

            {open && (
                <ul
                    role="listbox"
                    className="absolute z-20 mt-1 max-h-64 w-full overflow-auto border border-line bg-white py-1 dark:border-night-border dark:bg-night-card"
                >
                    {options.map((option) => {
                        const isSelected = String(option.value) === String(value);

                        return (
                            <li key={option.value} role="option" aria-selected={isSelected}>
                                <button
                                    type="button"
                                    onClick={() => handleSelect(option.value)}
                                    className={[
                                        "w-full cursor-pointer px-3 py-2 text-left text-sm transition-colors duration-200",
                                        isSelected
                                            ? "bg-accent text-white"
                                            : "text-ink hover:bg-paper-muted dark:text-paper dark:hover:bg-night",
                                    ].join(" ")}
                                >
                                    {option.label}
                                </button>
                            </li>
                        );
                    })}
                </ul>
            )}
        </div>
    );
}

export default SelectField;
