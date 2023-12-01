const express = require('express');
const { Spot, Review, Image, User } = require('../../db/models');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

const { setTokenCookie, requireAuth } = require('../../utils/auth');

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

router.get('/', async (req, res) => {

    const spots = await Spot.findAll({
        include: [{
            model: Review
        }]
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

    return res.json({ Spots: spotsList })
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
        let getSpotById = {}
        let reviews = spot.Reviews
        let numReviews = reviews.length

        currSpot = spot.toJSON()

        let totalStars = reviews.reduce((sum, review) => (sum + review.stars), 0)
        avgStars = totalStars / reviews.length

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

        return res.json(getSpotById)
    } else {
        return res.status(404).json({
            message: "Spot couldn't be found"
        })
    }
});

router.post('/', requireAuth, validateSpot, async (req, res) => {
    try {
        const spot = await Spot.findByPk(req.user.id)
        const ownerId = spot.ownerId

        const { address, city, state, country, lat, lng, name, description, price } = req.body;

        const newSpot = await Spot.create({ ownerId, address, city, state, country, lat, lng, name, description, price })

        return res.status(201).json(newSpot)

    } catch (err) {
        return res.json(err.message)
    }
});

router.post('/:spotId/images', requireAuth, async (req, res) => {
    const spotId = req.params.spotId
    const spot = await Spot.findByPk(spotId)

    if (!spot) res.status(404).json({ message: "Spot couldn't be found" })

    if (req.user.id !== spot.ownerId) {
        return res.status(403).json({ message: 'Forbidden' })
    };

    const { url, preview } = req.body;

    const newImage = await Image.create({
        imageableId: spotId,
        imageableType: 'Spot',
        url: url,
        preview: preview
    });

    const image = {}

    image.id = newImage.id,
        image.url = newImage.url,
        image.preview = newImage.preview

    return res.json(image)
});

router.put('/:spotId', requireAuth, validateSpot, async (req, res) => {
    const spotId = req.params.spotId
    const spot = await Spot.findByPk(spotId)

    if (!spot) res.status(404).json({ message: "Spot couldn't be found" })

    if (req.user.id !== spot.ownerId) {
        return res.status(403).json({ message: 'Forbidden' })
    };

    spot.set(req.body);

    await spot.save();

    return res.json(spot)
});

router.delete('/:spotId', requireAuth, async (req, res) => {
    const spotId = req.params.spotId
    const spot = await Spot.findByPk(spotId)

    if (!spot) res.status(404).json({ message: "Spot couldn't be found" })

    if (req.user.id !== spot.ownerId) {
        return res.status(403).json({ message: 'Forbidden' })
    };

    await spot.destroy();

    return res.json({ message: "Successfully deleted" })
});

module.exports = router;
