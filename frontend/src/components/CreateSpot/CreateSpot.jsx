import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createSpot } from '../../store/spots';
import * as sessionActions from '../../store/session';
import './CreateSpot.css';

export default function CreateSpot() {
    const sessionUser = useSelector((state) => state.session.user);

    const dispatch = useDispatch();
    const [country, setCountry] = useState('');
    const [address, setAddress] = useState('');
    const [city, setCity] = useState('');
    const [state, setState] = useState('');
    const [lat, setLat] = useState('');
    const [lng, setLng] = useState('');
    const [description, setDescription] = useState('');
    const [name, setName] = useState('');
    const [price, setPrice] = useState('');
    const [previewImg, setPreviewImg] = useState('');
    const [img2, setImg2] = useState('');
    const [img3, setImg3] = useState('');
    const [img4, setImg4] = useState('');
    const [img5, setImg5] = useState('');
    const [errors, setErrors] = useState({});

    const updateCountry = (e) => setCountry(e.target.value);
    const updateAddress = (e) => setAddress(e.target.value);
    const updateCity = (e) => setCity(e.target.value);
    const updateState = (e) => setState(e.target.value);
    const updateLat = (e) => setLat(e.target.value);
    const updateLng = (e) => setLng(e.target.value);
    const updateDescription = (e) => setDescription(e.target.value);
    const updateName = (e) => setName(e.target.value);
    const updatePrice = (e) => setPrice(e.target.value);
    const updatePreviewImg = (e) => setPreviewImg(e.target.value);
    const updateImg2 = (e) => setImg2(e.target.value);
    const updateImg3 = (e) => setImg3(e.target.value);
    const updateImg4 = (e) => setImg4(e.target.value);
    const updateImg5 = (e) => setImg5(e.target.value);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors({});

        const payload = {
            country,
            address,
            city,
            state,
            lat,
            lng,
            description,
            name,
            price,
            previewImg,
            img2,
            img3,
            img4,
            img5
        };

        await dispatch(createSpot(payload));
    }

    return (
        <section className='createSpotForm'>
            <form onSubmit={handleSubmit}>
                <h1>Create a New Spot</h1>
                <h2>Where&apos;s your place located?</h2>
                <div>Guests will only get your exact address once they book a reservation.</div>
                <input
                    type='text'
                    placeholder='Country*'
                    required
                    value={country}
                    onChange={updateCountry}
                />
                <span>{errors.country && `${errors.country}`}</span>
                <input
                    type='text'
                    placeholder='Street Address*'
                    required
                    value={address}
                    onChange={updateAddress}
                />
                <input
                    type='text'
                    placeholder='City*'
                    required
                    value={city}
                    onChange={updateCity}
                />
                <input
                    type='text'
                    placeholder='State*'
                    required
                    value={state}
                    onChange={updateState}
                />
                <input
                    type='text'
                    placeholder='Latitude*'
                    required
                    value={lat}
                    onChange={updateLat}
                />
                <input
                    type='text'
                    placeholder='Longitude*'
                    required
                    value={lng}
                    onChange={updateLng}
                />
                <hr />
                <h2>Describe your place to guests</h2>
                <div>Mention the best features of your space, any special amentities, like fast WiFi or parking, and what you love about the neighborhood.</div>
                <input
                    type='text'
                    placeholder='Description (minimum 30 characters)*'
                    required
                    value={description}
                    onChange={updateDescription}
                />
                <hr />
                <h2>Create a title for your spot</h2>
                <div>Catch guests&apos; attention with a spot title that highlights what makes your place special.</div>
                <input
                    type='text'
                    placeholder='Name of your spot*'
                    required
                    value={name}
                    onChange={updateName}
                />
                <hr />
                <h2>Set a base price for your spot</h2>
                <div>Competitive pricing can help your listing stand out and rank higher in search results.</div>
                <div>$&nbsp;
                    <input
                        type='number'
                        placeholder='Price per night (USD)*'
                        required
                        value={price}
                        onChange={updatePrice}
                    />
                    <span>{errors.price && `${errors.price}`}</span>
                </div>
                <h2>Liven up your spot with photos</h2>
                <div>Submit a link to at least one photo to publish your spot.</div>
                <input
                    type='text'
                    placeholder='Preview Image URL*'
                    required
                    value={previewImg}
                    onChange={updatePreviewImg}
                />
                <input
                    type='text'
                    placeholder='Image URL'
                    value={img2}
                    onChange={updateImg2}
                />
                <input
                    type='text'
                    placeholder='Image URL'
                    value={img3}
                    onChange={updateImg3}
                />
                <input
                    type='text'
                    placeholder='Image URL'
                    value={img4}
                    onChange={updateImg4}
                />
                <input
                    type='text'
                    placeholder='Image URL'
                    value={img5}
                    onChange={updateImg5}
                />
                <hr />
                <button type='submit'>Create Spot</button>
            </form>
        </section>
    )
}
