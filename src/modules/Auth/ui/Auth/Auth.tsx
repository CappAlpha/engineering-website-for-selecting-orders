"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, type FC } from "react";
import toast from "react-hot-toast";

import { AuthModal } from "@/modules/Auth/ui/AuthModal";

import { LoginButtons } from "../LoginButtons";

export const Auth: FC = () => {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [openModal, setOpenModal] = useState(false);
  const handleOpen = () => setOpenModal(true);
  const handleClose = () => setOpenModal(false);

  useEffect(() => {
    let toastMessage = "";
    let error = false;

    if (searchParams.has("paid")) {
      toastMessage = `Заказ успешно оплачен!
        Информация отправлена на почту!`;
    }

    if (searchParams.has("verified")) {
      toastMessage = `Почта успешно подтверждена!`;
    }

    if (searchParams.has("wrongCode")) {
      toastMessage = `Недействительный код!`;
      error = true;
    }

    if (toastMessage) {
      router.replace("/");
      // TODO: improve logic?
      if (error) {
        toast.error(toastMessage);
      } else {
        toast.success(toastMessage);
      }
    }
  }, [router, searchParams]);

  return (
    <>
      <AuthModal open={openModal} onClose={handleClose} />

      <LoginButtons onClickOpen={handleOpen} />
    </>
  );
};
