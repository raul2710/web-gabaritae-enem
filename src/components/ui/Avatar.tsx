interface AvatarProps {
  name: string;
  size?: 'md' | 'lg';
  className?: string;
}

/** Iniciais derivadas do nome (`Marina Vasconcelos` → `MV`). */
export function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return '?';

  const first = parts[0].charAt(0);
  const last = parts.length > 1 ? parts[parts.length - 1].charAt(0) : '';

  return `${first}${last}`.toUpperCase();
}

export function Avatar({ name, size = 'md', className = '' }: AvatarProps) {
  const sizeClass = size === 'lg' ? 'avatar--lg' : '';

  return (
    <span
      className={['avatar', sizeClass, className].filter(Boolean).join(' ')}
      role="img"
      aria-label={name}
      title={name}
    >
      {getInitials(name)}
    </span>
  );
}
