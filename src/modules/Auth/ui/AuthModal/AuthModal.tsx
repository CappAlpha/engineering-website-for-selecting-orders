"use client";

import { Fade, Modal } from "@mui/material";
import { signIn } from "next-auth/react";
import { useState, type FC } from "react";

import { useCartReducers } from "@/modules/Cart/hooks/useCartReducers";
import { Button } from "@/shared/ui/Button";

import { Login, Plus, Registration } from "../../../../../public/icon";
import { AuthFormHeader } from "../AuthFormHeader";
import { LoginForm } from "../LoginForm";
import { RegisterForm } from "../RegisterForm";

import s from "./AuthModal.module.scss";

interface Props {
  open: boolean;
  onClose: VoidFunction;
}

export const AuthModal: FC<Props> = ({ open, onClose }) => {
  const [authType, setAuthType] = useState<"login" | "register">("login");
  const { fetchCart } = useCartReducers();

  const onSwitchAuthType = () => {
    setAuthType((prevType) => (prevType === "login" ? "register" : "login"));
  };

  const handleGoogleLogin = async () => {
    await signIn("google", { redirect: false });
    await fetchCart();
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
              //  Login user
              <>
                <AuthFormHeader
                  title="Вход в аккаунт"
                  description="Введите свою почту и пароль, чтобы войти в аккаунт"
                  icon={<Login />}
                />

                <LoginForm onClose={handleClose} />

                <Button onClick={handleGoogleLogin} className={s.loginBtn}>
                  Google
                </Button>
              </>
            ) : (
              // Registration user
              <>
                <AuthFormHeader title="Регистрация" icon={<Registration />} />

                <RegisterForm onClose={handleClose} />
              </>
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
