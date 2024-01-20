import './CreateReviewModal.css';
import { useModal } from '../../context/Modal';
import { useDispatch, useSelector } from 'react-redux';
import { useState } from 'react';
import { createSpotReview } from '../../store/spots';
import { useParams } from 'react-router-dom';

export default function CreateReviewModal() {
    // const { spotId } = useParams()
    const { closeModal } = useModal();
    const dispatch = useDispatch();
    const [review, setReview] = useState('');
    const [stars, setStars] = useState(0);
    const [hover, setHover] = useState(0)
    const [errors, setErrors] = useState('');
    // let spot = useSelector(state => state.spots);
    // const updateReview = ;
    const updateStars = (e) => setStars(e.target.value);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors({});

        const reviewData = {
            review,
            stars
        }

        return dispatch(createSpotReview(id, reviewData))

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
                <button id='submit' type='submit'>Submit Your Review</button>
            </form>

        </section>
    )
}
