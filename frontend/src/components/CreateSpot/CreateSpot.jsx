import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { createSpot, createSpotImage } from '../../store/spots';
import './CreateSpot.css';

export default function CreateSpot() {
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
    const [url, setUrl] = useState('');
    // const [img2, setImg2] = useState('');
    // const [img3, setImg3] = useState('');
    // const [img4, setImg4] = useState('');
    // const [img5, setImg5] = useState('');
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
    const updateUrl = (e) => setUrl(e.target.value);
    // const updateImg2 = (e) => setImg2(e.target.value);
    // const updateImg3 = (e) => setImg3(e.target.value);
    // const updateImg4 = (e) => setImg4(e.target.value);
    // const updateImg5 = (e) => setImg5(e.target.value);

    const reset = () => {
        setCountry('');
        setAddress('');
        setCity('');
        setState('')
        setLat('');
        setLng('');
        setDescription('');
        setName('');
        setPrice('');
        setUrl('');
        // setImg2('');
        // setImg3('');
        // setImg4('');
        // setImg5('');
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors({});

        const spotInfo = {
            country,
            address,
            city,
            state,
            lat,
            lng,
            description,
            name,
            price
        };

        const imageInfo = {
            url
        }

        return dispatch(createSpot(spotInfo))
            .then((spot) => {
                return dispatch(createSpotImage(spot.id, imageInfo))
            })
            .then(reset())
            .catch(async (res) => {
                const data = await res.json()
                if (data && data.errors) {
                    setErrors(data.errors)
                }
            })
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

                    value={country}
                    onChange={updateCountry}
                />
                <div className='error'>{errors.country && `${errors.country}`}</div>
                <input
                    type='text'
                    placeholder='Street Address*'
                    required
                    value={address}
                    onChange={updateAddress}
                />
                <div className='error'>{errors.address && `${errors.address}`}</div>
                <div className='cityStateLatLng'>
                    <input
                        type='text'
                        placeholder='City*'
                        required
                        value={city}
                        onChange={updateCity}
                    />
                    <div className='error'>{errors.city && `${errors.city}`}</div>
                    <span>, </span>
                    <input
                        type='text'
                        placeholder='State*'
                        required
                        value={state}
                        onChange={updateState}
                    />
                    <div className='error'>{errors.state && `${errors.state}`}</div>
                    <input
                        type='text'
                        placeholder='Latitude*'
                        required
                        value={lat}
                        onChange={updateLat}
                    />
                    <div className='error'>{errors.lat && `${errors.lat}`}</div>
                    <input
                        type='text'
                        placeholder='Longitude*'
                        required
                        value={lng}
                        onChange={updateLng}
                    />
                </div>
                <div className='error'>{errors.lng && `${errors.lng}`}</div>
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
                <div className='error'>{errors.description && `${errors.description}`}</div>
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
                <div className='error'>{errors.name && `${errors.name}`}</div>
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
                    <div className='error'>{errors.price && `${errors.price}`}</div>
                </div>
                <h2>Liven up your spot with photos</h2>
                <div>Submit a link to at least one photo to publish your spot.</div>
                <input
                    type='text'
                    placeholder='Preview Image URL*'
                    required
                    value={url}
                    onChange={updateUrl}
                />
                {/* <input
                    type='text'
                    placeholder='Image URL'
                    value={img2}
                    onChange={updateImg2}
                />
                <div className='error'>{errors.country && `${errors.country}`}</div>
                <input
                    type='text'
                    placeholder='Image URL'
                    value={img3}
                    onChange={updateImg3}
                />
                <div className='error'>{errors.country && `${errors.country}`}</div>
                <input
                    type='text'
                    placeholder='Image URL'
                    value={img4}
                    onChange={updateImg4}
                />
                <div className='error'>{errors.country && `${errors.country}`}</div>
                <input
                    type='text'
                    placeholder='Image URL'
                    value={img5}
                    onChange={updateImg5}
                />
                <div className='error'>{errors.country && `${errors.country}`}</div> */}
                <hr />
                <button type='submit'>Create Spot</button>
            </form>
        </section>
    )
}
