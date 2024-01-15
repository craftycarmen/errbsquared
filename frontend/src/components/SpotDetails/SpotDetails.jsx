import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchSpotDetails } from '../../store/spots';
import { useEffect } from 'react';
import './SpotDetails.css';

export default function SpotDetails() {
    const { spotId } = useParams();
    const dispatch = useDispatch();
    const spot = useSelector(state => state.spots ? state.spots[spotId] : null);

    useEffect(() => {
        dispatch(fetchSpotDetails(spotId));
    }, [dispatch, spotId]);

    return (spot &&
        <section className='container'>
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
                <p><i className="fa-solid fa-star" /> {spot.avgStarRating} · {spot?.numReviews} reviews</p>
                <button onClick={() => alert('Feature coming soon')}>Reserve</button>
            </div>
            <div className='reviews'>
                <hr />
                <h3><i className="fa-solid fa-star" /> {spot.avgStarRating} · {spot.numReviews} reviews</h3>
            </div>
        </section>
    )
}
