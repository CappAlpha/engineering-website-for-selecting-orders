import cn from "classnames";
import Link from "next/link";
import { FC, type MouseEvent, type ReactNode } from "react";

import s from "./Button.module.scss";

interface ButtonProps {
  color?: "grey" | "transparent" | "outline";
  size?: "m" | "s" | "l";
  noPadding?: boolean;
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
  noPadding = false,
  onClick,
  children,
  className,
  disabled,
  loading,
  href = "",
  targetBlank = false,
}) => {
  const styles = cn(
    s.root,
    color && s[`color_${color}`],
    size && s[`size_${size}`],
    noPadding && s.noPadding,
    className,
    loading && s.loading,
    disabled && s.disabled,
  );

  return href ? (
    <Link className={styles} href={href} target={targetBlank ? "_blank" : ""}>
      {children}
    </Link>
  ) : (
    <button className={styles} onClick={onClick}>
      {children}
    </button>
  );
};
