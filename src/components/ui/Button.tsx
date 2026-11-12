import Link from 'next/link';
import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from 'react';

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger';

interface CommonProps {
  variant?: Variant;
  size?: 'sm' | 'md';
  block?: boolean;
  children: ReactNode;
  className?: string;
}

export type ButtonLinkProps = CommonProps &
  { href: string } & Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'className' | 'children'>;

export type ButtonNativeProps = CommonProps &
  Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'className' | 'children'>;

export type ButtonProps = ButtonLinkProps | ButtonNativeProps;

function classes(
  variant: Variant = 'primary',
  size: 'sm' | 'md' = 'md',
  block = false,
  className = '',
): string {
  return [
    'btn',
    `btn--${variant}`,
    size === 'sm' ? 'btn--sm' : '',
    block ? 'btn--block' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');
}

export function Button(props: ButtonProps) {
  if ('href' in props) {
    const {
      variant,
      size,
      block,
      children,
      className,
      href,
      ...anchorProps
    } = props;

    return (
      <Link {...anchorProps} href={href} className={classes(variant, size, block, className)}>
        {children}
      </Link>
    );
  }

  const { variant, size, block, children, className, ...buttonProps } = props;

  return (
    <button {...buttonProps} className={classes(variant, size, block, className)}>
      {children}
    </button>
  );
}
