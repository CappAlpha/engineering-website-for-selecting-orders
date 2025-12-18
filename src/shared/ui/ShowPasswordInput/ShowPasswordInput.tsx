import { useState, type FC } from "react";
import { useFormContext } from "react-hook-form";

import { FormInput } from "@/shared/ui/FormInput";

import { EyeClosed, EyeOpen } from "../../../../public/icon";

import s from "./ShowPasswordInput.module.scss";

export const ShowPasswordInput: FC = () => {
  const [show, setShow] = useState(false);

  const { watch } = useFormContext();
  const passwordValue = watch("password") as string;

  return (
    <div className={s.root}>
      <FormInput
        name="password"
        label="Пароль"
        type={show ? "text" : "password"}
        required
        autoComplete="current-password"
        inputMode="text"
        className={s.input}
      />
      {passwordValue && (
        <button
          type="button"
          className={s.togglePassword}
          onClick={() => setShow((v) => !v)}
        >
          {show ? <EyeClosed /> : <EyeOpen />}
        </button>
      )}
    </div>
  );
};
