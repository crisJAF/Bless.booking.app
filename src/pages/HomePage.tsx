import { CalendarCheck, CheckCircle2, Phone, Scissors } from "lucide-react";
import { useMemo, useState } from "react";
import { ReviewsSection } from "../features/reviews/ReviewsSection";
import { usePublicLayout } from "../components/PublicLayout";

type VisualService = {
  name: string;
  icon: string;
  title: string;
  image: string;
  description: string;
};

const visualServices: VisualService[] = [
  {
    name: "Corte Basico",
    icon: "/img/corte-basico.png",
    title: "Corte Básico",
    image: "/img/detalle-corte-basico.jpg",
    description: "Corte rápido, limpio y clásico para mantener tu estilo."
  },
  {
    name: "Corte Moderno",
    icon: "/img/corte-moderno.png",
    title: "Corte Moderno",
    image: "/img/detalle-corte-moderno.jpg",
    description: "Corte actualizado con líneas modernas y estilo urbano."
  },
  {
    name: "Barba",
    icon: "/img/corte-barba.png",
    title: "Corte de Barba",
    image: "/img/detalle-barba.jpg",
    description: "Perfecciona tu barba con un acabado prolijo y elegante."
  },
  {
    name: "Perfilacion de cejas",
    icon: "/img/perfilacion-cejas.png",
    title: "Perfilación de Cejas",
    image: "/img/detalle-ceja.jpg",
    description: "Resalta tu mirada con una forma precisa y armoniosa."
  },
  {
    name: "Skin Care",
    icon: "/img/skin-care.png",
    title: "Tratamiento Facial",
    image: "/img/detalle-skin-care.jpg",
    description: "Revitaliza tu piel con productos especializados y técnicas modernas."
  }
];

export function HomePage() {
  const { openBooking } = usePublicLayout();
  const [selectedService, setSelectedService] = useState(visualServices[0].name);

  const currentService = useMemo(
    () => visualServices.find((service) => service.name === selectedService) ?? visualServices[0],
    [selectedService]
  );

  return (
    <main>
      <section id="inicio" className="home-hero">
        <div className="hero-text animate-fadein-left">
          <img src="/img/bless-logo.png" alt="Logo Bless Barber Shop" className="logo-bless" />
          <p className="text-white mb-2">Bienvenido a Bless Barber Shop</p>
          <h1>La mejor barbería para un look profesional</h1>
          <p className="hero-copy">
            Bless ofrece tratamientos personalizados de alto rendimiento para brindarte resultados
            visibles.
          </p>
          <div className="hero-actions">
            <button className="btn btn-outline-light" type="button" onClick={openBooking}>
              <CalendarCheck aria-hidden="true" size={20} />
              <span>Reservar ahora</span>
            </button>
            <a href="#servicios" className="btn btn-outline-secondary">
              Todos los servicios
            </a>
          </div>
        </div>

        <div className="hero-image">
          <img src="/img/fondo-barbero.png" alt="Cliente recibiendo corte" className="barber-img" />
        </div>
      </section>

      <section id="nosotros" className="about-section bg-white px-4">
        <div className="container section-two-column">
          <div className="image-collage">
            <div className="collage-row">
              <img src="/img/barba-barbero.jpg" className="collage-img-small" alt="Detalle de barba" />
              <img src="/img/raya-barbero.jpg" className="collage-img-small" alt="Detalle de corte" />
            </div>
            <img src="/img/cara-barbero.jpg" className="collage-img-large" alt="Corte profesional" />
          </div>

          <div className="text-content">
            <p className="section-kicker">
              <Scissors aria-hidden="true" size={26} />
              Sobre nosotros
            </p>
            <h2>La mejor barbería para hombres</h2>
            <p>
              Nuestros barberos hacen un trabajo increíble. Recorta tu cabello al estilo que deseas.
              Reserva una cita con nosotros y luce como nunca antes.
            </p>
            <button className="btn btn-dark" type="button" onClick={openBooking}>
              Reservar cita
            </button>
          </div>
        </div>
      </section>

      <section id="contacto" className="booking-section text-white">
        <div className="container booking-content">
          <div className="booking-text">
            <p className="section-kicker text-secondary">
              <Scissors aria-hidden="true" size={26} />
              Reservar ahora
            </p>
            <h2>Reserva tu cita en línea</h2>
            <p>Obtén un 10% de descuento en tu primer corte reservando a través de nuestro sitio web.</p>
            <button className="btn btn-outline-light" type="button" onClick={openBooking}>
              <CalendarCheck aria-hidden="true" size={18} />
              <span>Reservar ahora</span>
            </button>
          </div>

          <div className="call-box">
            <Phone aria-hidden="true" size={36} />
            <p>Llámanos ahora</p>
            <strong>+505 7746 7334</strong>
          </div>
        </div>
      </section>

      <section className="working-review-section py-5 bg-light text-dark px-4">
        <div className="container">
          <div className="row align-items-center mb-5">
            <div className="col-md-6 mb-3 mb-md-0 d-flex justify-content-center">
              <img src="/img/barberoTrabajando.jpg" alt="Barbero trabajando" className="working-image" />
            </div>

            <div className="col-md-6">
              <div className="schedule-card bg-dark text-white">
                <h3>Días de atención</h3>
                <p>Abrimos siete días a la semana para brindarte el mejor servicio.</p>
                <div className="schedule-row">
                  <span>Lunes a sábados</span>
                  <strong>9:00 AM - 1:00 PM / 2:00 PM - 7:00 PM</strong>
                </div>
                <div className="schedule-row">
                  <span>Domingo</span>
                  <strong>9:30 AM - 3:00 PM</strong>
                </div>
                <button className="btn btn-outline-light" type="button" onClick={openBooking}>
                  <CalendarCheck aria-hidden="true" size={18} />
                  <span>Reservar ahora</span>
                </button>
              </div>
            </div>
          </div>

          <div className="text-center">
            <p className="section-kicker justify-content-center">
              <Scissors aria-hidden="true" size={26} />
              Testimonios
            </p>
            <h2 className="fw-bold">Lo que nuestros clientes dicen</h2>
            <p className="text-muted mx-auto section-copy">
              Nuestros barberos hacen un trabajo increíble. Reserva tu cita y disfruta de una
              experiencia personalizada.
            </p>
          </div>
          <ReviewsSection />
        </div>
      </section>

      <section id="servicios" className="services-section py-5 bg-light text-dark px-4">
        <div className="container text-center mb-5">
          <p className="section-kicker justify-content-center">
            <Scissors aria-hidden="true" size={26} />
            Nuestros servicios
          </p>
          <h2 className="fw-bold fs-1">Cortes de cabello populares y servicios de barbería</h2>
        </div>

        <div className="container mb-5">
          <div className="service-grid">
            {visualServices.map((service) => {
              const active = service.name === selectedService;

              return (
                <button
                  className={`service-box ${active ? "is-active" : ""}`}
                  key={service.name}
                  type="button"
                  onClick={() => setSelectedService(service.name)}
                >
                  <img src={service.icon} alt="" />
                  <span>{service.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="container">
          <div className="row align-items-center g-4">
            <div className="col-md-6">
              <div className="imagen-servicio-wrapper">
                <img src={currentService.image} className="imagen-servicio" alt={currentService.title} />
              </div>
            </div>
            <div className="col-md-6 service-detail">
              <h3>{currentService.title}</h3>
              <p>{currentService.description}</p>
              <ul>
                <li>
                  <CheckCircle2 aria-hidden="true" size={18} />
                  <span>Fácil de reservar en línea</span>
                </li>
                <li>
                  <CheckCircle2 aria-hidden="true" size={18} />
                  <span>100% satisfacción garantizada</span>
                </li>
              </ul>
              <button className="btn btn-dark" type="button" onClick={openBooking}>
                <CalendarCheck aria-hidden="true" size={18} />
                <span>Reservar ahora</span>
              </button>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
