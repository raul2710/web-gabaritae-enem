import Link from 'next/link';
import { ArrowRight, Compass } from 'lucide-react';

import { PublicFooter } from '@/components/layout/PublicFooter';
import { PublicHeader } from '@/components/layout/PublicHeader';

export default function NotFound() {
  return (
    <>
      <PublicHeader />
      <main id="conteudo" className="section">
        <div className="container">
          <div className="empty-state" style={{ maxWidth: '640px', marginInline: 'auto' }}>
            <span className="empty-state__icon" aria-hidden="true">
              <Compass size={32} />
            </span>

            <p className="section-header__eyebrow">Erro 404</p>
            <h1 className="empty-state__title">Esta página não existe</h1>
            <p className="empty-state__description">
              O endereço pode ter sido digitado com erro ou o conteúdo mudou de lugar. Volte para
              o início ou escolha uma das provas oficiais do ENEM.
            </p>

            <div className="row">
              <Link href="/" className="btn btn--primary">
                Voltar ao início
                <ArrowRight size={16} aria-hidden="true" />
              </Link>
              <Link href="/provas" className="btn btn--secondary">
                Ver provas
              </Link>
            </div>
          </div>
        </div>
      </main>
      <PublicFooter />
    </>
  );
}
