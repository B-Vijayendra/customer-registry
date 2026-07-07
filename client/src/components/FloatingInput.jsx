import React, { useState } from 'react';

/**
 * Floating-label field. Works as <input> by default; pass `as="textarea"` for
 * a multi-line field. Label starts centered as a placeholder-like prompt and
 * floats to the top-left once the field is focused or has a value.
 */
export default function FloatingInput({
  as = 'input',
  type = 'text',
  name,
  label,
  value,
  onChange,
  onBlur,
  icon,
  error,
  required = false,
  rows = 4,
  ...rest
}) {
  const [focused, setFocused] = useState(false);
  const hasValue = value !== undefined && value !== null && String(value).length > 0;
  const floated = focused || hasValue;
  const Tag = as;

  return (
    <div>
      <div className="relative">
        {icon && (
          <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
            {icon}
          </span>
        )}
        <Tag
          id={name}
          name={name}
          type={as === 'input' ? type : undefined}
          rows={as === 'textarea' ? rows : undefined}
          value={value}
          onChange={onChange}
          onFocus={() => setFocused(true)}
          onBlur={(e) => { setFocused(false); onBlur?.(e); }}
          className={`input-floating ${icon ? 'pl-10' : ''} ${as === 'textarea' ? 'resize-none' : ''} ${error ? '!border-danger/60' : ''}`}
          placeholder={label}
          {...rest}
        />
        <label
          htmlFor={name}
          className={`input-floating-label ${icon ? 'left-10' : ''} ${
            floated ? '-translate-y-2.5 scale-[0.82] text-violet-600 dark:text-violet-400' : 'translate-y-1 scale-100'
          }`}
        >
          {label}{required && <span className="text-danger"> *</span>}
        </label>
      </div>
      {error && <p className="mt-1.5 text-xs text-danger">{error}</p>}
    </div>
  );
}
