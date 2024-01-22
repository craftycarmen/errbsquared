import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { clearReviews, fetchSpotReviews } from '../../store/reviews';
import CreateReviewButton from '../CreateReviewModal/CreateReviewButton';

export default function SpotReviews({ spotId, sessionUser, spot }) {
    const dispatch = useDispatch();
    const reviews = Object.values(useSelector(state => state.reviews)).sort((a, b) => {
        if (a.createdAt > b.createdAt) return -1;
        if (a.createdAt < b.createdAt) return 1;
        return 0;
    });

    const userId = sessionUser?.id;

    const userReviewed = reviews.filter(review => {
        if (review.userId === userId) return true;
    })

    useEffect(() => {
        dispatch(fetchSpotReviews(spotId));

        return () => {
            dispatch(clearReviews());
        }
    }, [dispatch, spotId])

    const reviewDate = (date) => {
        const newDate = new Date(date)
        return newDate.toLocaleString('default', { month: 'long', year: 'numeric' })
    }

    return (reviews &&
        <section>
            {sessionUser && userReviewed.length === 0 && spot.ownerId !== userId &&
                <>
                    <CreateReviewButton spotId={spotId} />
                </>
            }

            {reviews.map((review) => (
                <div key={review.id} className='reviews'>
                    <div style={{ fontWeight: '600' }}>{sessionUser?.id === review.User?.id ? sessionUser.firstName : (review.User?.firstName)}</div>
                    <p style={{ color: 'gray' }}>{review.createdAt &&
                        reviewDate(review.createdAt)
                    }
                    </p>
                    <p>{review.review}</p>
                    {review.userId === userId &&
                        <>
                            <button>Delete</button>
                        </>
                    }
                    <br />
                </div>
            ))
            }
        </section>

    )
}
