import Link from "next/link";
import type { ComponentProps } from "react";
import {
  buttonStyles,
  type ButtonSize,
  type ButtonVariant,
} from "./button-styles";

type ButtonLinkProps = ComponentProps<typeof Link> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
};

// A link that looks like a button — use for navigation ("Browse classes"), not for actions.
export function ButtonLink({
  variant,
  size,
  className,
  ...props
}: ButtonLinkProps) {
  return <Link className={buttonStyles(variant, size, className)} {...props} />;
}
