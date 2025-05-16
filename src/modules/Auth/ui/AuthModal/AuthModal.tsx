"use client";

import { Fade, Modal } from "@mui/material";
import { signIn } from "next-auth/react";
import { useState, type FC } from "react";

import { Button } from "@/shared/ui/Button";

import { Plus } from "../../../../../public/icon";
import { LoginForm } from "../LoginForm";

import s from "./AuthModal.module.scss";

interface Props {
  open: boolean;
  onClose: VoidFunction;
}

export const AuthModal: FC<Props> = ({ open, onClose }) => {
  const [type, setType] = useState<"login" | "register">("login");

  const onSwitchType = () => {
    setType(type === "login" ? "register" : "login");
  };

  const handleClose = () => {
    onClose();
  };

  return (
    <Modal open={open} onClose={handleClose} className={s.root} keepMounted>
      <Fade in={open} exit>
        <div className={s.content}>
          <Button
            onClick={handleClose}
            className={s.close}
            noPadding
            color="transparent"
          >
            <Plus className={s.closeIcon} />
          </Button>
          <div className={s.wrap}>
            {type === "login" ? (
              <>
                <LoginForm onClose={handleClose} />

                <Button onClick={() => signIn("google")} className={s.loginBtn}>
                  Google
                </Button>
              </>
            ) : (
              <div>Регистрация</div>
            )}

            <Button
              onClick={onSwitchType}
              className={s.switchBtn}
              color="transparent"
              noPadding
            >
              {type === "login" ? "Регистрация" : "Вход"}
            </Button>
          </div>
        </div>
      </Fade>
    </Modal>
  );
};
