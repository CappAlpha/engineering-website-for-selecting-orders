import { AutocompleteRenderGroupParams } from "@mui/material";

import s from "./SearchGroup.module.scss";

export const SearchGroup = (params: AutocompleteRenderGroupParams) => {
  return (
    <li key={params.key}>
      <div className={s.groupHeader}>{params.group}</div>
      <ul className={s.groupItems}>{params.children}</ul>
    </li>
  );
};
