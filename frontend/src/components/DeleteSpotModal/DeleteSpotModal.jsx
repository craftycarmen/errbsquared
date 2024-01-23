import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import './DeleteSpotModal.css';

export default function DeleteSpotModal({ spotId }) {
    const { closeModal } = useModal();
    const dispatch = useDispatch();

    return (
        <div>DeleteSpotModal</div>
    )
}
