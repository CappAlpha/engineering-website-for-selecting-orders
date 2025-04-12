import { FC, MouseEvent, ReactNode } from "react";
import s from "./Button.module.scss";
import Link from "next/link";
import cn from "classnames";

export interface ButtonProps {
  color?: "grey" | "transparent";
  size?: "m" | "s";
  noPadding?: boolean;
  onClick?: (event: MouseEvent) => void;
  children?: ReactNode;
  className?: string;
  disabled?: boolean;
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
  href = "",
  targetBlank = false,
}) => {
  const styles = cn(
    s.root,
    color && s[`color_${color}`],
    size && s[`size_${size}`],
    noPadding && s.noPadding,
    className,
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
