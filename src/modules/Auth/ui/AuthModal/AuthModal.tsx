"use client";

import { Fade, Modal } from "@mui/material";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, type FC } from "react";

import { useCartQueries } from "@/modules/Cart/hooks/useCartQueries";
import { Button } from "@/shared/ui/Button";

import { Login, Plus, Registration } from "../../../../../public/icon";
import { AuthFormHeader } from "../AuthFormHeader";
import { LoginForm } from "../LoginForm";
import { RegisterForm } from "../RegisterForm";
import { VerifyForm } from "../VerifyForm";

import s from "./AuthModal.module.scss";

interface Props {
  open: boolean;
  onClose: VoidFunction;
}

type BaseAuthType = "login" | "register" | "verify";

export const AuthModal: FC<Props> = ({ open, onClose }) => {
  const [baseAuthType, setBaseAuthType] = useState<BaseAuthType>("login");

  const router = useRouter();
  const searchParams = useSearchParams();
  const { refetchCart } = useCartQueries();

  const verify = searchParams.get("verify") === "1";
  const verifyUid = searchParams.get("uid");
  const isVerifyMode = open && verify && Boolean(verifyUid);

  const onSwitchAuthType = () => {
    setBaseAuthType((prevType) =>
      prevType === "login" ? "register" : "login",
    );
  };

  const handleGoogleLogin = async () => {
    await signIn("google", { redirect: false });
    await refetchCart();
  };

  const handleClickGoogle = () => void handleGoogleLogin();

  const clearVerifyFromUrl = () => {
    const sp = new URLSearchParams(searchParams.toString());
    sp.delete("verify");
    sp.delete("uid");

    const qs = sp.toString();
    router.replace(qs ? `?${qs}` : "?", { scroll: false });
  };

  const handleClose = () => {
    clearVerifyFromUrl();
    setBaseAuthType("login");
    onClose();
  };

  const openVerify = (uid: string) => {
    const sp = new URLSearchParams(searchParams.toString());
    sp.set("verify", "1");
    sp.set("uid", uid);
    router.replace(`?${sp.toString()}`, { scroll: false });
  };

  const onVerified = () => {
    void (async () => {
      await refetchCart();
      router.push("/?verified");
      handleClose();
    })();
  };

  return (
    <Modal open={open} onClose={handleClose} className={s.root} keepMounted>
      <Fade in={open}>
        <dialog className={s.content}>
          <Button
            onClick={handleClose}
            className={s.close}
            noPadding
            color="transparent"
            aria-label="Закрыть модальное окно"
          >
            <Plus className={s.closeIcon} />
          </Button>

          <div className={s.wrap}>
            {isVerifyMode ? (
              <>
                <AuthFormHeader
                  title="Подтверждение почты"
                  description="Введите код из письма"
                  icon={<Registration />}
                />

                {verifyUid && (
                  <VerifyForm uid={verifyUid} onVerified={onVerified} />
                )}
              </>
            ) : baseAuthType === "login" ? (
              <>
                <AuthFormHeader
                  title="Вход в аккаунт"
                  description="Введите свою почту и пароль, чтобы войти в аккаунт"
                  icon={<Login />}
                />

                <LoginForm onClose={handleClose} />

                <Button onClick={handleClickGoogle} className={s.loginBtn}>
                  Google
                </Button>
              </>
            ) : (
              <>
                <AuthFormHeader title="Регистрация" icon={<Registration />} />

                <RegisterForm onNeedVerify={openVerify} />
              </>
            )}

            {!isVerifyMode && (
              <Button
                onClick={onSwitchAuthType}
                className={s.switchBtn}
                color="transparent"
                noPadding
              >
                {baseAuthType === "login" ? "Регистрация" : "Вход в аккаунт"}
              </Button>
            )}
          </div>
        </dialog>
      </Fade>
    </Modal>
  );
};
