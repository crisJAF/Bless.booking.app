import { useQuery } from "@tanstack/react-query";
import { ChevronLeft, ChevronRight, Star, UserRound } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { formatReviewDate } from "../../lib/date";
import { reviewAuthor, reviewText, reviewTime } from "../../lib/normalizers";
import { getReviews } from "../../services/reviewsService";

export function ReviewsSection() {
  const [activeIndex, setActiveIndex] = useState(0);
  const reviewsQuery = useQuery({
    queryKey: ["reviews"],
    queryFn: getReviews,
    staleTime: 1000 * 60 * 10
  });
  const reviews = useMemo(() => (Array.isArray(reviewsQuery.data) ? reviewsQuery.data.slice(0, 6) : []), [reviewsQuery.data]);

  useEffect(() => {
    if (!reviews.length) {
      return;
    }

    setActiveIndex((current) => Math.min(current, reviews.length - 1));
  }, [reviews.length]);

  useEffect(() => {
    if (reviews.length < 2) {
      return;
    }

    const intervalId = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % reviews.length);
    }, 4800);

    return () => {
      window.clearInterval(intervalId);
    };
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

  const previousIndex = (activeIndex - 1 + reviews.length) % reviews.length;
  const nextIndex = (activeIndex + 1) % reviews.length;

  const showPrevious = () => {
    setActiveIndex((current) => (current - 1 + reviews.length) % reviews.length);
  };

  const showNext = () => {
    setActiveIndex((current) => (current + 1) % reviews.length);
  };

  return (
    <div className="reviews-carousel">
      <div className="reviews-carousel-head">
        <div className="reviews-carousel-meta">
          <span className="reviews-carousel-label">Google Reviews</span>
          <strong>
            {activeIndex + 1}/{reviews.length}
          </strong>
        </div>
        <div className="reviews-carousel-controls">
          <button
            className="icon-button icon-button-light"
            type="button"
            aria-label="Ver testimonio anterior"
            onClick={showPrevious}
          >
            <ChevronLeft aria-hidden="true" size={18} />
          </button>
          <button
            className="icon-button icon-button-light"
            type="button"
            aria-label="Ver siguiente testimonio"
            onClick={showNext}
          >
            <ChevronRight aria-hidden="true" size={18} />
          </button>
        </div>
      </div>

      <div className="reviews-carousel-stage" aria-live="polite">
        {reviews.map((review, index) => {
          const cardState =
            index === activeIndex
              ? "review-card--active"
              : index === previousIndex
                ? "review-card--prev"
                : index === nextIndex
                  ? "review-card--next"
                  : "review-card--hidden";
          const author = reviewAuthor(review);
          const text = reviewText(review);
          const rating = Math.min(Math.max(review.rating ?? 0, 0), 5);
          const profilePhotoUrl = review.profile_photo_url ?? review.ProfilePhotoUrl;

          return (
            <article
              className={`review-card review-card--carousel ${cardState}`}
              key={`${author}-${index}`}
              aria-hidden={cardState === "review-card--hidden"}
            >
              <div className="review-card-shell">
                <div className="review-card-top">
                  {profilePhotoUrl ? (
                    <img
                      src={profilePhotoUrl}
                      className="review-avatar"
                      width={70}
                      height={70}
                      alt={author}
                      loading="lazy"
                    />
                  ) : (
                    <div className="review-avatar review-avatar-fallback">
                      <UserRound aria-hidden="true" size={28} />
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
                      size={17}
                      fill={starIndex < rating ? "currentColor" : "none"}
                    />
                  ))}
                </div>
              </div>
            </article>
          );
        })}
      </div>

      <div className="reviews-carousel-dots" aria-label="Seleccionar testimonio">
        {reviews.map((review, index) => (
          <button
            key={`${reviewAuthor(review)}-dot-${index}`}
            type="button"
            className={`reviews-dot ${index === activeIndex ? "is-active" : ""}`}
            aria-label={`Mostrar testimonio ${index + 1}`}
            aria-pressed={index === activeIndex}
            onClick={() => setActiveIndex(index)}
          />
        ))}
      </div>
    </div>
  );
}
