import { createSelector } from 'reselect';
import { csrfFetch } from './csrf';

export const LOAD_SPOTS = '/spots/LOAD_SPOTS';
export const LOAD_SPOT_DETAILS = '/spots/LOAD_SPOT_DETAILS';
export const CREATE_SPOT = '/spots/CREATE_SPOT';

export const loadSpots = (spots) => ({
    type: LOAD_SPOTS,
    spots
});

export const loadSpotDetails = (spot, spotId) => ({
    type: LOAD_SPOT_DETAILS,
    spot,
    spotId
});

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
        dispatch(loadSpotDetails(data, spotId));
    }
};

export const createSpot = (spot) => async dispatch => {
    const res = await csrfFetch('/api/spots', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(spot)
    });

    if (res.ok) {
        const data = await res.json();
        console.log(data);
        dispatch(loadSpotDetails(data))
    }
}

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

        case LOAD_SPOT_DETAILS:
            return { ...state, [action.spot.id]: action.spot };

        default:
            return state;
    }
}

export default spotsReducer;
