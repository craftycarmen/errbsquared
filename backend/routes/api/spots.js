const express = require('express');
const { Spot, Review, Image } = require('../../db/models');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

const router = express.Router();

router.get('/', async (req, res) => {

    const spots = await Spot.findAll({
        include: [{
            model: Review
        },
        {
            model: Image
        }]
    })


    let spotsList = [];

    spots.forEach(spot => {
        spotsList.push(spot.toJSON());
    });

    spotsList.forEach(spot => {
        spot.Reviews.forEach(review => {
            if (review.stars) {
                let totalStars = spot.Reviews.reduce((sum, review) => (sum + review.stars), 0)
                avgStars = totalStars / spot.Reviews.length
                spot.avgRating = avgStars;
            }
        });
        delete spot.Reviews;
    });

    const images = await Image.findAll({
        include: [Spot]
    })

    spotsList.forEach(spot => {
        images.forEach(image => {
            console.log("hi", image);
            if (image.previewImage === true) {
                spot.previewImage = image.url
            }
        });

        delete spot.Images;
    });



    return res.json({ Spots: spotsList })
})

module.exports = router;
