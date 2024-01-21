import { useParams } from "react-router-dom";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchSpotDetails } from "../../store/spots";
import SpotForm from "../SpotForm";

export default function UpdateSpotForm() {
    const { spotId } = useParams();
    const spot = useSelector(state => state.spots ? state.spots[spotId] : null);
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(fetchSpotDetails(spotId))
    }, [dispatch, spotId]);

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
