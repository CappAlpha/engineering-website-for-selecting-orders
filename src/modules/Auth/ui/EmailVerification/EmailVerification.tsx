import { type FC } from "react";

import type { VerifyRequest } from "../../entities/verify";

import s from "./EmailVerification.module.scss";

interface Props {
  code: VerifyRequest["code"];
  ttlMinutes: number;
}

export const EmailVerification: FC<Readonly<Props>> = ({
  code,
  ttlMinutes,
}) => {
  return (
    <div className={s.root}>
      <p>
        Код подтверждения: <h2>{code}</h2>
      </p>
      <p>
        Код действует <span>{ttlMinutes}</span> минут.
      </p>
    </div>
  );
};
