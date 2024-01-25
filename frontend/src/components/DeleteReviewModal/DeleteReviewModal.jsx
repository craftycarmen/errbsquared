import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import { deleteReview } from "../../store/reviews";

export default function DeleteReviewModal({ reviewId, spotId }) {
    const { closeModal } = useModal();
    const dispatch = useDispatch();
    const yes = (e) => {
        e.preventDefault();

        dispatch(deleteReview(reviewId))
            .then(closeModal)
            .catch(async res => {
                const data = await res.json();
                return data;
            })

    }

    return (
        <section className="modal">
            <h1>Confirm Delete</h1>
            <p>Are you sure you want to remove this review?</p>
            <button
                id="yes"
                onClick={yes}>Yes (Delete Review)
            </button>
            <button
                id="noButton"
                onClick={closeModal}>No (Keep Review)
            </button>
        </section>
    )
}
