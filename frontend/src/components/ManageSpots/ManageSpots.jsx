import { useDispatch, useSelector } from 'react-redux';
import { fetchOwnerSpots } from '../../store/spots';
import '../SpotsIndex/SpotsIndex.css';
import { useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function ManageSpots() {
    const dispatch = useDispatch();
    const sessionUser = useSelector((state) => state.session.user);
    const userId = sessionUser?.id;
    const spots = Object.values(useSelector(state => state.spots)).filter(spot => spot.ownerId === userId)

    useEffect(() => {
        dispatch(fetchOwnerSpots())
    }, [dispatch])

    const spotPrice = (price) => {
        return price.toLocaleString('en-US', { maximumFractionDigits: 2 });
    }

    return (sessionUser && spots &&
        <>
            <h1>Manage Your Spots</h1>
            <Link to='/spots/new'><button style={{ marginBottom: "10px" }}>Create a New Spot</button></Link>
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
                                <button>Delete</button>
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </>
    )
}
