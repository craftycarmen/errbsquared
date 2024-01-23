import OpenModalButton from "../OpenModalButton/OpenModalButton";
import DeleteReviewModal from "./DeleteReviewModal";

export default function DeleteReviewModalButton({ reviewId }) {
    return (
        <OpenModalButton
            buttonText="Delete"
            modalComponent={<DeleteReviewModal reviewId={reviewId} />}
        />
    )
}
