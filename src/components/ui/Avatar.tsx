'use client';

interface AvatarProps {
  name: string;
  image?: string | null;
  size?: 'sm' | 'md' | 'lg';
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

export function Avatar({ name, image, size = 'md', className = '' }: AvatarProps) {
  const sizeClass = size === 'lg' ? 'avatar--lg' : size === 'sm' ? 'avatar--sm' : '';

  return (
    <span
      className={['avatar', sizeClass, className].filter(Boolean).join(' ')}
      role="img"
      aria-label={name}
      title={name}
    >
      {image ? (
        <img
          src={image}
          alt={name}
          className="avatar__img"
          loading="lazy"
          onError={(event) => {
            // Em caso de falha de rede/carregamento, esconde a imagem e revela as iniciais
            event.currentTarget.style.display = 'none';
          }}
        />
      ) : null}
      <span className="avatar__fallback">{getInitials(name)}</span>
    </span>
  );
}
