"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

const PHONE_DISPLAY = "06 46 21 24 57";
const PHONE_LINK = "+33646212457";

function PhoneIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M7.7 3.5 10.4 8 8.2 9.8a14.9 14.9 0 0 0 6 6l1.8-2.2 4.5 2.7c.5.3.7.9.5 1.5l-.9 2.5c-.2.7-.9 1.1-1.6 1C10.1 20.5 3.5 13.9 2.7 5.5c-.1-.7.3-1.4 1-1.6l2.5-.9c.6-.2 1.2 0 1.5.5Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function SiteHeader() {
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    document.body.classList.toggle("menu-is-open", menuOpen);
    return () => document.body.classList.remove("menu-is-open");
  }, [menuOpen]);

  function closeMenu() {
    setMenuOpen(false);
  }

  return (
    <header className="site-header">
      <div className="page-shell header-inner">
        <a
          className="brand"
          href="#accueil"
          aria-label="Plomberie Matinier, accueil"
          onClick={closeMenu}
        >
          <span className="brand-logo-wrap">
            <Image
              src="/plomberie-matinier/icon.png"
              alt="Logo Plomberie Matinier"
              width={1200}
              height={1200}
              priority
              className="brand-logo"
            />
          </span>
          <span className="brand-copy">
            <strong>Plomberie Matinier</strong>
            <small>Saint-Étienne-de-Chigny</small>
          </span>
        </a>

        <nav
          className={`site-navigation ${menuOpen ? "site-navigation-open" : ""}`}
          aria-label="Navigation principale"
        >
          <a href="#services" onClick={closeMenu}>Services</a>
          <a href="#realisations" onClick={closeMenu}>Réalisations</a>
          <a href="#avis" onClick={closeMenu}>Avis</a>
          <a href="#contact" onClick={closeMenu}>Contact</a>

          <a className="mobile-nav-call" href={`tel:${PHONE_LINK}`}>
            <PhoneIcon />
            {PHONE_DISPLAY}
          </a>
          <a className="mobile-nav-quote" href="#devis" onClick={closeMenu}>
            Demander un devis
          </a>
        </nav>

        <div className="header-actions">
          <a className="header-phone" href={`tel:${PHONE_LINK}`}>
            <PhoneIcon />
            <span>{PHONE_DISPLAY}</span>
          </a>
          <a className="header-quote" href="#devis">Devis</a>
          <button
            type="button"
            className={`menu-toggle ${menuOpen ? "menu-toggle-open" : ""}`}
            aria-label={menuOpen ? "Fermer le menu" : "Ouvrir le menu"}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((current) => !current)}
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </div>
    </header>
  );
}
