import SpotForm from "../SpotForm";

export default function UpdateSpotForm({ spot }) {

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
