import { InputHTMLAttributes, type FC } from 'react';
import cn from 'classnames';

import { Input as InputMui } from '@mui/material';

import s from './Input.module.scss';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> { };

export const Input: FC<InputProps> = ({ className, ...props }) => {
  return (
    <InputMui
      className={cn(s.root, className)}
      inputProps={props}
    />
  );
};