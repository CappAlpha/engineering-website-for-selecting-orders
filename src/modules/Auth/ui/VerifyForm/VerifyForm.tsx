"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";

import {
  resendVerificationCode,
  verifyEmail,
} from "@/shared/api/server/verify";
import { Button } from "@/shared/ui/Button";

interface Props {
  uid: string;
  onVerified: VoidFunction;
}

export const VerifyForm = ({ uid, onVerified }: Props) => {
  const router = useRouter();
  const controller = useMemo(() => new AbortController(), []);

  const [code, setCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);

  const handleVerify = () => {
    void (async () => {
      if (code.length !== 6) return;

      setLoading(true);
      setError(null);
      setInfo(null);

      try {
        const res = await verifyEmail({ uid, code }, controller.signal);

        if ("error" in res) {
          setError(res.error);
          return;
        }

        router.replace("/", { scroll: false });
        onVerified();
      } catch {
        setError("Network error");
      } finally {
        setLoading(false);
      }
    })();
  };

  const handleResend = () => {
    void (async () => {
      setResending(true);
      setError(null);
      setInfo(null);

      try {
        const res = await resendVerificationCode({ uid }, controller.signal);

        if ("error" in res) {
          setError(res.error);
          return;
        }

        setInfo("Код отправлен повторно");
      } catch {
        setError("Network error");
      } finally {
        setResending(false);
      }
    })();
  };

  return (
    <div>
      <p>Мы отправили код на вашу почту. Введите 6-значный код:</p>

      <input
        inputMode="numeric"
        value={code}
        onChange={(e) =>
          setCode(e.target.value.replaceAll(/\D/g, "").slice(0, 6))
        }
        placeholder="123456"
      />

      <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
        <Button onClick={handleVerify} disabled={loading || code.length !== 6}>
          {loading ? "Проверяем..." : "Подтвердить"}
        </Button>

        <Button onClick={handleResend} disabled={resending}>
          {resending ? "Отправляем..." : "Отправить ещё раз"}
        </Button>
      </div>

      {info && <p>{info}</p>}
      {error && <p style={{ color: "crimson" }}>{error}</p>}
    </div>
  );
};
