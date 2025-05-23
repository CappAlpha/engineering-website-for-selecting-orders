import { ReactNode, type FC } from "react";

import s from "./AuthFormHeader.module.scss";

interface Props {
  title: string;
  description?: string;
  icon: ReactNode;
}

export const AuthFormHeader: FC<Props> = ({ title, description, icon }) => {
  return (
    <div className={s.root}>
      <div>
        <h6 className={s.title}>{title}</h6>
        {description && <p className={s.description}>{description}</p>}
      </div>
      {icon}
    </div>
  );
};
