import React from 'react';
import {
  TextField,
  TextFieldProps,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  SelectProps,
  SelectChangeEvent,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

interface BaseFieldProps {
  name: string;
  label: string;
  error?: string;
  touched?: boolean;
  helperText?: string;
}

interface TextFieldCompProps extends BaseFieldProps {
  type: 'text' | 'email' | 'password' | 'number' | 'textarea';
  value: string | number;
  onChange: (e: React.ChangeEvent<any>) => void;
  onBlur: (e: React.FocusEvent<any>) => void;
  textFieldProps?: Omit<TextFieldProps, 'name' | 'label' | 'value' | 'onChange' | 'onBlur' | 'error' | 'helperText' | 'type' | 'multiline' | 'rows'>;
}

interface SelectFieldProps extends BaseFieldProps {
  type: 'select';
  value: string | number;
  onChange: (e: SelectChangeEvent<any>) => void;
  onBlur: (e: React.FocusEvent<any>) => void;
  options: { value: string | number; label: string }[];
  selectProps?: Omit<SelectProps, 'name' | 'value' | 'onChange' | 'onBlur' | 'error' | 'label'>;
}

interface DateFieldProps extends BaseFieldProps {
  type: 'date';
  value: Date | null;
  onChange: (date: Date | null) => void;
  onBlur?: (e: React.FocusEvent<any>) => void;
}

type FormFieldProps = TextFieldCompProps | SelectFieldProps | DateFieldProps;

const FormField: React.FC<FormFieldProps> = (props) => {
  const { name, label, error, touched, helperText } = props;
  const showError = !!error && !!touched;
  const helpText = showError ? error : helperText;

  // Text, email, password, number, textarea field
  if (props.type === 'text' || props.type === 'email' || props.type === 'password' || props.type === 'number' || props.type === 'textarea') {
    const { value, onChange, onBlur, textFieldProps } = props;
    return (
      <TextField
        id={`field-${name}`}
        name={name}
        label={label}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        error={showError}
        helperText={helpText}
        type={props.type === 'textarea' ? 'text' : props.type}
        multiline={props.type === 'textarea'}
        rows={props.type === 'textarea' ? 4 : undefined}
        fullWidth
        variant="outlined"
        margin="normal"
        {...textFieldProps}
      />
    );
  }

  // Select field
  if (props.type === 'select') {
    const { value, onChange, onBlur, options, selectProps } = props;
    return (
      <FormControl
        fullWidth
        variant="outlined"
        margin="normal"
        error={showError}
      >
        <InputLabel id={`label-${name}`}>{label}</InputLabel>
        <Select
          labelId={`label-${name}`}
          id={`field-${name}`}
          name={name}
          value={value}
          onChange={onChange as (event: SelectChangeEvent<unknown>) => void}
          onBlur={onBlur}
          label={label}
          {...selectProps}
        >
          {options.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </Select>
        {helpText && <FormHelperText>{helpText}</FormHelperText>}
      </FormControl>
    );
  }

  // Date field
  if (props.type === 'date') {
    const { value, onChange } = props;
    return (
      <DatePicker
        label={label}
        value={value}
        onChange={onChange}
        slotProps={{
          textField: {
            id: `field-${name}`,
            name,
            fullWidth: true,
            variant: 'outlined',
            margin: 'normal',
            error: showError,
            helperText: helpText,
          },
        }}
      />
    );
  }

  return null;
};

export default FormField;
