import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import gsap from "gsap";
import { deleteReview, clearReviews, addReview } from "../Redux/feature/ReviewSlice";
import { PK, IN, US, GB, CA, AU, AE, SA, TR, DE, FR } from "country-flag-icons/react/3x2";
import "../styles/ReviewsPanel.css";

const STORAGE_KEY = "websiteReviews";

const flagComponents = { PK, IN, US, GB, CA, AU, AE, SA, TR, DE, FR };

function TrashIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M4 7h16M9 7V4h6v3M7 7l1 13h8l1-13M10 11v5M14 11v5" />
    </svg>
  );
}

function ClearIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M5 7h14M9 7V4h6v3M7 7l1 13h8l1-13M10 11v5M14 11v5" />
    </svg>
  );
}

function CountryFlag({ countryCode }) {
  const Flag = flagComponents[countryCode?.toUpperCase()];

  if (!Flag) return null;

  return <Flag className="review-country-flag" title={countryCode} />;
}

function ReviewsPanel() {
  const dispatch = useDispatch();
  const reviews = useSelector((state) => state.review.data);
  const listRef = useRef(null);

  useEffect(() => {
    const savedReviews = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");

    if (savedReviews.length && reviews.length === 0) {
      savedReviews.forEach((review) => {
        dispatch(addReview(review));
      });
    }
  }, [dispatch]);

  useEffect(() => {
    if (!listRef.current || !reviews.length) return;

    gsap.fromTo(listRef.current.children, { y: 18, opacity: 0 }, { y: 0, opacity: 1, duration: 0.45, stagger: 0.08, ease: "power3.out" });
  }, [reviews]);

  const deleteReviewHandler = (id) => {
    const updatedReviews = reviews.filter((review) => review.id !== id);

    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedReviews));
    dispatch(deleteReview(id));
  };

  const clearAllReviews = () => {
    if (!reviews.length) return;

    gsap.to(listRef.current.children, {
      x: -20,
      opacity: 0,
      duration: 0.25,
      stagger: 0.04,
      ease: "power2.in",
      onComplete: () => {
        localStorage.removeItem(STORAGE_KEY);
        dispatch(clearReviews());
      }
    });
  };

  return (
    <section className="reviews-panel">
      <div className="reviews-header">
        <div>
          <span className="reviews-label">CUSTOMER FEEDBACK</span>
          <h2>Reviews</h2>
        </div>

        <button className="clear-reviews-btn" onClick={clearAllReviews} disabled={!reviews.length}>
          <ClearIcon />
          <span>Clear All</span>
        </button>
      </div>

      <div className="reviews-list" ref={listRef}>
        {reviews.length === 0 ? (
          <div className="reviews-empty">
            <div className="empty-icon">
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M5 5h14v11H9l-4 4V5Z" />
                <path d="M8 9h8M8 12h5" />
              </svg>
            </div>

            <strong>No reviews yet</strong>
            <span>Customer reviews will appear here.</span>
          </div>
        ) : (
          reviews.map((review) => (
            <div className="review-item" key={review.id}>
              <div className="review-flag">
                <CountryFlag countryCode={review.countryCode} />
              </div>

              <div className="review-content">
                <div className="review-top">
                  <strong>{review.name || "Anonymous"}</strong>
                </div>

                <p>{review.review || "No review text."}</p>
              </div>

              <button className="delete-review-btn" onClick={() => deleteReviewHandler(review.id)} aria-label="Delete review">
                <TrashIcon />
              </button>
            </div>
          ))
        )}
      </div>

      <div className="reviews-footer">
        <span>{reviews.length} {reviews.length === 1 ? "Review" : "Reviews"}</span>
      </div>
    </section>
  );
}

export default ReviewsPanel;
