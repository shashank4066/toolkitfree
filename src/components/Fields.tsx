import { cloneElement, useId, type ReactElement, type InputHTMLAttributes, type SelectHTMLAttributes } from 'react';

type FieldControl = ReactElement<{ id?: string; 'aria-describedby'?: string }>;

export function Field({ label, help, children }: { label: string; help?: string; children: FieldControl }) {
  const generatedId = useId();
  const id = children.props.id || generatedId;
  const helpId = id + '-help';
  const description = [children.props['aria-describedby'], help ? helpId : undefined].filter(Boolean).join(' ');

  return (
    <div className="field">
      <label className="field-label" htmlFor={id}>{label}</label>
      {cloneElement(children, { id, 'aria-describedby': description || undefined })}
      {help && <small id={helpId}>{help}</small>}
    </div>
  );
}

export function NumberField({ label, help, ...props }: InputHTMLAttributes<HTMLInputElement> & { label: string; help?: string }) {
  return <Field label={label} help={help}><input type="number" {...props} /></Field>;
}

export function SelectField({ label, options, ...props }: SelectHTMLAttributes<HTMLSelectElement> & { label: string; options: (string | [string, string])[] }) {
  return (
    <Field label={label}>
      <select {...props}>
        {options.map(option => {
          const [value, text] = Array.isArray(option) ? option : [option, option];
          return <option key={value} value={value}>{text}</option>;
        })}
      </select>
    </Field>
  );
}

export function RangeField({ label, value, ...props }: InputHTMLAttributes<HTMLInputElement> & { label: string }) {
  const id = useId();
  return (
    <label className="field" htmlFor={id}>
      <span className="field-label">{label}<span aria-hidden="true">{value}</span></span>
      <input id={id} type="range" value={value} {...props} />
    </label>
  );
}

export function Checkbox({ label, ...props }: InputHTMLAttributes<HTMLInputElement> & { label: string }) {
  return <label className="checkbox-label"><input type="checkbox" {...props} />{label}</label>;
}
