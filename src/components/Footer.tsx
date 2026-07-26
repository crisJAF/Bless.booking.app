import { CalendarCheck, Mail, MapPin, Phone } from "lucide-react";

type FooterProps = {
  onBook: () => void;
};

export function Footer({ onBook }: FooterProps) {
  return (
    <footer className="footer bg-black text-white pt-5 pb-4 px-4">
      <div className="container">
        <div className="row gy-4">
          <div className="col-md-4">
            <img src="/img/bless-logo.png" alt="Bless Barber Shop" className="footer-logo mb-3" />
            <p className="text-white-50">
              Bless Barber Shop ofrece servicios profesionales de barbería, cuidado personal y
              atención al cliente con excelencia. Reserva tu cita hoy mismo.
            </p>
          </div>

          <div className="col-md-2">
            <h5 className="fw-bold mb-3">Enlaces</h5>
            <ul className="list-unstyled text-white-50 footer-links">
              <li>
                <a href="#inicio">Inicio</a>
              </li>
              <li>
                <a href="#servicios">Servicios</a>
              </li>
              <li>
                <a href="#nosotros">Nosotros</a>
              </li>
              <li>
                <a href="#contacto">Contacto</a>
              </li>
            </ul>
          </div>

          <div className="col-md-3">
            <h5 className="fw-bold mb-3">Horario</h5>
            <ul className="list-unstyled text-white-50">
              <li>Lunes a sábado: 9:00 AM - 1:00 PM y 2:00 PM - 7:00 PM</li>
              <li>Domingo: 9:30 AM - 3:00 PM</li>
            </ul>
          </div>

          <div className="col-md-3">
            <h5 className="fw-bold mb-3">Contáctanos</h5>
            <ul className="list-unstyled text-white-50 footer-contact">
              <li>
                <Phone aria-hidden="true" size={17} />
                <span>+505 7746 7334</span>
              </li>
              <li>
                <Mail aria-hidden="true" size={17} />
                <span>info@blessbarber.com</span>
              </li>
              <li>
                <MapPin aria-hidden="true" size={17} />
                <span>
                  Barrio La Fuente, mini agencia Halcón Negro 1/2 cuadra abajo, Managua,
                  Nicaragua
                </span>
              </li>
            </ul>
            <button className="btn btn-outline-light btn-sm mt-3 footer-button" type="button" onClick={onBook}>
              <CalendarCheck aria-hidden="true" size={16} />
              <span>Reservar cita</span>
            </button>
          </div>
        </div>

        <hr className="border-top border-secondary mt-5" />
        <div className="d-flex justify-content-between flex-column flex-md-row text-white-50">
          <p className="mb-0">&copy; 2026 Bless Barber Shop. Todos los derechos reservados.</p>
          <p className="mb-0">Desarrollado por DevAnts</p>
        </div>
      </div>
    </footer>
  );
}
