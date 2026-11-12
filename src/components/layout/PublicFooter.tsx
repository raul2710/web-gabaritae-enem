import Link from 'next/link';

import { PIX_KEY_COPIA_E_COLA } from '@/domain/constants';
import { Logo } from '@/components/ui/Logo';

const COLUMNS = [
  {
    title: 'Estudar',
    links: [
      { href: '/provas', label: 'Provas oficiais' },
      { href: '/entrar?next=/app/estudar', label: 'Teoria comentada' },
      { href: '/entrar?next=/app/simulados', label: 'Simulado personalizado' },
    ],
  },
  {
    title: 'Conta',
    links: [
      { href: '/entrar', label: 'Entrar' },
      { href: '/criar-conta', label: 'Criar conta' },
      { href: '/app', label: 'Área do aluno' },
    ],
  },
];

export function PublicFooter() {
  return (
    <footer className="public-footer">
      <div className="container">
        <div className="public-footer__inner">
          <div className="public-footer__col">
            <Logo href="/" />
            <p className="meta" style={{ maxWidth: '32ch' }}>
              Provas oficiais do ENEM com resolução comentada, teoria por área e simulados
              personalizados.
            </p>
          </div>

          {COLUMNS.map((column) => (
            <nav key={column.title} className="public-footer__col" aria-label={column.title}>
              <span className="public-footer__title">{column.title}</span>
              {column.links.map((link) => (
                <Link key={link.href} href={link.href} className="public-footer__link">
                  {link.label}
                </Link>
              ))}
            </nav>
          ))}

          <div className="public-footer__col">
            <span className="public-footer__title">Apoie o projeto</span>
            <span className="meta">Chave Pix (copia e cola):</span>
            <code className="meta" style={{ wordBreak: 'break-all' }}>
              {PIX_KEY_COPIA_E_COLA}
            </code>
          </div>
        </div>

        <div className="public-footer__bottom">
          <span>© {new Date().getFullYear()} Gabaritaê. Conteúdo de estudo não oficial.</span>
          <span>Feito para quem estuda para o ENEM.</span>
        </div>
      </div>
    </footer>
  );
}
