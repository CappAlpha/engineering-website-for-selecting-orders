import { AutocompleteRenderInputParams, TextField } from "@mui/material";

import s from "./SearchInput.module.scss";

export const SearchInput = (params: AutocompleteRenderInputParams) => {
  return (
    <TextField
      {...params}
      variant="filled"
      label="Поиск"
      className={s.root}
      slotProps={{
        input: {
          ...params.InputProps,
          endAdornment: params.InputProps?.endAdornment,
        },
      }}
    />
  );
};
