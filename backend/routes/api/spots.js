const express = require('express');
const { Spot, Review, Image, User } = require('../../db/models');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

const { setTokenCookie, requireAuth } = require('../../utils/auth');

const router = express.Router();

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

    const images = await Image.findAll({
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
            if (image.imageableType === 'Spot' && image.imageableId === spot.id && image.preview === true) {
                spot.previewImage = image.url
            }
        });

        delete spot.Images;
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

        const images = await Image.findAll({
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
                if (image.imageableType === 'Spot' && image.imageableId === spot.id && image.preview === true) {
                    spot.previewImage = image.url
                }
            });

            delete spot.Images;
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
                model: Image,
                as: 'SpotImages'
            },
            {
                model: User,
                as: 'Owner',
                attributes: ['id', 'firstName', 'lastName']
            }
        ]
    })

    if (spot) {
        let reviews = spot.Reviews
        let numReviews = reviews.length

        currSpot = spot.toJSON()
        currSpot.numReviews = numReviews

        let totalStars = reviews.reduce((sum, review) => (sum + review.stars), 0)
        avgStars = totalStars / reviews.length
        currSpot.avgStarRating = avgStars;

        delete currSpot.Reviews;
        return res.json(currSpot)
    } else {
        return res.status(404).json({
            message: "Spot couldn't be found"
        })
    }
});

router.post('/', requireAuth, async (req, res) => {
    try {
        const owner = await Spot.findByPk(req.user.id)
        const ownerId = owner.ownerId

        const { address, city, state, country, lat, lng, name, description, price } = req.body;

        const newSpot = await Spot.create({ ownerId, address, city, state, country, lat, lng, name, description, price })

        return res.status(201).json(newSpot)

    } catch (err) {
        return res.json(err.message)
    }
})

module.exports = router;
