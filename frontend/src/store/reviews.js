import { csrfFetch } from "./csrf";
import { fetchSpotDetails } from "./spots";

export const LOAD_REVIEWS = '/reviews/LOAD_REVIEWS';
export const CREATE_SPOT_REVIEW = '/reviews/CREATE_SPOT_REVIEW';
export const CLEAR_REVIEWS = '/reviews/CLEAR_REVIEWS';

export const loadReviews = (reviews, spotId) => ({
    type: LOAD_REVIEWS,
    reviews,
    spotId
});

export const createSpotReview = (review) => ({
    type: CREATE_SPOT_REVIEW,
    review,
})

export const clearReviews = () => ({
    type: CLEAR_REVIEWS
})

export const fetchSpotReviews = spotId => async dispatch => {
    const res = await fetch(`/api/spots/${spotId}/reviews`);

    if (res.ok) {

        const data = await res.json();
        dispatch(loadReviews(data, spotId));
    }
}

export const addReview = (spotId, review) => async (dispatch, getState) => {
    const sessionUser = getState().session.user;

    const res = await csrfFetch(`/api/spots/${spotId}/reviews`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...review, userId: sessionUser.id })
    });
    if (res.ok) {
        const data = await res.json();
        dispatch(createSpotReview(data));
        dispatch(fetchSpotDetails(spotId));
        dispatch(fetchSpotReviews(spotId));
    }
}

const initialState = {
}

const reviewsReducer = (state = initialState, action) => {

    switch (action.type) {
        case LOAD_REVIEWS: {
            const allReviews = {};
            if (action.reviews.Reviews !== "No reviews found") {
                action.reviews.Reviews.forEach((review) => {
                    allReviews[review.id] = review
                });
            }
            return allReviews;
        }
        case CREATE_SPOT_REVIEW:
            return { ...state, [action.review.id]: action.review };
        case CLEAR_REVIEWS: {
            return {};
        }
        default:
            return state;
    }
}

export default reviewsReducer;
