import { useDispatch, useSelector } from 'react-redux';
import './SpotsIndex.css';
import { getAllSpots, spotsArr } from '../../store/spots';
import { useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function SpotsIndex() {
    const dispatch = useDispatch();
    const allSpots = useSelector(spotsArr);
    console.log(allSpots);

    useEffect(() => {
        dispatch(getAllSpots())
    }, [dispatch])

    return (
        <section>
            <h1>Spots</h1>
            <div className='gallery'>
                {
                    allSpots.map((spot) => (
                        <div key={spot.id} className='spotCard'>
                            <Link to={`spot/${spot.id}`}>
                                <img
                                    title={spot.name}
                                    src={spot.previewImage}
                                />
                                <p>{spot.city}, {spot.state}</p>
                                <p>${spot.price} / night</p>
                                <p><i className="fa-solid fa-star" /> {spot.avgRating}</p>
                            </Link>
                        </div>
                    ))
                }
            </div>
        </section >
    )
}
