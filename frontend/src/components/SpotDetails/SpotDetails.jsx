import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchSpotDetails } from '../../store/spots';
import { useEffect } from 'react';
import './SpotDetails.css';
import SpotReviews from '../SpotReviews';

export default function SpotDetails() {
    const { spotId } = useParams();
    const dispatch = useDispatch();
    const spot = useSelector(state =>
        state.spots ? state.spots[spotId] : null);

    useEffect(() => {
        dispatch(fetchSpotDetails(spotId));
    }, [dispatch, spotId]);

    return (spot &&
        <section className='spotContainer'>
            <div className='header'>
                <h1>{spot.name}</h1>
                <div>{spot.city}, {spot.state}, {spot.country}</div>
            </div>
            <div className='gallery galleryContainer'>
                {spot.SpotImages?.map(image => (
                    <img
                        key={image.id}
                        src={image.url}
                    />
                ))}
            </div>
            <div className='details'>
                <h2>Hosted by {spot.Owner?.firstName} {spot.Owner?.lastName}</h2>
                <div>{spot.description}</div>
            </div>
            <div className='box'>

                <div>${spot.price} / night</div>

                <div><i className="fa-solid fa-star" /> {spot.avgStarRating}

                    {spot.numReviews === 1 &&
                        <>
                            <span> · {spot.numReviews} review</span>
                        </>
                    }

                    {spot.numReviews > 1 &&
                        <>
                            <span> · {spot.numReviews} reviews</span>
                        </>
                    }

                </div>

                <button id='reserve' onClick={() => alert('Feature coming soon')}>Reserve</button>

            </div>
            <div className='reviews'>
                <SpotReviews />
            </div>
        </section >
    )
}
