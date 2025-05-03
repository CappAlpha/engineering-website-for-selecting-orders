import { type FC } from "react";

import { Input } from "@/shared/ui/Input";

import s from "./PersonalInformation.module.scss";

export const PersonalInformation: FC = () => {
  return (
    <div className={s.root}>
      <Input label="Имя" placeholder="Александр" type="text" />
      <Input label="Фамилия" placeholder="Иванов" type="text" />
      <Input label="E-Mail" placeholder="user@mail.ru" type="email" />
      <Input label="Телефон" placeholder="+7(999)999-99-99" type="tel" />
    </div>
  );
};
