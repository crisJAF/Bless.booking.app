import { CalendarCheck, Menu, X } from "lucide-react";
import { useEffect, useState } from "react";

type HeaderProps = {
  onBook: () => void;
};

export function Header({ onBook }: HeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const closeMenu = () => setMenuOpen(false);
  const solidHeader = scrolled || menuOpen;

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 24);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <nav className={`navbar-app ${solidHeader ? "is-scrolled" : ""}`} aria-label="Navegacion principal">
      <a className="navbar-brand-app" href="#inicio" onClick={closeMenu}>
        <img src="/img/bless-logo.png" alt="" className="navbar-brand-logo" />
        <span>Bless Barber Shop</span>
      </a>

      <button
        className="icon-button d-md-none"
        type="button"
        aria-label={menuOpen ? "Cerrar menu" : "Abrir menu"}
        aria-expanded={menuOpen}
        onClick={() => setMenuOpen((current) => !current)}
      >
        {menuOpen ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
      </button>

      <div className={`navbar-links ${menuOpen ? "is-open" : ""}`}>
        <a href="#inicio" onClick={closeMenu}>
          Inicio
        </a>
        <a href="#nosotros" onClick={closeMenu}>
          Nosotros
        </a>
        <a href="#servicios" onClick={closeMenu}>
          Servicios
        </a>
        <a href="#contacto" onClick={closeMenu}>
          Contacto
        </a>
        <button
          className="btn btn-outline-light navbar-booking"
          type="button"
          onClick={() => {
            closeMenu();
            onBook();
          }}
        >
          <CalendarCheck aria-hidden="true" size={18} />
          <span>Reservar</span>
        </button>
      </div>
    </nav>
  );
}
