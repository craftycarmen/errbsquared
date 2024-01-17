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
                                <div className='spotInfo'>
                                    <span>{spot.city}, {spot.state}</span>
                                    <span><i className="fa-solid fa-star" /> {spot.avgRating}</span>
                                </div>

                                <span style={{ fontWeight: 'bold' }}>${spot.price}</span> night

                            </Link>
                        </div>
                    ))
                }
                <Tooltip id="spot-tooltip" />
            </div>
        </section >
    )
}
