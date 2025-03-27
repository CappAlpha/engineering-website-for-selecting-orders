import cn from "classnames";
import Link from "next/link";
import { FC, MouseEvent, ReactNode } from "react";

import s from "./Button.module.scss";

export interface ButtonProps {
  color?: "grey" | "transparent";
  size?: "m" | "s";
  onClick?: (event: MouseEvent) => void;
  children?: ReactNode;
  className?: string;
  disabled?: boolean;
  loading?: boolean;
  href?: string;
  targetBlank?: boolean;
}

export const Button: FC<ButtonProps> = ({
  color,
  size = "m",
  onClick,
  children,
  className,
  disabled,
  loading,
  href = "",
  targetBlank = false,
}) => {
  return href ? (
    <Link
      className={cn(
        s.root,
        color && s[`color_${color}`],
        size && s[`size_${size}`],
        className,
        disabled && s.disabled,
      )}
      href={href}
      target={targetBlank ? "_blank" : ""}
    >
      {children}
    </Link>
  ) : (
    <button
      className={cn(
        s.root,
        color && s[`color_${color}`],
        size && s[`size_${size}`],
        className,
        disabled && s.disabled,
        loading && s.loading,
      )}
      onClick={onClick}
    >
      {children}
    </button>
  );
};
