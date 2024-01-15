import { useDispatch, useSelector } from 'react-redux';
import './SpotsIndex.css';
import { getAllSpots, spotsArr } from '../../store/spots';
import { useEffect } from 'react';
import { Link } from 'react-router-dom';

import { Tooltip } from 'react-tooltip';

export default function SpotsIndex() {
    const dispatch = useDispatch();
    const allSpots = useSelector(spotsArr);

    useEffect(() => {
        dispatch(getAllSpots())
    }, [dispatch])

    return (
        <section>
            <div className='container'>
                {
                    allSpots.map((spot) => (
                        <div key={spot.id} className='spotCard'>
                            <Link to={`spots/${spot.id}`} data-tooltip-id='spot-tooltip' data-tooltip-content={spot.name}>
                                <img
                                    className='spotImage'
                                    src={spot.previewImage}
                                />
                                <p>{spot.city}, {spot.state}</p>
                                <p>${spot.price} / night</p>

                                <p><i className="fa-solid fa-star" /> {spot.avgRating}</p>

                            </Link>
                        </div>
                    ))
                }
                <Tooltip id="spot-tooltip" />
            </div>
        </section >
    )
}
