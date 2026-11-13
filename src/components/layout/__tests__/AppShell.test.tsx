// @vitest-environment jsdom
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import { describe, it, expect, vi, afterEach } from 'vitest';
import { AppShell } from '../AppShell';
import type { SessionUser } from '@/domain/types';

vi.mock('next/navigation', () => ({
  usePathname: () => '/app',
  useRouter: () => ({
    push: vi.fn(),
    refresh: vi.fn(),
  }),
}));

afterEach(() => {
  cleanup();
});

const mockUser: SessionUser = {
  id: 'usr_1',
  name: 'Maria Silva',
  email: 'maria@example.com',
};

describe('AppShell - Dedicatória e Mobile First', () => {
  it('renderiza o botão de menu mobile na topbar e a dedicatória na sidebar', () => {
    render(
      <AppShell user={mockUser}>
        <p>Conteúdo do Aluno</p>
      </AppShell>
    );

    // Botão de menu mobile na topbar
    const menuBtn = screen.getByRole('button', { name: /abrir menu de navegação/i });
    expect(menuBtn).toBeDefined();

    // Dedicatória para a namorada/futura esposa na sidebar
    expect(screen.getByText(/feito com amor/i)).toBeDefined();
    expect(
      screen.getByText(
        /criado para ajudar minha namorada e futura esposa a alcançar seus objetivos, estudando de forma fácil\./i
      )
    ).toBeDefined();
    expect(screen.getByText(/para o meu amor gabaritar aê! ❤️/i)).toBeDefined();
  });

  it('abre e fecha o menu mobile ao clicar nos controles correspondentes', () => {
    const { container } = render(
      <AppShell user={mockUser}>
        <p>Conteúdo do Aluno</p>
      </AppShell>
    );

    const shell = container.querySelector('.app-shell');
    expect(shell?.classList.contains('app-shell--drawer-open')).toBe(false);

    // Clica para abrir o menu
    const menuBtn = screen.getByRole('button', { name: /abrir menu de navegação/i });
    fireEvent.click(menuBtn);

    expect(shell?.classList.contains('app-shell--drawer-open')).toBe(true);

    // Clica no botão X para fechar
    const closeBtn = screen.getByRole('button', { name: 'Fechar menu' });
    fireEvent.click(closeBtn);

    expect(shell?.classList.contains('app-shell--drawer-open')).toBe(false);
  });

  it('permite abrir o menu a partir do botão Menu na bottom-nav', () => {
    const { container } = render(
      <AppShell user={mockUser}>
        <p>Conteúdo do Aluno</p>
      </AppShell>
    );

    const shell = container.querySelector('.app-shell');
    expect(shell?.classList.contains('app-shell--drawer-open')).toBe(false);

    // Botão na bottom-nav
    const bottomNavMenuBtn = screen.getByRole('button', { name: /abrir menu lateral/i });
    fireEvent.click(bottomNavMenuBtn);

    expect(shell?.classList.contains('app-shell--drawer-open')).toBe(true);
  });
});
