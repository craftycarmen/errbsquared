const express = require('express');
const { Spot, Review, Image, User, Booking } = require('../../db/models');
const { Op } = require('sequelize');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const { requireAuth } = require('../../utils/auth');

const router = express.Router();

const validateSpot = [
    check('address')
        .exists({ checkFalsy: true })
        .withMessage('Street address is required'),
    check('city')
        .exists({ checkFalsy: true })
        .withMessage('City is required'),
    check('state')
        .exists({ checkFalsy: true })
        .withMessage('State is required'),
    check('country')
        .exists({ checkFalsy: true })
        .withMessage('Country is required'),
    check('lat')
        .exists({ checkFalsy: true })
        .isFloat({ min: -90, max: 90 })
        .withMessage('Latitude is not valid'),
    check('lng')
        .exists({ checkFalsy: true })
        .isFloat({ min: -180, max: 180 })
        .withMessage('Longitude is not valid'),
    check('name')
        .exists({ checkFalsy: true })
        .notEmpty()
        .withMessage('Name is required')
        .isLength({ max: 50 })
        .withMessage('Name must be less than 50 characters'),
    check('description')
        .exists({ checkFalsy: true })
        .withMessage('Description is required'),
    check('price')
        .exists({ checkFalsy: true })
        .withMessage('Price per day is required'),
    handleValidationErrors
];

const validateReview = [
    check('review')
        .exists({ checkFalsy: true })
        .withMessage('Review text is required'),
    check('stars')
        .exists({ checkFalsy: true })
        .isInt({ min: 1, max: 5 })
        .withMessage('Stars must be an integer from 1 to 5'),
    handleValidationErrors
];

// {
//     "message": "Bad Request", // (or "Validation error" if generated by Sequelize),
//     "errors": {
//       "page": "Page must be greater than or equal to 1",
//       "size": "Size must be greater than or equal to 1",
//       "maxLat": "Maximum latitude is invalid",
//       "minLat": "Minimum latitude is invalid",
//       "minLng": "Maximum longitude is invalid",
//       "maxLng": "Minimum longitude is invalid",
//       "minPrice": "Minimum price must be greater than or equal to 0",
//       "maxPrice": "Maximum price must be greater than or equal to 0"
//     }
//   }


router.get('/', async (req, res) => {
    let { page, size, maxLat, minLat, minLng, maxLng, minPrice, maxPrice } = req.query;
    let results = {}
    const errObj = {};

    page = +page
    size = +size
    maxLat = +maxLat
    minLat = +minLat
    maxLng = +maxLng
    minLng = +minLng
    maxPrice = +maxPrice
    minPrice = +minPrice

    let pagination = {}

    const spots = await Spot.findAll({
        include: [{
            model: Review
        }],
        ...pagination
    })

    let spotsList = [];

    spots.forEach(spot => {
        spotsList.push(spot.toJSON());
    });

    const images = await Image.unscoped().findAll({
        include: [Spot]
    })

    spotsList.forEach(spot => {
        spot.Reviews.forEach(review => {
            if (review.stars) {
                let totalStars = spot.Reviews.reduce((sum, review) => (sum + review.stars), 0)
                avgStars = totalStars / spot.Reviews.length
                spot.avgRating = avgStars;
            }
        });

        images.forEach(image => {
            if (image.preview === true) {
                if (image.imageableType === 'Spot' && image.imageableId === spot.id)
                    spot.previewImage = image.url
            } else {
                spot.previewImage = 'No preview image available'
            }
        });

        delete spot.Reviews;
    });

    if (maxLat > 90 || maxLat < minLat) errObj["maxLat"] = "Maximum latitude is invalid"
    if (minLat < -90 || minLat > maxLat) errObj["minLat"] = "Minimum latitude is invalid"

    if (maxLng > 180 || maxLng < minLng) errObj["maxLng"] = "Maximum longitude is invalid"
    if (minLng < -180 || minLng > maxLng) errObj["minLng"] = "Minimum longitude is invalid"

    const filteredList = spotsList.filter(function (spot) {

        if (minLat && maxLat && minLng && maxLat && minPrice && maxPrice) {
            if ((spot.lat > minLat) && (spot.lat < maxLat) && (spot.lng > minLng) && (spot.lng < maxLng) && (spot.price > minPrice) && (spot.price < maxPrice)) return spot

        } else if (!minLat) {
            if (spot.lat <= maxLat) return spot

        } else if (!maxLat) {
            if (spot.lat >= minLat) return spot

        } else if (minLat && maxLat) {
            if (spot.lat >= minLat && spot.lat <= maxLat) return spot

        } else if (!minLng) {
            if (spot.lng <= maxLng) return spot

        } else if (!maxLng) {
            if (spot.lng >= minLng) return spot

        } else if (minLng && maxLng) {
            if (spot.lng >= minLng && spot.lng <= maxLng) return spot
        }
    })

    if (Object.keys(errObj).length) {
        return res.status(400).json({
            message: "Bad request",
            errors: errObj
        })
    }

    if (filteredList.length > 0) {
        results.Spots = filteredList
    } else {
        results.Spots = spotsList
    }

    if (page || size) {
        if (page <= 0 || Number.isNaN(page)) errObj["page"] = "Page must be greater than or equal to 1"

        if (size <= 0 || Number.isNaN(size)) errObj["size"] = "Size must be greater than or equal to 1"

        if (page >= 1 && size >= 1) {
            pagination.limit = size;
            pagination.offset = size * (page - 1)
        }

        if (size > 20) size = 20
        if (page > 10) page = 10

        if (page) results.page = page;
        if (size) results.size = size;
    }

    return res.json(results);
});

router.get('/current', requireAuth, async (req, res) => {
    const { user } = req;

    if (user) {

        const spots = await Spot.findAll({
            include: [{
                model: Review
            }],
            where: {
                ownerId: user.id
            }
        })

        let spotsList = [];

        spots.forEach(spot => {
            spotsList.push(spot.toJSON());
        });

        const images = await Image.unscoped().findAll({
            include: [Spot]
        })

        spotsList.forEach(spot => {
            spot.Reviews.forEach(review => {
                if (review.stars) {
                    let totalStars = spot.Reviews.reduce((sum, review) => (sum + review.stars), 0)
                    avgStars = totalStars / spot.Reviews.length
                    spot.avgRating = avgStars;
                }
            });

            images.forEach(image => {
                if (image.preview === true) {
                    if (image.imageableType === 'Spot' && image.imageableId === spot.id)
                        spot.previewImage = image.url
                } else {
                    spot.previewImage = 'No preview image available'
                }
            });

            delete spot.Reviews;
        });

        return res.json({
            Spots: spotsList
        });
    }
});

router.get('/:spotId', async (req, res) => {

    const spot = await Spot.findByPk(req.params.spotId, {
        include: [
            {
                model: Review
            },
            {
                model: Image
            },
            {
                model: User,
                attributes: ['id', 'firstName', 'lastName']
            }
        ]
    })

    if (spot) {
        let getSpotById = {};
        let reviews = spot.Reviews;
        let numReviews = reviews.length;

        currSpot = spot.toJSON();

        let totalStars = reviews.reduce((sum, review) => (sum + review.stars), 0);
        avgStars = totalStars / reviews.length;

        getSpotById = {
            id: spot.id,
            ownerId: spot.ownerId,
            address: spot.address,
            city: spot.city,
            state: spot.state,
            country: spot.country,
            lat: spot.lat,
            lng: spot.lng,
            name: spot.name,
            description: spot.description,
            price: spot.price,
            createdAt: spot.createdAt,
            updatedAt: spot.updatedAt,
        }

        getSpotById.numReviews = numReviews;
        getSpotById.avgStarRating = avgStars;
        getSpotById.SpotImages = spot.Images;
        getSpotById.Owner = spot.User;

        return res.json(getSpotById);
    } else {
        return res.status(404).json({
            message: "Spot couldn't be found"
        });
    }
});

router.post('/', requireAuth, validateSpot, async (req, res) => {
    try {
        const spot = await Spot.findByPk(req.user.id)
        const ownerId = spot.ownerId

        const { address, city, state, country, lat, lng, name, description, price } = req.body;

        const newSpot = await Spot.create({ ownerId, address, city, state, country, lat, lng, name, description, price })

        return res.status(201).json(newSpot);

    } catch (err) {
        return res.json(err.message);
    }
});

router.post('/:spotId/images', requireAuth, async (req, res) => {
    const spotId = req.params.spotId;
    const spot = await Spot.findByPk(spotId);

    if (!spot) res.status(404).json({ message: "Spot couldn't be found" });

    if (req.user.id !== spot.ownerId) {
        return res.status(403).json({ message: 'Forbidden' });
    };

    const { url, preview } = req.body;

    const newImage = await Image.create({
        imageableId: spotId,
        imageableType: 'Spot',
        url: url,
        preview: preview
    });

    const image = {};

    image.id = newImage.id;
    image.url = newImage.url;
    image.preview = newImage.preview;

    return res.json(image);
});

router.put('/:spotId', requireAuth, validateSpot, async (req, res) => {
    const spotId = req.params.spotId;
    const spot = await Spot.findByPk(spotId);

    if (!spot) res.status(404).json({ message: "Spot couldn't be found" });

    if (req.user.id !== spot.ownerId) {
        return res.status(403).json({ message: 'Forbidden' })
    };

    const { address, city, state, country, lat, lng, name, description, price } = req.body;

    // spot.set(req.body);
    spot.set({
        address: address,
        city: city,
        state: state,
        country: country,
        lat: lat,
        lng: lng,
        name: name,
        description: description,
        price: price
    });

    await spot.save();

    return res.json(spot);
});

router.delete('/:spotId', requireAuth, async (req, res) => {
    const spotId = req.params.spotId;
    const spot = await Spot.findByPk(spotId);

    if (!spot) res.status(404).json({ message: "Spot couldn't be found" });

    if (req.user.id !== spot.ownerId) {
        return res.status(403).json({ message: 'Forbidden' })
    };

    await spot.destroy();

    return res.json({ message: "Successfully deleted" });
});

router.get('/:spotId/reviews', async (req, res) => {
    const spotId = req.params.spotId;
    const spot = await Spot.findByPk(spotId);

    if (!spot) res.status(404).json({ message: "Spot couldn't be found" });

    const reviews = await Review.findAll({
        where: {
            spotId: spotId
        },
        include: [
            {
                model: User,
                attributes: ['id', 'firstName', 'lastName']
            },
            {
                model: Image,
                as: 'ReviewImages',
                attributes: ['id', 'url']
            }
        ]
    });

    return res.json({ Reviews: reviews });

});

router.post('/:spotId/reviews', requireAuth, validateReview, async (req, res) => {
    try {
        const spotId = req.params.spotId;
        const userId = req.user.id;
        const spot = await Spot.findByPk(spotId);

        if (!spot) res.status(404).json({ message: "Spot couldn't be found" });

        const userReview = await Review.findAll({
            where: {
                userId: userId,
                spotId: spot.id
            }
        })

        if (userReview.length === 0) {
            const { review, stars } = req.body;

            const newReview = await Review.create({
                userId: userId,
                spotId: spotId,
                review: review,
                stars: stars
            })

            return res.status(201).json(newReview);
        } else {
            return res.status(500).json({ message: 'User already has a review for this spot' })
        }
    } catch (err) {
        return res.json(err.message);
    }
});

router.get('/:spotId/bookings', requireAuth, async (req, res) => {
    const spotId = req.params.spotId;
    const userId = req.user.id;
    const spot = await Spot.findByPk(spotId);

    if (!spot) res.status(404).json({ message: "Spot couldn't be found" });

    const bookings = await Booking.findAll({
        where: {
            spotId: spot.id
        },
        include: [
            {
                model: User
            }
        ]
    })

    let bookingsList = [];
    let userBookings = {};

    if (userId === spot.ownerId) {
        bookings.forEach(booking => {
            bookingsList.push(
                userBookings = {
                    User: {
                        id: booking.User.id,
                        firstName: booking.User.firstName,
                        lastName: booking.User.lastName
                    },
                    id: booking.id,
                    spotId: booking.spotId,
                    userId: booking.userId,
                    startDate: booking.startDate,
                    endDate: booking.endDate,
                    createdAt: booking.createdAt,
                    updatedAt: booking.updatedAt
                }
            )
            return res.json({ Bookings: bookingsList })
        })
    } else {
        bookings.forEach(booking => {
            bookingsList.push(
                userBookings = {
                    spotId: booking.spotId,
                    startDate: booking.startDate,
                    endDate: booking.endDate
                }
            )
        })
        return res.json({ Bookings: bookingsList })
    }
});

router.post('/:spotId/bookings', requireAuth, async (req, res) => {
    const spotId = req.params.spotId;
    const userId = req.user.id;
    const spot = await Spot.findByPk(spotId);

    if (!spot) res.status(404).json({ message: "Spot couldn't be found" });

    if (req.user.id === spot.ownerId) {
        return res.status(403).json({ message: 'Forbidden' });
    };

    let requestedStartDate = new Date(req.body.startDate);
    let requestedEndDate = new Date(req.body.endDate);
    let today = new Date();

    const errObj = {};

    if (requestedStartDate < today) {
        errObj["startDate"] = "startDate cannot be in the past"
    }

    if (requestedEndDate <= requestedStartDate) {
        errObj["endDate"] = "endDate cannot be on or before startDate"
    }

    if (errObj.startDate || errObj.endDate) {
        res.status(400).json({
            message: 'Bad request',
            errors: errObj
        });
    }

    const existingBookings = await Booking.findAll({
        where: {
            spotId: spotId
        }
    })

    existingBookings.forEach(booking => {

        let bookedStartDate = new Date(booking.startDate);
        let bookedEndDate = new Date(booking.endDate);

        if (requestedStartDate >= bookedStartDate && requestedStartDate <= bookedEndDate) {
            errObj["startDate"] = "Start date conflicts with an existing booking";
        }

        if (requestedEndDate >= bookedStartDate && requestedEndDate <= bookedEndDate) {
            errObj["endDate"] = "End date conflicts with an existing booking";

        }

        if (errObj.startDate || errObj.endDate) {
            res.status(403).json({
                message: 'Sorry, this spot is already booked for the specified dates',
                errors: errObj
            });
        }
    })

    const newBooking = await Booking.create({
        userId: userId,
        spotId: spotId,
        startDate: req.body.startDate,
        endDate: req.body.endDate
    })

    return res.json(newBooking)

});

module.exports = router;
