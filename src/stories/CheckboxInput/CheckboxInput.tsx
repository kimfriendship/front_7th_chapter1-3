import { Checkbox, FormControl, FormControlLabel } from '@mui/material';

export interface CheckboxInputProps {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
  required?: boolean;
  color?: 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning' | 'default';
  size?: 'small' | 'medium';
}

export default function CheckboxInput({
  label,
  checked,
  onChange,
  disabled = false,
  required = false,
  color = 'primary',
  size = 'medium',
}: CheckboxInputProps) {
  return (
    <FormControl>
      <FormControlLabel
        control={
          <Checkbox
            checked={checked}
            onChange={(e) => onChange(e.target.checked)}
            disabled={disabled}
            required={required}
            color={color}
            size={size}
          />
        }
        label={label}
      />
    </FormControl>
  );
}
