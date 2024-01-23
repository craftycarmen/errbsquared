import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import { deleteReview } from "../../store/reviews";

export default function DeleteSpotModal({ reviewId }) {
    const { closeModal } = useModal();
    const dispatch = useDispatch();

    const yes = () => {
        return dispatch(deleteReview(reviewId))
            .then(closeModal)
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
