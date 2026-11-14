'use client';

import { Check, ChevronDown } from 'lucide-react';
import { useEffect, useId, useRef, useState } from 'react';

export interface CustomSelectOption<T extends string = string> {
  value: T;
  label: string;
  description?: string;
  accentColor?: string;
  badge?: string;
}

interface CustomSelectProps<T extends string = string> {
  id?: string;
  value: T;
  options: CustomSelectOption<T>[];
  onChange: (value: T) => void;
  placeholder?: string;
  ariaLabel?: string;
}

export function CustomSelect<T extends string = string>({
  id,
  value,
  options,
  onChange,
  placeholder = 'Selecione...',
  ariaLabel,
}: CustomSelectProps<T>) {
  const generatedId = useId();
  const selectId = id ?? generatedId;
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find((opt) => opt.value === value);

  useEffect(() => {
    if (!open) return;

    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [open]);

  return (
    <div className="custom-select" ref={containerRef}>
      <button
        id={selectId}
        type="button"
        className={open ? 'custom-select__trigger custom-select__trigger--open' : 'custom-select__trigger'}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={ariaLabel}
        onClick={() => setOpen((prev) => !prev)}
      >
        <span className="custom-select__value">
          {selectedOption?.accentColor ? (
            <span
              className="custom-select__dot"
              style={{ backgroundColor: selectedOption.accentColor }}
              aria-hidden="true"
            />
          ) : null}
          <span className="custom-select__label">
            {selectedOption ? selectedOption.label : placeholder}
          </span>
          {selectedOption?.badge ? (
            <span className="custom-select__badge">{selectedOption.badge}</span>
          ) : null}
        </span>

        <ChevronDown
          size={16}
          className={
            open
              ? 'custom-select__chevron custom-select__chevron--open'
              : 'custom-select__chevron'
          }
          aria-hidden="true"
        />
      </button>

      {open ? (
        <ul className="custom-select__popover" role="listbox" aria-labelledby={selectId}>
          {options.map((opt) => {
            const isSelected = opt.value === value;
            return (
              <li key={opt.value} role="option" aria-selected={isSelected}>
                <button
                  type="button"
                  className={
                    isSelected
                      ? 'custom-select__option custom-select__option--selected'
                      : 'custom-select__option'
                  }
                  onClick={() => {
                    onChange(opt.value);
                    setOpen(false);
                  }}
                >
                  <span className="custom-select__option-main">
                    {opt.accentColor ? (
                      <span
                        className="custom-select__dot"
                        style={{ backgroundColor: opt.accentColor }}
                        aria-hidden="true"
                      />
                    ) : null}
                    <span className="custom-select__option-text">
                      <span className="custom-select__option-title">{opt.label}</span>
                      {opt.description ? (
                        <span className="custom-select__option-desc">{opt.description}</span>
                      ) : null}
                    </span>
                  </span>

                  <span className="custom-select__option-right">
                    {opt.badge ? (
                      <span className="custom-select__badge">{opt.badge}</span>
                    ) : null}
                    {isSelected ? (
                      <Check size={15} className="custom-select__check" aria-hidden="true" />
                    ) : null}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      ) : null}
    </div>
  );
}
