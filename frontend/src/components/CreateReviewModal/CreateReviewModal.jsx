import './CreateReviewModal.css';
import { useModal } from '../../context/Modal';
import { useDispatch } from 'react-redux';
import { useEffect, useState } from 'react';
import { addReview } from '../../store/reviews';

export default function CreateReviewModal({ spotId }) {
    const { closeModal } = useModal();
    const dispatch = useDispatch();
    const [review, setReview] = useState('');
    const [stars, setStars] = useState(0);
    const [hover, setHover] = useState(0)
    const [errors, setErrors] = useState('');

    useEffect(() => {
        const errs = {};

        if (review.length < 10) errs.review = 'Review must be 10 characters at minimum';
        if (stars === 0) errs.stars = 'Star rating must be between 1 and 5';

        setErrors(errs)
    }, [review, stars])

    const handleSubmit = (e) => {
        e.preventDefault();
        setErrors({});

        const reviewData = {
            review,
            stars
        }

        return dispatch(addReview(spotId, reviewData))
            .then(closeModal)
            .catch(async (res) => {
                const data = await res.json()
                if (data && data.errors) {
                    setErrors(data.errors)
                }
            })
    }

    return (
        <section className='reviewModal'>
            <form onSubmit={handleSubmit}>
                <h1>How was your stay?</h1>
                <p className="error">
                    {errors.reviewed && `${errors.reviewed}`}
                </p>
                <textarea
                    type='text'
                    placeholder='Leave your review here...'
                    value={review}
                    onChange={(e) => setReview(e.target.value)}
                />
                <div className='error'>{errors.review && `${errors.review}`}</div>
                <div className='stars'>
                    {[...Array(5)].map((star, index) => {
                        index += 1;
                        return (
                            <button
                                type='button'
                                key={index}
                                className={index <= (hover || stars) ? "on" : "off"}
                                onClick={() => setStars(index)}
                                onMouseEnter={() => setHover(index)}
                                onMouseLeave={() => setHover(stars)}
                                onDoubleClick={() => {
                                    setStars(0);
                                    setHover(0);
                                }}
                            >
                                <span className='star'>&#9733;</span>
                            </button>
                        )
                    })}
                </div>
                <button
                    id='submit'
                    disabled={Object.values(errors).length}
                    type='submit'>Submit Your Review</button>
            </form>

        </section>
    )
}
