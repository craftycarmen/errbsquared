import { useDispatch, useSelector } from 'react-redux';
import { fetchOwnerSpots } from '../../store/spots';
import '../SpotsIndex/SpotsIndex.css';
import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import DeleteSpotModalButton from '../DeleteSpotModal/DeleteSpotModalButton';

export default function ManageSpots() {
    const dispatch = useDispatch();
    const sessionUser = useSelector((state) => state.session.user);
    const userId = sessionUser?.id;
    const spots = Object.values(useSelector(state => state.spots)).filter(spot => spot.ownerId === userId)

    useEffect(() => {
        dispatch(fetchOwnerSpots(userId))
    }, [dispatch, userId])

    const spotPrice = (price) => {
        return price.toLocaleString('en-US', { maximumFractionDigits: 2 });
    }

    return (sessionUser &&
        <>
            <h1 style={{ marginLeft: "20px" }}>Manage Your Spots</h1>
            {spots.length === 0 &&
                <Link to='/spots/new'><button style={{ marginBottom: "30px", marginLeft: "20px" }}>Create a New Spot</button></Link>
            }
            {spots &&
                <div className='container'>
                    {spots.map(spot => (
                        <div key={spot.id} className='spotCard'>
                            <div>
                                <Link to={`/spots/${spot.id}`}>
                                    <span className='toolTip'>{spot.name}</span>
                                    <img
                                        className='spotImage'
                                        src={spot.previewImage}
                                    />
                                    <div className='spotInfo'>
                                        <span>{spot.city}, {spot.state}</span>
                                        <span>&#9733; {spot.avgRating}</span>
                                    </div>

                                    <span style={{ fontWeight: '800' }}>${spot.price && spotPrice(spot.price)}</span> night
                                </Link>
                                <p className='buttonBlock'>
                                    <Link to={`/spots/${spot.id}/edit`}><button style={{ marginRight: "10px" }}>Update</button></Link>
                                    <DeleteSpotModalButton spotId={spot.id} />
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            }
        </>
    )
}
