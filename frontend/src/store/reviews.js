export const LOAD_REVIEWS = '/reviews/LOAD_REVIEWS';
export const CLEAR_REVIEWS = '/reviews/CLEAR_REVIEWS';

export const loadReviews = (reviews, spotId) => ({
    type: LOAD_REVIEWS,
    reviews,
    spotId
});

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
        case CLEAR_REVIEWS: {
            return {};
        }
        default:
            return state;
    }
}

export default reviewsReducer;
