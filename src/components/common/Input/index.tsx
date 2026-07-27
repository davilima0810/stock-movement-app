import { forwardRef } from 'react';
import { TextField } from '@mui/material';
import type { TextFieldProps } from '@mui/material';

export type InputProps = TextFieldProps;

export const Input = forwardRef<HTMLDivElement, InputProps>((props, ref) => {
  return <TextField inputRef={ref} fullWidth variant="outlined" margin="normal" {...props} />;
});
Input.displayName = 'Input';
