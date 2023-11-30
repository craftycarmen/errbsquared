const express = require('express');
const { Spot, Review, Image } = require('../../db/models');
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
            if (image.imageableType === 'Spot' && image.imageableId === spot.id && image.previewImage === true) {
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
                if (image.imageableType === 'Spot' && image.imageableId === spot.id && image.previewImage === true) {
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
})

module.exports = router;
