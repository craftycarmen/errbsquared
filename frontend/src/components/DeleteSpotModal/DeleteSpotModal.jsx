import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import './DeleteSpotModal.css';
import { deleteSpot } from "../../store/spots";

export default function DeleteSpotModal({ spotId }) {
    const { closeModal } = useModal();
    const dispatch = useDispatch();

    const yes = () => {
        return dispatch(deleteSpot(spotId))
            .then(closeModal)
    }

    return (
        <section className="deleteSpot">
            <h1>Confirm Delete</h1>
            <p>Are you sure you want to remove this spot from the listings?</p>
            <button
                id="yes"
                onClick={yes}>Yes (Delete Spot)
            </button>
            <button
                id="no"
                onClick={closeModal}>No (Keep Spot)
            </button>
        </section>
    )
}
