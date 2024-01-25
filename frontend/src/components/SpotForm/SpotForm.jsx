import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from "react";
import { updateSpot, createSpot, createSpotImage } from "../../store/spots";
import { useDispatch, useSelector } from 'react-redux';
import './SpotForm.css';

export default function SpotForm({ spot, img, formType }) {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const sessionUser = useSelector((state) => state.session.user);
    const spotId = spot.id;

    const [country, setCountry] = useState(spot?.country);
    const [address, setAddress] = useState(spot?.address);
    const [city, setCity] = useState(spot?.city);
    const [state, setState] = useState(spot?.state);
    const [lat, setLat] = useState(spot?.lat);
    const [lng, setLng] = useState(spot?.lng);
    const [description, setDescription] = useState(spot?.description);
    const [name, setName] = useState(spot?.name);
    const [price, setPrice] = useState(spot?.price);
    const [url, setUrl] = useState('');
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
    const updateUrl = (e) => setUrl(e.target.value);
    const updateImg2 = (e) => setImg2(e.target.value);
    const updateImg3 = (e) => setImg3(e.target.value);
    const updateImg4 = (e) => setImg4(e.target.value);
    const updateImg5 = (e) => setImg5(e.target.value);

    const createForm = formType === 'Create a New Spot';
    const updateForm = formType === 'Update Your Spot';

    useEffect(() => {
        const errs = {};

        if (!country) errs.country = 'Country is required';
        if (!address) errs.address = 'Address is required';
        if (!city) errs.city = 'City is required';
        if (!state) errs.state = 'State is required';
        if (!lat) errs.lat = 'Latitude is required';
        if (!lng) errs.lng = 'Longitude is required';
        if (!description) errs.description = 'Description is required';
        if (!name) errs.name = 'Name is required';
        if (!price) errs.price = 'Price is required';
        if (isNaN(lat) || lat > 90 || lat < -90) errs.lat = 'Latitude is not valid';
        if (isNaN(lng) || lng > 180 || lng < -180) errs.lng = 'Longitude is not valid';
        if (description && description.length < 30) errs.description = 'Description must be 30 characters at minimum';
        if (price <= 0) errs.price = 'Price per night must be greater than $0';

        if (createForm) {
            if (!url) errs.url = 'Preview image is required';

            const urlFormat = url.split('.').pop();
            const img2Format = img2.split('.').pop();
            const img3Format = img3.split('.').pop();
            const img4Format = img4.split('.').pop();
            const img5Format = img5.split('.').pop();

            if (url && (urlFormat !== 'jpg' && urlFormat !== 'jpeg' && urlFormat !== 'png')) errs.url = 'Image URL must end in .png, .jpg, or .jpeg';
            if (img2 && (img2Format !== 'jpg' && img2Format !== 'jpeg' && img2Format !== 'png')) errs.img2 = 'Image URL must end in .png, .jpg, or .jpeg';
            if (img3 && (img3Format !== 'jpg' && img3Format !== 'jpeg' && img3Format !== 'png')) errs.img3 = 'Image URL must end in .png, .jpg, or .jpeg';
            if (img4 && (img4Format !== 'jpg' && img4Format !== 'jpeg' && img4Format !== 'png')) errs.img4 = 'Image URL must end in .png, .jpg, or .jpeg';
            if (img5 && (img5Format !== 'jpg' && img5Format !== 'jpeg' && img5Format !== 'png')) errs.img5 = 'Image URL must end in .png, .jpg, or .jpeg';
        }
        setErrors(errs)
    }, [country, address, city, state, lat, lng, description, name, price, url, img2, img3, img4, img5, createForm])

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors({});

        spot = { ...spot, country, address, city, state, lat, lng, description, name, price, url, img2, img3, img4, img5 }

        img = { ...img, url, img2, img3, img4, img5 }

        const imageInfo = ({
            url,
            img2,
            img3,
            img4,
            img5
        })

        if (updateForm) {
            dispatch(updateSpot(spotId, spot))

                // .then((spot) => {
                //     let spotImage;
                //     images.forEach((image, index) => {
                //         if (index === 0) {
                //             spotImage = {
                //                 id: spot.id,
                //                 url: image,
                //                 preview: true
                //             }
                //         } else {
                //             spotImage = {
                //                 id: spot.id,
                //                 url: image,
                //                 preview: false
                //             }
                //         }
                //         dispatch(editSpotImage(spotId, spotImage))
                //     })

                // })
                .then(navigate(`/spots/${spot.id}`))
        } else if (createForm) {
            dispatch(createSpot(spot))
                .then((spot) => {
                    const images = Object.values(imageInfo).filter(img => img !== '');
                    let spotImage;
                    images.forEach((image, index) => {
                        if (index === 0) {
                            spotImage = {
                                id: spot.id,
                                url: image,
                                preview: true
                            }
                        } else {
                            spotImage = {
                                id: spot.id,
                                url: image,
                                preview: false
                            }
                        }
                        dispatch(createSpotImage(spot.id, spotImage))
                            .then(navigate(`/spots/${spot.id}`))
                    })

                })
        }

        if (spot.errors) {
            setErrors(spot.errors)
        } else {
            navigate(`/spots/${spot.id}`)
        }
    }

    return (sessionUser &&
        <section className='spotForm'>
            <form onSubmit={handleSubmit}>
                <h1>{formType}</h1>
                <h2>Where&apos;s your place located?</h2>
                <p>Guests will only get your exact address once they book a reservation.</p>
                <div className="inputContainer">
                    <input
                        type='text'
                        value={country}
                        onChange={updateCountry}
                        placeholder=""
                        id="country"
                    />
                    <label htmlFor="country" className="countryLabel floating-label">Country*</label>
                </div>
                <div className='countryError error'>{errors.country && `${errors.country}`}</div>
                <div className="inputContainer">
                    <input
                        type='text'
                        value={address}
                        onChange={updateAddress}
                        placeholder=""
                        id="streetaddress"
                    />
                    <label htmlFor="streetaddress" className="floating-label">Street Address*</label>
                </div>
                <div className='error'>{errors.address && `${errors.address}`}</div>
                <div className='cityState'>
                    <div id='city' className='inputContainer'>
                        <input
                            type='text'
                            value={city}
                            onChange={updateCity}
                            placeholder=""
                            id="city"
                        />
                        <label htmlFor="city" className="floating-label">City*</label>
                        &nbsp;,&nbsp;
                    </div>
                    <div className='error'>{errors.city && `${errors.city}`}</div>
                    <div id='state' className='inputContainer'>
                        <input
                            type='text'
                            value={state}
                            onChange={updateState}
                            placeholder=""
                            id="state"
                        />
                        <label htmlFor="state" className="floating-label">State*</label>
                    </div>
                    <div className='error'>{errors.state && `${errors.state}`}</div>
                </div>
                <div className='latLng'>
                    <div id='lat' className='inputContainer'>
                        <input
                            type='text'
                            value={lat}
                            onChange={updateLat}
                            placeholder=""
                            id="lat"
                        />
                        <label htmlFor="lat" className="floating-label">Latitude*</label>
                        &nbsp;,&nbsp;
                    </div>
                    <div className='error'>{errors.lat && `${errors.lat}`}</div>
                    <div id='lng' className='inputContainer'>
                        <input
                            type='text'
                            value={lng}
                            onChange={updateLng}
                            placeholder=""
                            id="lng"
                        />
                        <label htmlFor="lng" className="floating-label">Longitude*</label>
                    </div>
                    <div className='error'>{errors.lng && `${errors.lng}`}</div>
                </div>
                <hr />
                <h2>Describe your place to guests</h2>
                <p>Mention the best features of your space, any special amenities, like fast WiFi or parking, and what you love about the neighborhood.</p>
                <div className="inputContainer">
                    <textarea
                        type='text'
                        value={description}
                        onChange={updateDescription}
                        placeholder=""
                        id="description"
                    />
                    <label htmlFor="description" className="floating-label">Please write at least 30 characters*</label>
                    <div className='error'>{errors.description && `${errors.description}`}</div>
                </div>
                {errors.description ? <hr className="errorHr" /> : <hr className="extraMarginHr" />}

                <h2>Create a title for your spot</h2>
                <p>Catch guests&apos; attention with a spot title that highlights what makes your place special.</p>
                <div className="inputContainer">
                    <input
                        type='text'
                        value={name}
                        onChange={updateName}
                        placeholder=""
                        id="name"
                    />
                    <label htmlFor="name" className="floating-label">Name of Your Spot*</label>
                    <div className='error'>{errors.name && `${errors.name}`}</div>
                    {errors.name ? <hr className="errorHr" /> : <hr className="extraMarginHr" />}
                </div>
                <h2>Set a base price for your spot</h2>
                <p>Competitive pricing can help your listing stand out and rank higher in search results.</p>
                <div className='price inputContainer'>$&nbsp;
                    <input
                        type='number'
                        value={price}
                        onChange={updatePrice}
                        placeholder=""
                        id="price"
                    />
                    <label htmlFor="price" className="floating-label">Price Per Night (USD)*</label>
                </div>
                <div className='priceError error'>{errors.price && `${errors.price}`}</div>
                {errors.price ? <hr className="errorHr" /> : <hr className="extraMarginHrPrice" />}
                {createForm &&
                    <>
                        <h2>Liven up your spot with photos</h2>
                        <p>Submit a link to at least one photo to publish your spot.</p>
                        <div className="previewImageContainer inputContainer">
                            <input
                                type='text'
                                value={url}
                                onChange={updateUrl}
                                placeholder=""
                                id="url"
                            />
                            <label htmlFor="url" className="floating-label">Preview Image URL*</label>
                            <div className='imageError error'>{errors.url && `${errors.url}`}</div>
                        </div>
                        <div className="imageContainer inputContainer">
                            <input
                                type='text'
                                value={img2}
                                onChange={updateImg2}
                                placeholder=""
                                id="img2"
                            />
                            <label htmlFor="img2" className="floating-label">Image URL</label>
                            <div className='imageError error'>{errors.img2 && `${errors.img2}`}</div>
                        </div>
                        <div className="imageContainer inputContainer">
                            <input
                                type='text'
                                value={img3}
                                onChange={updateImg3}
                                placeholder=""
                                id="img3"
                            />
                            <label htmlFor="img3" className="floating-label">Image URL</label>
                            <div className='imageError error'>{errors.img3 && `${errors.img3}`}</div>
                        </div>
                        <div className="imageContainer inputContainer">
                            <input
                                type='text'
                                value={img4}
                                onChange={updateImg4}
                                placeholder=""
                                id="img4"
                            />
                            <label htmlFor="img4" className="floating-label">Image URL</label>
                            <div className='imageError error'>{errors.img4 && `${errors.img4}`}</div>
                        </div>
                        <div className="imageContainer inputContainer">
                            <input
                                type='text'
                                value={img5}
                                onChange={updateImg5}
                                placeholder=""
                                id="img5"
                            />
                            <label htmlFor="img5" className="floating-label">Image URL</label>
                            <div className='imageError error'>{errors.img5 && `${errors.img5}`}</div>
                        </div>
                        {errors.img5 ? <hr className="errorHr" /> : <hr className="extraMarginHrImg5" />}
                    </>
                }
                <div id='submit'>
                    <button
                        style={{ marginTop: "15px" }}
                        type='submit'
                        disabled={!!Object.values(errors).length}>{formType}</button>
                </div>

            </form>
        </section >
    )
}
