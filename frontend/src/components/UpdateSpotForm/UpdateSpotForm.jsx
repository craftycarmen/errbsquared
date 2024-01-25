import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import SpotForm from "../SpotForm";


export default function UpdateSpotForm() {
    const { spotId } = useParams();
    const spot = useSelector(state => state.spots ? state.spots[spotId] : null);

    if (!spot) return (<></>);

    return (
        Object.keys(spot).length > 1 && (
            <>
                <SpotForm
                    spot={spot}
                    formType="Update Your Spot"
                />
            </>
        )
    )
}
