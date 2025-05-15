import { type FC } from "react";

import { Button } from "@/shared/ui/Button";

import s from "./RegisterForm.module.scss";

export interface Props {
  onClose?: VoidFunction;
}

export const RegisterForm: FC<Props> = ({ onClose }) => {
  return (
    <div className={s.root}>
      <Button onClick={onClose}>test</Button>
    </div>
  );
};
