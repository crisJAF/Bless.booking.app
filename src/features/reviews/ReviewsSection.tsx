import { useQuery } from "@tanstack/react-query";
import { Star, UserRound } from "lucide-react";
import { formatReviewDate } from "../../lib/date";
import { reviewAuthor, reviewText, reviewTime } from "../../lib/normalizers";
import { getReviews } from "../../services/reviewsService";

export function ReviewsSection() {
  const reviewsQuery = useQuery({
    queryKey: ["reviews"],
    queryFn: getReviews,
    staleTime: 1000 * 60 * 10
  });

  if (reviewsQuery.isLoading) {
    return <p className="text-center text-muted">Cargando testimonios...</p>;
  }

  if (reviewsQuery.isError || !reviewsQuery.data?.length) {
    return (
      <p className="text-center text-muted">
        Aún no hay testimonios disponibles desde Google Places.
      </p>
    );
  }

  return (
    <div className="reviews-grid">
      {reviewsQuery.data.slice(0, 6).map((review, index) => {
        const author = reviewAuthor(review);
        const text = reviewText(review);
        const rating = Math.min(Math.max(review.rating ?? 0, 0), 5);

        return (
          <article className="review-card" key={`${author}-${index}`}>
            {review.profile_photo_url ? (
              <img
                src={review.profile_photo_url}
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

            <div>
              <strong>{author}</strong>
              <small>{formatReviewDate(reviewTime(review))}</small>
            </div>
          </article>
        );
      })}
    </div>
  );
}
