import { createSelector } from 'reselect';
import { csrfFetch } from './csrf';

export const LOAD_SPOTS = '/spots/LOAD_SPOTS';
export const LOAD_SPOT_DETAILS = '/spots/LOAD_SPOT_DETAILS';
export const UPDATE_SPOT = '/spots/UPDATE_SPOT';
export const LOAD_SPOT_IMAGES = '/spots/LOAD_SPOT_IMAGES';
export const UPDATE_SPOT_IMAGES = '/spots/UPDATE_SPOT_IMAGES';
export const LOAD_SPOT_REVIEW = '/spots/LOAD_SPOT_REVIEW';
export const DELETE_SPOT = '/spots/DELETE_SPOT';

export const loadSpots = (spots) => ({
    type: LOAD_SPOTS,
    spots
});

export const loadSpotDetails = (spot) => ({
    type: LOAD_SPOT_DETAILS,
    spot
});

export const editSpot = (spotId, spot) => ({
    type: UPDATE_SPOT,
    spotId,
    spot
})

export const editSpotImages = (spotId, spotImage) => ({
    type: UPDATE_SPOT_IMAGES,
    spotId,
    spotImage
});

export const loadSpotImages = (spotImage, spotId) => ({
    type: LOAD_SPOT_IMAGES,
    spotImage,
    spotId
});

export const loadSpotReview = (spotReview, spotId) => ({
    type: LOAD_SPOT_REVIEW,
    spotReview,
    spotId
});

export const removeSpot = (spotId) => ({
    type: DELETE_SPOT,
    spotId
})

export const getAllSpots = () => async dispatch => {
    const res = await fetch('/api/spots');

    if (res.ok) {
        const data = await res.json();
        dispatch(loadSpots(data));
    }
};

export const fetchSpotDetails = spotId => async dispatch => {
    const res = await fetch(`/api/spots/${spotId}`);

    if (res.ok) {
        const data = await res.json();
        // dispatch(loadSpotDetails(data, spotId));
        dispatch(loadSpotDetails(data));
        return data;
    }
};

export const fetchOwnerSpots = () => async dispatch => {
    const res = await csrfFetch('/api/spots/current');

    if (res.ok) {
        const data = await res.json();
        dispatch(loadSpots(data))
    }
}

export const createSpot = (spot) => async dispatch => {
    const res = await csrfFetch('/api/spots', {
        method: 'POST',
        body: JSON.stringify(spot)
    });

    if (res.ok) {
        const data = await res.json();
        dispatch(loadSpotDetails(data))
        return data
    }
};

export const updateSpot = (spotId, spot) => async dispatch => {
    const res = await csrfFetch(`/api/spots/${spotId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...spot })
    });

    if (res.ok) {
        const data = await res.json();
        dispatch(editSpot(spotId, data));
        return data;
    }
};

export const editSpotImage = (spotId, spotImage) => async dispatch => {
    const res = await csrfFetch(`/api/spots/${spotId}/images`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(spotImage)
    });

    if (res.ok) {
        const data = await res.json();
        dispatch(editSpotImage(spotId, data))
        return data
    }
};

export const createSpotImage = (spotId, spotImage) => async dispatch => {
    const res = await csrfFetch(`/api/spots/${spotId}/images`, {
        method: 'POST',
        body: JSON.stringify(spotImage)
    });

    if (res.ok) {
        const data = await res.json();
        dispatch(loadSpotImages(data, spotId))
        return data
    }
};

export const deleteSpot = (spotId) => async dispatch => {
    const res = await csrfFetch(`/api/spots/${spotId}`, {
        method: 'DELETE',
    });

    if (res.ok) {
        dispatch(removeSpot(spotId))
    }
};

// export const createSpotReview = (spotId, spotReview) => async dispatch => {
//     const res = await csrfFetch(`/api/spots/${spotId}/reviews`, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify(spotReview)
//     });

//     if (res.ok) {
//         const data = await res.json();
//         dispatch(loadSpotReview(data, spotId))
//         return data
//     }
// };

const selectedSpots = state => state.spots;

export const spotsArr = createSelector(selectedSpots, spots => Object.values(spots));


const initialState = {
}
const spotsReducer = (state = initialState, action) => {

    switch (action.type) {
        case LOAD_SPOTS: {
            const allSpots = {};
            if (action.spots.Spots !== "No spots found") {
                action.spots.Spots.forEach((spot) => {

                    allSpots[spot.id] = spot;
                });
            }
            return allSpots;
        }
        case LOAD_SPOT_DETAILS:
            return { ...state, [action.spot.id]: action.spot };
        // return { spotDetails: action.spot }

        case UPDATE_SPOT:
            return { ...state, [action.spot.id]: action.spot }

        case LOAD_SPOT_IMAGES:
            return { ...state, [action.spotId]: action.spotImage }

        case UPDATE_SPOT_IMAGES:
            return { ...state, [action.spotId]: action.spotImage }

        case LOAD_SPOT_REVIEW:
            return { ...state, [action.spotId]: action.spotReview }

        case DELETE_SPOT: {
            const newState = { ...state };
            delete newState[action.spotId];
            return newState;
        }

        default:
            return state;
    }
}

export default spotsReducer;
