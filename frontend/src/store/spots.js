import { createSelector } from 'reselect';

export const LOAD_SPOTS = '/spots/LOAD_SPOTS';

export const loadSpots = (spots) => ({
    type: LOAD_SPOTS,
    spots
});

export const getAllSpots = () => async dispatch => {
    const res = await fetch('/api/spots');

    if (res.ok) {
        const data = await res.json();
        dispatch(loadSpots(data));
    }
};

const selectedSpots = state => state.spots;

export const spotsArr = createSelector(selectedSpots, spots => Object.values(spots));

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
        default:
            return state;
    }
}

export default spotsReducer;
