import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchSpotDetails } from '../../store/spots';
// import { fetchSpotReviews } from '../../store/reviews';
import { useEffect } from 'react';
import SpotReviews from '../SpotReviews';
import './SpotDetails.css';

export default function SpotDetails() {
    const { spotId } = useParams();
    const dispatch = useDispatch();
    // const spot = useSelector(state =>
    //     state.spots ? state.spots[spotId] : null);

    // const spot = useSelector(state => state.spots.spotDetails)

    const spot = useSelector(state =>
        state.spots ? state.spots[spotId] : []);

    const sessionUser = useSelector((state) => state.session.user);

    // const reviews = Object.values(useSelector((state) => state.reviews))

    // useEffect(() => {
    //     dispatch(getAllSpots())
    //         .then(() => { dispatch(fetchSpotDetails(spotId)) })
    //         .then(() => {
    //             if (reviews.length) {
    //                 dispatch(fetchSpotReviews(spotId))
    //             }
    //         })

    // }, [dispatch, spotId, reviews.length]);

    useEffect(() => {
        dispatch(fetchSpotDetails(spotId))
        // .then(() => {
        //     if (reviews.length) dispatch(fetchSpotReviews(spotId))
        // })
    }, [dispatch, spotId])

    const spotPrice = (price) => {
        return price.toLocaleString('en-US', { maximumFractionDigits: 2 });
    }

    if (!spot) {
        return (<div className='spotContainer'>Loading... </div>)
    }
    return (spot && spot.SpotImages &&
        <>

            <section className='spotContainer'>

                <div className='header'>
                    <div className='spotName'>{spot.name}</div>
                    <div>{spot.city}, {spot.state}, {spot.country}</div>
                </div>
                <div className='gallery galleryContainer'>
                    {spot && spot.SpotImages ? spot.SpotImages.map(image => (
                        image.preview &&
                        <img
                            key={image.id}
                            src={image.url}
                        />
                    )

                    ) : <div>Loading...</div>}
                    {spot && spot.SpotImages && spot.SpotImages?.map(image => (
                        !image.preview &&
                        <img
                            key={image.id}
                            src={image.url}
                        />
                    ))}

                    {/* {spot && spot.SpotImages && spot.SpotImages.map(image => (
                        image.preview &&
                        <img
                            key={image.id}
                            src={image.url}
                        />
                    ))}
                    {spot && spot.SpotImages && spot.SpotImages.map(image => (
                        !image.preview &&
                        <img
                            key={image.id}
                            src={image.url}
                        />
                    ))} */}
                </div>
                <div className='details'>
                    <h2>Hosted by {spot.Owner?.firstName} {spot.Owner?.lastName}</h2>
                    <div>{spot.description}</div>
                </div>
                <div className='box'>

                    <div className='boxInfo'>
                        <div>
                            <span style={{ fontWeight: "600", fontSize: "24px" }}>${spot.price && spotPrice(spot.price)}</span> night
                        </div>

                        <div>
                            <span style={{ color: "#e2725a", textShadow: "1px 1px #f9ddd2" }}>&#9733;</span><span> {spot.avgStarRating}&nbsp;</span>
                            {spot.numReviews === 1 &&
                                <span className='numReviews'>
                                    · {spot.numReviews} review
                                </span>
                            }

                            {spot.numReviews > 1 &&
                                <span className='numReviews'>
                                    · {spot.numReviews} reviews
                                </span>
                            }
                        </div>
                    </div>

                    <button id='reserve' onClick={() => alert('Feature coming soon')}>Reserve</button>

                </div>
                <div className='reviews'>
                    <hr />
                    <h2 id='starReviews'>&#9733; {spot.avgStarRating}

                        {spot.numReviews === 1 &&
                            <>
                                <span>&nbsp; · &nbsp;{spot.numReviews} review</span>
                            </>
                        }

                        {spot.numReviews > 1 &&
                            <>
                                <span>&nbsp; · &nbsp;{spot.numReviews} reviews</span>
                            </>
                        }

                    </h2>

                    {sessionUser === null && spot.numReviews === 0 &&
                        <>
                        </>

                    }

                    {(sessionUser && spot.numReviews === 0 && sessionUser.id !== spot.ownerId) &&
                        <>
                            <p>Be the first to post a review!</p>
                        </>}

                    <SpotReviews spotId={spotId} sessionUser={sessionUser} spot={spot} />
                </div>

            </section >
        </>
    )

}
