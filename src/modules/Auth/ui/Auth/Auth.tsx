"use client";

import { useState, type FC } from "react";

import { AuthModal } from "@/modules/Auth/ui/AuthModal";

import { useAuthParams } from "../../hooks/useAuthParams";
import { LoginButtons } from "../LoginButtons";

export const Auth: FC = () => {
  const [openModal, setOpenModal] = useState(false);

  useAuthParams();
  return (
    <>
      <AuthModal open={openModal} onClose={() => setOpenModal(false)} />

      <LoginButtons onClickOpen={() => setOpenModal(true)} />
    </>
  );
};
