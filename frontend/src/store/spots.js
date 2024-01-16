import { createSelector } from 'reselect';

export const LOAD_SPOTS = '/spots/LOAD_SPOTS';
export const LOAD_SPOT_DETAILS = '/spots/LOAD_SPOT_DETAILS';
// export const LOAD_REVIEWS = '/spots/LOAD_REVIEWS';

export const loadSpots = (spots) => ({
    type: LOAD_SPOTS,
    spots
});

export const loadSpotDetails = (spot) => ({
    type: LOAD_SPOT_DETAILS,
    spot
});

// export const loadReviews = (reviews, spotId) => ({
//     type: LOAD_REVIEWS,
//     reviews,
//     spotId
// })

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
        dispatch(loadSpotDetails(data));
    }
}

// export const fetchSpotReviews = spotId => async dispatch => {
//     const res = await fetch(`/api/spots/${spotId}/reviews`);

//     if (res.ok) {
//         const data = await res.json();
//         dispatch(loadReviews(data.Reviews, spotId));
//     }
// }

const selectedSpots = state => state.spots;
// const selectedReviews = state => {
//     console.log("SS", state);
// }

export const spotsArr = createSelector(selectedSpots, spots => Object.values(spots));

// export const reviewsArr = createSelector(selectedReviews, reviews => Object.values(reviews))

const initialState = {
}
const spotsReducer = (state = initialState, action) => {

    switch (action.type) {
        case LOAD_SPOTS: {
            const allSpots = {};

            action.spots.Spots.forEach((spot) => {

                allSpots[spot.id] = spot;
            });

            return allSpots;
        }

        case LOAD_SPOT_DETAILS:
            return { ...state, [action.spot.id]: action.spot };

        // case LOAD_REVIEWS:

        //     const allReviews = {};

        //     action.reviews.forEach((review) => {
        //         allReviews[review.id] = review;
        //     });

        //     return allReviews;

        default:
            return state;
    }
}

export default spotsReducer;
