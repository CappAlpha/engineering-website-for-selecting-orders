import { useState, type FC } from "react";

import { FormInput } from "@/shared/ui/FormInput";

import { EyeClose, EyeOpen } from "../../../../../public/icon";

import s from "./ShowPasswordInput.module.scss";

export const ShowPasswordInput: FC = () => {
  const [show, setShow] = useState(false);

  return (
    <div className={s.root}>
      <FormInput
        name="password"
        label="Пароль"
        type={show ? "text" : "password"}
        required
        autoComplete="current-password"
        inputMode="text"
      />
      <button
        type="button"
        className={s.togglePassword}
        onClick={() => setShow((v) => !v)}
      >
        {show ? <EyeClose /> : <EyeOpen />}
      </button>
    </div>
  );
};
