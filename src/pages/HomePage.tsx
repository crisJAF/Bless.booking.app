import {
  ArrowUpRight,
  BadgePercent,
  CalendarCheck,
  CheckCircle2,
  Clock3,
  MapPin,
  Phone,
  Scissors,
  ShieldCheck,
  Sparkles,
  Users,
  X,
  type LucideIcon
} from "lucide-react";
import { startTransition, useEffect, useMemo, useRef, useState } from "react";
import { usePublicLayout } from "../components/PublicLayout";
import { ReviewsSection } from "../features/reviews/ReviewsSection";

type VisualService = {
  name: string;
  icon: string;
  title: string;
  image: string;
  description: string;
  bookingCta: string;
};

type AboutPillar = {
  title: string;
  description: string;
  icon: LucideIcon;
};

type ScheduleEntry = {
  day: string;
  primaryHours: string;
  secondaryHours?: string;
};

const visualServices: VisualService[] = [
  {
    name: "Corte Basico",
    icon: "/img/corte-basico.png",
    title: "Corte Basico",
    image: "/img/detalle-corte-basico.jpg",
    description: "Corte rapido, limpio y clasico para mantener tu estilo.",
    bookingCta: "Reservar corte basico"
  },
  {
    name: "Corte Moderno",
    icon: "/img/corte-moderno.png",
    title: "Corte Moderno",
    image: "/img/detalle-corte-moderno.jpg",
    description: "Corte actualizado con lineas modernas y estilo urbano.",
    bookingCta: "Reservar corte moderno"
  },
  {
    name: "Barba",
    icon: "/img/corte-barba.png",
    title: "Corte de Barba",
    image: "/img/detalle-barba.jpg",
    description: "Perfecciona tu barba con un acabado prolijo y elegante.",
    bookingCta: "Reservar barba"
  },
  {
    name: "Perfilacion de cejas",
    icon: "/img/perfilacion-cejas.png",
    title: "Perfilacion de Cejas",
    image: "/img/detalle-ceja.jpg",
    description: "Resalta tu mirada con una forma precisa y armoniosa.",
    bookingCta: "Reservar cejas"
  },
  {
    name: "Skin Care",
    icon: "/img/skin-care.png",
    title: "Tratamiento Facial",
    image: "/img/detalle-skin-care.jpg",
    description: "Revitaliza tu piel con productos especializados y tecnicas modernas.",
    bookingCta: "Reservar facial"
  }
];

const heroTickerItems = [
  "Fade limpio",
  "Reserva en minutos",
  "Acabado profesional",
  "Agenda sin llamadas"
];

const aboutPillars: AboutPillar[] = [
  {
    title: "Acabado limpio",
    description: "Cortes, barba y detalle fino trabajados con una linea visual mas precisa.",
    icon: Sparkles
  },
  {
    title: "Ambiente directo",
    description: "Atencion clara, cercana y sin vueltas para que tu visita se sienta fluida.",
    icon: Users
  },
  {
    title: "Reserva confiable",
    description: "Horario visible y agenda simple para llegar con tu espacio bien definido.",
    icon: ShieldCheck
  }
];

const scheduleEntries: ScheduleEntry[] = [
  {
    day: "Lunes a sabados",
    primaryHours: "9:00 AM - 1:00 PM",
    secondaryHours: "2:00 PM - 7:00 PM"
  },
  {
    day: "Domingo",
    primaryHours: "9:30 AM - 3:00 PM"
  }
];

export function HomePage() {
  const { openBooking } = usePublicLayout();
  const [selectedService, setSelectedService] = useState(visualServices[0].name);
  const aboutSectionRef = useRef<HTMLDivElement | null>(null);
  const [aboutMotionReady, setAboutMotionReady] = useState(false);
  const [aboutVisible, setAboutVisible] = useState(false);
  const [promoVisible, setPromoVisible] = useState(false);

  const currentService = useMemo(
    () => visualServices.find((service) => service.name === selectedService) ?? visualServices[0],
    [selectedService]
  );

  useEffect(() => {
    setAboutMotionReady(true);

    const section = aboutSectionRef.current;

    if (!section || typeof window === "undefined") {
      setAboutVisible(true);
      return;
    }

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches || typeof IntersectionObserver === "undefined") {
      setAboutVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry) {
          return;
        }

        setAboutVisible((previouslyVisible) => {
          if (!entry.isIntersecting) {
            return false;
          }

          if (entry.intersectionRatio >= 0.16) {
            return true;
          }

          return previouslyVisible;
        });
      },
      {
        threshold: [0, 0.16, 0.32, 0.48]
      }
    );

    observer.observe(section);

    return () => {
      observer.disconnect();
    };
  }, []);

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      setPromoVisible(true);
    }, 1600);

    return () => {
      window.clearTimeout(timeout);
    };
  }, []);

  const closePromo = () => {
    setPromoVisible(false);
  };

  const openPromoBooking = () => {
    closePromo();
    openBooking();
  };

  const aboutShellClassName = ["container about-shell", aboutMotionReady ? "about-shell--motion" : "", aboutVisible ? "is-visible" : ""]
    .filter(Boolean)
    .join(" ");

  return (
    <main className="home-page">
      <section id="inicio" className="home-hero">
        <div className="hero-media" aria-hidden="true">
          <video
            className="hero-video"
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            poster="/video/hero-barber-pexels-8252400.jpg"
          >
            <source src="/video/hero-barber-pexels-8252400.mp4" type="video/mp4" />
          </video>
          <div className="hero-vignette" />
        </div>

        <div className="hero-content">
          <div className="hero-copy-block">
            <div className="hero-brand-lockup">
              <img src="/img/bless-logo.png" alt="Logo Bless Barber Shop" className="hero-logo" />
              <div className="hero-brand-copy">
                <span>Bless Barber Shop</span>
                <small>Barberia en Managua</small>
              </div>
            </div>
            <h1>Reserva tu corte. Llega con estilo.</h1>
            <p className="hero-copy">
              Una experiencia de barberia mas directa, moderna y profesional. Agenda en linea y
              llega con tu espacio asegurado.
            </p>
            <button className="hero-promo-badge" type="button" onClick={openPromoBooking}>
              <BadgePercent aria-hidden="true" size={22} />
              <span>Promo online</span>
              <strong>10% de descuento en tu primer corte</strong>
            </button>
            <div className="hero-actions">
              <button className="btn btn-light hero-primary-action" type="button" onClick={openBooking}>
                <CalendarCheck aria-hidden="true" size={20} />
                <span>Reservar ahora</span>
              </button>
            </div>
            <p className="cta-microcopy hero-cta-microcopy">Toma menos de 1 minuto. No pagas en linea, solo apartas tu horario.</p>
            <div className="hero-hours">
              <Clock3 aria-hidden="true" size={18} />
              <span>Lunes a sabados 9:00 AM - 7:00 PM</span>
            </div>
          </div>
        </div>

        <div className="hero-ticker" aria-hidden="true">
          <div className="hero-ticker-track">
            {[...heroTickerItems, ...heroTickerItems].map((item, index) => (
              <span key={`${item}-${index}`}>{item}</span>
            ))}
          </div>
        </div>
      </section>

      <section id="nosotros" className="about-section bg-white px-4 scroll-reveal">
        <div className={aboutShellClassName} ref={aboutSectionRef}>
          <div className="about-story-grid">
            <div className="image-collage about-collage">
              <div className="collage-row">
                <div className="collage-card collage-card--one">
                  <img src="/img/barba-barbero.jpg" className="collage-img-small" alt="Detalle de barba" />
                </div>
                <div className="collage-card collage-card--two">
                  <img src="/img/raya-barbero.jpg" className="collage-img-small" alt="Detalle de corte" />
                </div>
              </div>
              <div className="collage-card collage-card--three">
                <img src="/img/cara-barbero.jpg" className="collage-img-large" alt="Corte profesional" />
              </div>
            </div>

            <div className="text-content about-story-panel">
              <div className="about-heading-group">
                <p className="section-kicker">
                  <Scissors aria-hidden="true" size={26} />
                  Sobre nosotros
                </p>
                <span className="about-outline-word" aria-hidden="true">
                  Bless
                </span>
                <h2>Barberia precisa para hombres que quieren llegar listos.</h2>
              </div>
              <p className="about-lead">
                Bless Barber Shop esta pensado para quien busca un corte limpio, una experiencia
                agil y una barberia con caracter local. La idea no es llenar la visita de ruido,
                sino dar una atencion mejor enfocada, con detalle en la ejecucion y ritmo claro
                desde la reserva hasta el acabado final.
              </p>
              <div className="about-principles">
                {aboutPillars.map((pillar) => (
                  <article className="about-principle" key={pillar.title}>
                    <div className="about-principle-icon">
                      <pillar.icon aria-hidden="true" size={18} />
                    </div>
                    <div>
                      <h3>{pillar.title}</h3>
                      <p>{pillar.description}</p>
                    </div>
                  </article>
                ))}
              </div>
              <div className="about-action-row">
                <div className="about-location-chip" aria-label="Ubicacion en Managua">
                  <MapPin aria-hidden="true" size={16} />
                  <span>Managua</span>
                </div>
                <button className="btn btn-dark about-booking-btn" type="button" onClick={openBooking}>
                  <span>Reservar cita</span>
                  <ArrowUpRight aria-hidden="true" size={18} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="contacto" className="booking-section text-white scroll-reveal">
        <div className="container booking-content">
          <div className="booking-text booking-text-panel">
            <div className="booking-offer-badge">
              <BadgePercent aria-hidden="true" size={18} />
              <span>Promo exclusiva web</span>
            </div>
            <h2>Reserva en linea y ahorra en tu primer corte.</h2>
            <p>
              Obten un 10% de descuento en tu primer corte reservando a traves de nuestro sitio web.
              Elige tu horario, aparta tu espacio y llega directo a Bless.
            </p>
            <ul className="booking-benefits" aria-label="Beneficios de reservar en linea">
              <li>
                <CheckCircle2 aria-hidden="true" size={18} />
                <span>Promo aplicada a tu primera reserva web</span>
              </li>
              <li>
                <CheckCircle2 aria-hidden="true" size={18} />
                <span>Tu horario queda apartado antes de llegar</span>
              </li>
              <li>
                <CheckCircle2 aria-hidden="true" size={18} />
                <span>Reserva rapido sin llamadas ni esperas</span>
              </li>
            </ul>
            <button className="btn btn-outline-light" type="button" onClick={openBooking}>
              <CalendarCheck aria-hidden="true" size={18} />
              <span>Aprovechar promocion</span>
            </button>
            <p className="cta-microcopy booking-cta-microcopy">No pagas en linea. Solo elegis tu hora y apartas tu espacio.</p>
          </div>

          <div className="call-box booking-call-card">
            <Phone aria-hidden="true" size={36} />
            <p>Llamanos ahora</p>
            <strong>+505 7746 7334</strong>
          </div>
        </div>
      </section>

      <section className="working-review-section py-5 bg-light text-dark px-4 scroll-reveal">
        <div className="container">
          <div className="working-schedule-grid mb-5">
            <div className="working-visual-column d-flex justify-content-center">
              <div className="working-image-frame">
                <img src="/img/barberoTrabajando.jpg" alt="Barbero trabajando" className="working-image" />
              </div>
            </div>

            <div className="working-copy-column">
              <div className="schedule-card schedule-card--enhanced bg-dark text-white">
                <div className="schedule-card-head">
                  <span className="schedule-eyebrow">Horario</span>
                  <div className="schedule-status">
                    <span className="schedule-status-dot" />
                    <span>Agenda abierta</span>
                  </div>
                </div>
                <h3>Dias de atencion</h3>
                <p>Abrimos siete dias a la semana para brindarte el mejor servicio.</p>
                <div className="schedule-list">
                  {scheduleEntries.map((entry) => (
                    <div className="schedule-row schedule-row--panel" key={entry.day}>
                      <div className="schedule-day">
                        <span>{entry.day}</span>
                      </div>
                      <div className="schedule-time-stack">
                        <strong>{entry.primaryHours}</strong>
                        {entry.secondaryHours ? <small>{entry.secondaryHours}</small> : null}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="schedule-card-footer">
                  <div className="schedule-foot-note">
                    <Clock3 aria-hidden="true" size={16} />
                    <span>Reserva con horario claro y asegura tu primer corte con promo web.</span>
                  </div>
                  <button className="btn btn-outline-light" type="button" onClick={openBooking}>
                    <CalendarCheck aria-hidden="true" size={18} />
                    <span>Reservar ahora</span>
                  </button>
                </div>
                <p className="schedule-card-microcopy">Aparta tu horario hoy y llega directo a tu cita.</p>
              </div>
            </div>
          </div>

          <div className="reservation-confidence">
            <div className="reservation-confidence-icon">
              <ShieldCheck aria-hidden="true" size={24} />
            </div>
            <div>
              <span>Reserva con confianza</span>
              <h3>Tu espacio queda apartado antes de llegar.</h3>
              <p>Sin esperas largas, con horario claro y atencion directa desde que entras a Bless.</p>
            </div>
            <button className="btn btn-dark reservation-confidence-cta" type="button" onClick={openBooking}>
              <CalendarCheck aria-hidden="true" size={18} />
              <span>Apartar mi horario</span>
            </button>
          </div>

          <div className="text-center">
            <p className="section-kicker justify-content-center">
              <Scissors aria-hidden="true" size={26} />
              Testimonios
            </p>
            <h2 className="fw-bold">Lo que nuestros clientes dicen</h2>
            <p className="text-muted mx-auto section-copy">
              Nuestros barberos hacen un trabajo increible. Reserva tu cita y disfruta de una
              experiencia personalizada.
            </p>
          </div>
          <ReviewsSection />
        </div>
      </section>

      <section id="servicios" className="services-section py-5 bg-light text-dark px-4 scroll-reveal">
        <div className="container text-center mb-5">
          <p className="section-kicker justify-content-center">
            <Scissors aria-hidden="true" size={26} />
            Nuestros servicios
          </p>
          <h2 className="fw-bold fs-1">Cortes de cabello populares y servicios de barberia</h2>
        </div>

        <div className="container mb-5">
          <div className="service-grid">
            {visualServices.map((service) => {
              const active = service.name === selectedService;

              return (
                <button
                  aria-pressed={active}
                  className={`service-box ${active ? "is-active" : ""}`}
                  key={service.name}
                  type="button"
                  onClick={() => {
                    startTransition(() => {
                      setSelectedService(service.name);
                    });
                  }}
                >
                  <img src={service.icon} alt="" />
                  <span>{service.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="container">
          <div className="service-detail-layout" key={currentService.name}>
            <div className="service-detail-media">
              <span className="service-media-badge">{currentService.title}</span>
              <div className="imagen-servicio-wrapper">
                <img src={currentService.image} className="imagen-servicio" alt={currentService.title} />
              </div>
            </div>
            <div className="service-detail service-detail-panel">
              <h3>{currentService.title}</h3>
              <p>{currentService.description}</p>
              <ul>
                <li>
                  <CheckCircle2 aria-hidden="true" size={18} />
                  <span>Reserva en linea y aplica la promo de bienvenida</span>
                </li>
                <li>
                  <CheckCircle2 aria-hidden="true" size={18} />
                  <span>100% satisfaccion garantizada</span>
                </li>
              </ul>
              <button className="btn btn-dark" type="button" onClick={openBooking}>
                <CalendarCheck aria-hidden="true" size={18} />
                <span>{currentService.bookingCta}</span>
              </button>
              <p className="cta-microcopy service-cta-microcopy">Tu promo de bienvenida aplica reservando desde la web.</p>
            </div>
          </div>
        </div>
      </section>

      {promoVisible ? (
        <aside className="promo-popup" role="dialog" aria-labelledby="promo-popup-title" aria-describedby="promo-popup-copy">
          <button className="icon-button icon-button-light promo-popup-close" type="button" aria-label="Cerrar promocion" onClick={closePromo}>
            <X aria-hidden="true" size={18} />
          </button>
          <div className="promo-popup-icon">
            <BadgePercent aria-hidden="true" size={24} />
          </div>
          <p className="promo-popup-label">Promo online</p>
          <h2 id="promo-popup-title">10% de descuento en tu primer corte</h2>
          <p className="promo-popup-copy" id="promo-popup-copy">
            Reserva desde la pagina, asegura tu horario y aprovecha la promocion de bienvenida.
          </p>
          <button className="btn btn-dark promo-popup-action" type="button" onClick={openPromoBooking}>
            <CalendarCheck aria-hidden="true" size={18} />
            <span>Reservar con descuento</span>
          </button>
        </aside>
      ) : null}

      <div className="mobile-sticky-cta" aria-label="Promocion para reservar en linea">
        <div>
          <span>10% OFF primer corte</span>
          <strong>Reserva en linea y asegura tu hora</strong>
        </div>
        <button className="btn btn-light" type="button" onClick={openPromoBooking}>
          <CalendarCheck aria-hidden="true" size={17} />
          <span>Reservar</span>
        </button>
      </div>
    </main>
  );
}
