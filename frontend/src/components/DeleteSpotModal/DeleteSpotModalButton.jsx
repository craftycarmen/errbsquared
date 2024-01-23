import OpenModalButton from "../OpenModalButton/OpenModalButton";
import DeleteSpotModal from "./DeleteSpotModal";

export default function DeleteSpotModalButton({ spotId }) {
    return (
        <OpenModalButton
            buttonText="Delete"
            modalComponent={<DeleteSpotModal spotId={spotId} />}
        />
    )
}
