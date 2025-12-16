import { type FC } from "react";

import s from "./EmailVerification.module.scss";

interface Props {
  code: string;
}

export const EmailVerification: FC<Readonly<Props>> = ({ code }) => {
  return (
    <div className={s.root}>
      <p>
        Код подтверждения: <h2>{code}</h2>
      </p>
      <p>
        <a href={`${process.env.NEXT_PUBLIC_API_URL}/auth/verify?code=${code}`}>
          Подтвердить регистрацию
        </a>
      </p>
    </div>
  );
};
