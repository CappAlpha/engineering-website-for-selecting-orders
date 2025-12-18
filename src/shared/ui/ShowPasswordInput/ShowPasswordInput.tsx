import { useState, type FC } from "react";
import { useFormContext, useWatch } from "react-hook-form";

import { FormInput } from "@/shared/ui/FormInput";

import { EyeClosed, EyeOpen } from "../../../../public/icon";

import s from "./ShowPasswordInput.module.scss";

export const ShowPasswordInput: FC = () => {
  const [show, setShow] = useState(false);

  const { control } = useFormContext();
  const passwordValue = useWatch({
    control,
    name: "password",
    defaultValue: "",
  }) as string;

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
