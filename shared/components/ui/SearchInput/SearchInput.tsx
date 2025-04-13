"use client"
import { useCallback, useEffect, useRef, useState, type FC } from 'react';

import s from './SearchInput.module.scss';
import { Autocomplete, darken, lighten, styled, TextField } from '@mui/material';
import { useOutsideClick } from '@/hook/useOutsideHook';
import cn from 'classnames';

export interface Props {
  //
}

const CssTextField = styled(TextField)({
  '& .MuiFormLabel-root': {
    color: '#fff',
  },
  '& .MuiInputBase-root': {
    color: '#fff',
    borderBottom: '1px solid #fff',
    paddingTop: '14px',
  },
  '& .MuiInputBase-input': {
    padding: ''
  }
});

const GroupHeader = styled('div')(({ theme }) => ({
  position: 'sticky',
  top: '-8px',
  padding: '4px 10px',
  color: theme.palette.primary.main,
  backgroundColor: lighten(theme.palette.primary.light, 0.85),
  ...theme.applyStyles('dark', {
    backgroundColor: darken(theme.palette.primary.main, 0.8),
  }),
}));

const GroupItems = styled('ul')({
  padding: 0,
});

export const SearchInput: FC<Props> = ({ }) => {
  const [focused, setFocused] = useState(false);
  const ref = useRef(null);

  useOutsideClick({
    elementRef: ref,
    handler: () => {
      setFocused(false);
    },
  });

  const closeBg = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape' && focused === true) {
      (document.activeElement as HTMLElement)?.blur();
      setFocused(false);
    }
  }, [focused]);
  
  useEffect(() => {
    document.addEventListener('keydown', closeBg);
    return () => {
      document.removeEventListener('keydown', closeBg);
    };
  }, [closeBg]);

  return (
    <>
      <div className={cn(s.bg, !focused && s.hidden)} />
      <div ref={ref} className={s.root}>
        <Autocomplete
          options={['123']}
          groupBy={(option) => '123'}
          fullWidth
          renderInput={(params) => <CssTextField {...params} variant="filled" label="Поиск" type="search" />}
          renderGroup={(params) => (
            <li key={params.key}>
              <GroupHeader>{params.group}</GroupHeader>
              <GroupItems>{params.children}</GroupItems>
            </li>
          )}
          onFocus={() => setFocused(true)}
        />
      </div>
    </>
  );
};