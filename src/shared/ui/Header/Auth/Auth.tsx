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
    if (searchParams.has("paid")) {
      toast.success(`Заказ успешно оплачен!
        Информация отправлена на почту!`);

      // TODO: вести на страницу заказов?
      router.push("/", { scroll: false });
    }
  }, [router, searchParams]);

  return (
    <>
      <AuthModal open={openModal} onClose={handleClose} />

      <LoginButtons onClickOpen={handleOpen} />
    </>
  );
};
