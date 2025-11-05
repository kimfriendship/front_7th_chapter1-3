import { FormControl, FormLabel, MenuItem, Select } from '@mui/material';

export interface SelectOption {
  value: string | number;
  label: string;
}

export interface SelectInputProps {
  id?: string;
  label: string;
  value: string | number;
  onChange: (value: string | number) => void;
  options: SelectOption[];
  fullWidth?: boolean;
  size?: 'small' | 'medium';
  disabled?: boolean;
  required?: boolean;
  ariaLabel?: string;
  ariaLabelledby?: string;
}

export default function SelectInput({
  id,
  label,
  value,
  onChange,
  options,
  fullWidth = true,
  size = 'small',
  disabled = false,
  required = false,
  ariaLabel,
  ariaLabelledby,
}: SelectInputProps) {
  return (
    <FormControl fullWidth={fullWidth}>
      <FormLabel id={ariaLabelledby || `${id}-label`}>{label}</FormLabel>
      <Select
        id={id}
        size={size}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        required={required}
        fullWidth={fullWidth}
        aria-label={ariaLabel}
        aria-labelledby={ariaLabelledby || `${id}-label`}
      >
        {options.map((option) => (
          <MenuItem
            key={option.value}
            value={option.value}
            aria-label={`${option.value}-option`}
          >
            {option.label}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}
