import { useQuery } from "@tanstack/react-query";
import { useKeenSlider, type KeenSliderPlugin } from "keen-slider/react";
import "keen-slider/keen-slider.min.css";
import { Star, UserRound } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { formatReviewDate } from "../../lib/date";
import { reviewAuthor, reviewText, reviewTime } from "../../lib/normalizers";
import { getReviews } from "../../services/reviewsService";

const reviewCarousel3d: KeenSliderPlugin = (slider) => {
  const applyCarouselLayout = () => {
    const details = slider.track.details;

    if (!details || !slider.slides.length) {
      return;
    }

    const slide = slider.slides[0] as HTMLElement | undefined;
    const slideWidth = slide?.offsetWidth || Math.min(slider.container.clientWidth, 572);
    const slideCountForRadius = Math.max(slider.slides.length, 3);
    const angle = 360 / slider.slides.length;
    const radius = Math.max(
      260,
      Math.round(slideWidth / 2 / Math.tan(Math.PI / slideCountForRadius)) + 44
    );

    slider.container.style.setProperty("--reviews-carousel-radius", `${radius}px`);
    slider.container.style.transform = `translateZ(-${radius}px) rotateY(${-360 * details.progress}deg)`;

    slider.slides.forEach((element, index) => {
      (element as HTMLElement).style.transform = `rotateY(${angle * index}deg) translateZ(${radius}px)`;
    });
  };

  slider.on("created", applyCarouselLayout);
  slider.on("detailsChanged", applyCarouselLayout);
  slider.on("updated", applyCarouselLayout);
  slider.on("optionsChanged", applyCarouselLayout);
};

const reviewAutoplay: KeenSliderPlugin = (slider) => {
  let timeout: ReturnType<typeof window.setTimeout> | undefined;
  let isPointerOver = false;
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const clearNextTimeout = () => {
    if (timeout) {
      window.clearTimeout(timeout);
    }
  };

  const nextTimeout = () => {
    clearNextTimeout();

    if (prefersReducedMotion || isPointerOver || slider.slides.length < 2) {
      return;
    }

    timeout = window.setTimeout(() => {
      slider.next();
    }, 4300);
  };

  const handlePointerEnter = () => {
    isPointerOver = true;
    clearNextTimeout();
  };

  const handlePointerLeave = () => {
    isPointerOver = false;
    nextTimeout();
  };

  slider.on("created", () => {
    slider.container.addEventListener("mouseenter", handlePointerEnter);
    slider.container.addEventListener("mouseleave", handlePointerLeave);
    nextTimeout();
  });
  slider.on("dragStarted", clearNextTimeout);
  slider.on("animationEnded", nextTimeout);
  slider.on("updated", nextTimeout);
  slider.on("destroyed", () => {
    clearNextTimeout();
    slider.container.removeEventListener("mouseenter", handlePointerEnter);
    slider.container.removeEventListener("mouseleave", handlePointerLeave);
  });
};

export function ReviewsSection() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [failedAvatarUrls, setFailedAvatarUrls] = useState(() => new Set<string>());
  const reviewsQuery = useQuery({
    queryKey: ["reviews"],
    queryFn: getReviews,
    staleTime: 1000 * 60 * 10
  });
  const reviews = useMemo(() => (Array.isArray(reviewsQuery.data) ? reviewsQuery.data.slice(0, 6) : []), [reviewsQuery.data]);
  const [sliderRef, instanceRef] = useKeenSlider<HTMLDivElement>(
    {
      defaultAnimation: {
        duration: 780,
        easing: (time) => 1 - Math.pow(1 - time, 4)
      },
      drag: reviews.length > 1,
      loop: reviews.length > 1,
      mode: "free-snap",
      renderMode: "custom",
      rubberband: false,
      selector: ".reviews-carousel-cell",
      created(slider) {
        setActiveIndex(slider.track.details.rel);
      },
      slideChanged(slider) {
        setActiveIndex(slider.track.details.rel);
      }
    },
    [reviewCarousel3d, reviewAutoplay]
  );

  useEffect(() => {
    if (!reviews.length) {
      return;
    }

    setActiveIndex((current) => Math.min(current, reviews.length - 1));
    instanceRef.current?.update();
  }, [reviews.length]);

  if (reviewsQuery.isLoading) {
    return <p className="text-center text-muted">Cargando testimonios...</p>;
  }

  if (reviewsQuery.isError) {
    return <p className="text-center text-muted">No pudimos cargar los testimonios de Google en este momento.</p>;
  }

  if (!reviews.length) {
    return <p className="text-center text-muted">Aun no hay testimonios disponibles desde Google Places.</p>;
  }

  return (
    <div className="reviews-carousel reviews-carousel--keen">
      <div className="reviews-carousel-scene">
        <div className="reviews-carousel-track keen-slider" ref={sliderRef} aria-live="polite">
          {reviews.map((review, index) => {
            const author = reviewAuthor(review);
            const text = reviewText(review);
            const rating = Math.min(Math.max(review.rating ?? 0, 0), 5);
            const profilePhotoUrl = review.profile_photo_url ?? review.ProfilePhotoUrl;
            const showProfilePhoto = profilePhotoUrl && !failedAvatarUrls.has(profilePhotoUrl);

            return (
              <article
                className={`review-card reviews-carousel-cell ${index === activeIndex ? "is-active" : ""}`}
                key={`${author}-${index}`}
                aria-hidden={index !== activeIndex}
              >
                <div className="review-card-shell">
                  <div className="review-card-top">
                    {showProfilePhoto ? (
                      <img
                        src={profilePhotoUrl}
                        className="review-avatar"
                        width={70}
                        height={70}
                        alt={author}
                        loading="lazy"
                        onError={() => {
                          if (!profilePhotoUrl) {
                            return;
                          }

                          setFailedAvatarUrls((current) => {
                            if (current.has(profilePhotoUrl)) {
                              return current;
                            }

                            const next = new Set(current);
                            next.add(profilePhotoUrl);
                            return next;
                          });
                        }}
                      />
                    ) : (
                      <div className="review-avatar review-avatar-fallback">
                        <UserRound aria-hidden="true" size={30} />
                      </div>
                    )}

                    <div className="review-author-block">
                      <strong>{author}</strong>
                      <small>{formatReviewDate(reviewTime(review))}</small>
                    </div>
                  </div>

                  <p className="review-copy">{text}</p>

                  <div className="stars" aria-label={`${rating} de 5 estrellas`}>
                    {Array.from({ length: 5 }, (_, starIndex) => (
                      <Star
                        aria-hidden="true"
                        key={starIndex}
                        size={19}
                        fill={starIndex < rating ? "currentColor" : "none"}
                      />
                    ))}
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>

      <div className="reviews-carousel-dots" aria-label="Seleccionar testimonio">
        {reviews.map((review, index) => (
          <button
            key={`${reviewAuthor(review)}-dot-${index}`}
            type="button"
            className={`reviews-dot ${index === activeIndex ? "is-active" : ""}`}
            aria-label={`Mostrar testimonio ${index + 1}`}
            aria-pressed={index === activeIndex}
            onClick={() => instanceRef.current?.moveToIdx(index)}
          />
        ))}
      </div>
    </div>
  );
}
