'use client';

import React, { useState } from 'react';
import { Heart, QrCode } from 'lucide-react';

import { PixDonationModal } from './PixDonationModal';

interface PixButtonProps {
  className?: string;
  variant?: 'primary' | 'secondary' | 'sidebar' | 'pill';
  label?: string;
}

export function PixButton({
  className = '',
  variant = 'secondary',
  label = 'Apoiar via Pix',
}: PixButtonProps) {
  const [isOpen, setIsOpen] = useState(false);

  if (variant === 'sidebar') {
    return (
      <>
        <button
          type="button"
          className={`sidebar-pix-btn ${className}`}
          onClick={() => setIsOpen(true)}
          title="Fazer uma doação instantânea via Pix para manter o projeto"
        >
          <span className="sidebar-pix-icon">
            <Heart size={16} className="text-negative fill-current" />
          </span>
          <span className="sidebar-pix-label">{label}</span>
        </button>

        <PixDonationModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
      </>
    );
  }

  if (variant === 'pill') {
    return (
      <>
        <button
          type="button"
          className={`pix-pill-btn ${className}`}
          onClick={() => setIsOpen(true)}
          title="Apoiar via Pix"
        >
          <QrCode size={14} />
          <span>{label}</span>
        </button>

        <PixDonationModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
      </>
    );
  }

  return (
    <>
      <button
        type="button"
        className={`btn btn--${variant} ${className}`}
        onClick={() => setIsOpen(true)}
      >
        <Heart size={14} className="text-negative fill-current" />
        <span>{label}</span>
      </button>

      <PixDonationModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
}
