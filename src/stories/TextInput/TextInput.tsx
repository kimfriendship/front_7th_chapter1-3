import { FormControl, FormLabel, TextField, Tooltip } from '@mui/material';

export interface TextInputProps {
  id: string;
  label: string;
  value: string | number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type?: 'text' | 'date' | 'time' | 'number';
  placeholder?: string;
  error?: boolean;
  errorMessage?: string;
  fullWidth?: boolean;
  size?: 'small' | 'medium';
  disabled?: boolean;
  required?: boolean;
  onBlur?: () => void;
  inputProps?: Record<string, any>;
}

export default function TextInput({
  id,
  label,
  value,
  onChange,
  type = 'text',
  placeholder,
  error = false,
  errorMessage,
  fullWidth = true,
  size = 'small',
  disabled = false,
  required = false,
  onBlur,
  inputProps,
}: TextInputProps) {
  const textField = (
    <TextField
      id={id}
      size={size}
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      error={error}
      fullWidth={fullWidth}
      disabled={disabled}
      required={required}
      onBlur={onBlur}
      slotProps={{ htmlInput: inputProps }}
    />
  );

  return (
    <FormControl fullWidth={fullWidth}>
      <FormLabel htmlFor={id}>{label}</FormLabel>
      {error && errorMessage ? (
        <Tooltip title={errorMessage} open={!!errorMessage} placement="top">
          {textField}
        </Tooltip>
      ) : (
        textField
      )}
    </FormControl>
  );
}
