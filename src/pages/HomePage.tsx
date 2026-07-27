import {
  ArrowUpRight,
  CalendarCheck,
  CheckCircle2,
  Clock3,
  MapPin,
  Phone,
  Scissors,
  ShieldCheck,
  Sparkles,
  Users,
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
    description: "Corte rapido, limpio y clasico para mantener tu estilo."
  },
  {
    name: "Corte Moderno",
    icon: "/img/corte-moderno.png",
    title: "Corte Moderno",
    image: "/img/detalle-corte-moderno.jpg",
    description: "Corte actualizado con lineas modernas y estilo urbano."
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
    title: "Perfilacion de Cejas",
    image: "/img/detalle-ceja.jpg",
    description: "Resalta tu mirada con una forma precisa y armoniosa."
  },
  {
    name: "Skin Care",
    icon: "/img/skin-care.png",
    title: "Tratamiento Facial",
    image: "/img/detalle-skin-care.jpg",
    description: "Revitaliza tu piel con productos especializados y tecnicas modernas."
  }
];

const heroTickerItems = [
  "Bless Barber Shop",
  "Cortes de precision",
  "Barba y perfilado",
  "Agenda en linea",
  "Atencion personalizada",
  "Reserva en minutos"
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
  const heroVideoRef = useRef<HTMLVideoElement | null>(null);
  const aboutSectionRef = useRef<HTMLDivElement | null>(null);
  const [aboutMotionReady, setAboutMotionReady] = useState(false);
  const [aboutVisible, setAboutVisible] = useState(false);

  const currentService = useMemo(
    () => visualServices.find((service) => service.name === selectedService) ?? visualServices[0],
    [selectedService]
  );

  useEffect(() => {
    const video = heroVideoRef.current;

    if (!video) {
      return;
    }

    let seekedToPreferredStart = false;

    const syncPreferredStart = () => {
      if (seekedToPreferredStart || !Number.isFinite(video.duration) || video.duration <= 4.2) {
        return;
      }

      seekedToPreferredStart = true;
      video.currentTime = 4.2;
    };

    syncPreferredStart();
    video.addEventListener("loadedmetadata", syncPreferredStart);

    return () => {
      video.removeEventListener("loadedmetadata", syncPreferredStart);
    };
  }, []);

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

  const aboutShellClassName = ["container about-shell", aboutMotionReady ? "about-shell--motion" : "", aboutVisible ? "is-visible" : ""]
    .filter(Boolean)
    .join(" ");

  return (
    <main>
      <section id="inicio" className="home-hero">
        <div className="hero-media" aria-hidden="true">
          <video
            ref={heroVideoRef}
            className="hero-video"
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            poster="/video/hero-barber-pexels-5450148.jpg"
          >
            <source src="/video/hero-barber-pexels-5450148.mp4" type="video/mp4" />
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
            <div className="hero-actions">
              <button className="btn btn-light hero-primary-action" type="button" onClick={openBooking}>
                <CalendarCheck aria-hidden="true" size={20} />
                <span>Reservar ahora</span>
              </button>
            </div>
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
            <p className="section-kicker text-secondary">
              <Scissors aria-hidden="true" size={26} />
              Reservar ahora
            </p>
            <h2>Reserva tu cita en linea</h2>
            <p>Obten un 10% de descuento en tu primer corte reservando a traves de nuestro sitio web.</p>
            <button className="btn btn-outline-light" type="button" onClick={openBooking}>
              <CalendarCheck aria-hidden="true" size={18} />
              <span>Reservar ahora</span>
            </button>
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
                    <span>Reserva con horario claro y respuesta mas directa.</span>
                  </div>
                  <button className="btn btn-outline-light" type="button" onClick={openBooking}>
                    <CalendarCheck aria-hidden="true" size={18} />
                    <span>Reservar ahora</span>
                  </button>
                </div>
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
                  <span>Facil de reservar en linea</span>
                </li>
                <li>
                  <CheckCircle2 aria-hidden="true" size={18} />
                  <span>100% satisfaccion garantizada</span>
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
