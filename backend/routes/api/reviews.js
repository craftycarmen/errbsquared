const express = require('express');
const { Review, User, Spot, Image } = require('../../db/models');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

const { requireAuth } = require('../../utils/auth');

const router = express.Router();

router.get('/current', requireAuth, async (req, res) => {
    const { user } = req;

    if (user) {
        const reviews = await Review.findAll({
            where: {
                userId: user.id
            },
            include: [
                {
                    model: User,
                    attributes: ['id', 'firstName', 'lastName']
                },
                {
                    model: Spot,
                    attributes: {
                        exclude: ['createdAt', 'updatedAt']
                    }
                },
                {
                    model: Image,
                    as: 'ReviewImages',
                    attributes: ['id', 'url']
                }
            ],

        })

        // let reviewsList = [];

        // reviews.forEach(review => {
        //     reviewsList.push(review.toJSON());
        // })

        // const images = await Image.unscoped().findAll({
        //     include: [Review]
        // })

        // let reviewImages = {}

        // reviewsList.forEach(review => {
        //     images.forEach(image => {

        //         if (image.imageableType === 'Review' && image.imageableId === review.id) {
        //             review.previewImage = image.url
        //             review.imageId = image.id
        //         }
        //         reviewImages.id = image.id;
        //         reviewImages.url = image.url
        //     });
        // })


        return res.json(reviews)
    };
})

module.exports = router;
