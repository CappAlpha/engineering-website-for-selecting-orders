"use client";

import { Fade, Modal } from "@mui/material";
import { signIn } from "next-auth/react";
import { useState, type FC } from "react";

import { Button } from "@/shared/ui/Button";

import { Plus } from "../../../../../public/icon";
import { LoginForm } from "../LoginForm";
import { RegisterForm } from "../RegisterForm";

import s from "./AuthModal.module.scss";

interface Props {
  open: boolean;
  onClose: VoidFunction;
}

export const AuthModal: FC<Props> = ({ open, onClose }) => {
  const [authType, setAuthType] = useState<"login" | "register">("login");

  const onSwitchAuthType = () => {
    setAuthType((prevType) => (prevType === "login" ? "register" : "login"));
  };

  const handleGoogleLogin = async () => {
    await signIn("google", { redirect: false });
  };

  const handleClose = () => {
    onClose();
  };

  return (
    <Modal open={open} onClose={handleClose} className={s.root} keepMounted>
      <Fade in={open}>
        <div className={s.content} role="dialog">
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
            {authType === "login" ? (
              <>
                <LoginForm onClose={handleClose} />

                <Button onClick={handleGoogleLogin} className={s.loginBtn}>
                  Google
                </Button>
              </>
            ) : (
              <RegisterForm />
            )}

            <Button
              onClick={onSwitchAuthType}
              className={s.switchBtn}
              color="transparent"
              noPadding
            >
              {authType === "login" ? "Регистрация" : "Вход в аккаунт"}
            </Button>
          </div>
        </div>
      </Fade>
    </Modal>
  );
};
