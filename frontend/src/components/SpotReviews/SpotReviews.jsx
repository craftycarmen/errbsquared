import { useParams } from 'react-router-dom';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { clearReviews, fetchSpotReviews } from '../../store/reviews';

export default function SpotReviews() {
    const { spotId } = useParams();
    const dispatch = useDispatch();
    const reviews = Object.values(useSelector(state => state.reviews)).sort((a, b) => {
        if (a.createdAt > b.createdAt) return -1;
        if (a.createdAt < b.createdAt) return 1;
        return 0;
    });

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
            {reviews.map((review) => (
                <div key={review.id} className='reviews'>
                    <p style={{ fontWeight: '600' }}>{review.User?.firstName}</p>
                    <p style={{ color: 'gray' }}>{review.createdAt &&
                        reviewDate(review.createdAt)
                    }
                    </p>
                    <p>{review.review}</p>
                    <br />
                </div>
            ))
            }
        </section>

    )
}
