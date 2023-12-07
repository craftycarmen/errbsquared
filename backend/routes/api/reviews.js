const express = require('express');
const { Review, User, Spot, Image } = require('../../db/models');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

const { requireAuth } = require('../../utils/auth');

const router = express.Router();

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

        return res.json(reviews);
    };
});

router.post('/:reviewId/images', requireAuth, async (req, res) => {
    const reviewId = Number(req.params.reviewId);
    const review = await Review.findByPk(reviewId);

    if (!review) res.status(404).json({ message: "Review couldn't be found" });

    if (req.user.id !== review.userId) {
        return res.status(403).json({ message: 'Forbidden' });
    };

    const { url } = req.body;

    const images = await Image.findAll({
        where: {
            imageableId: reviewId,
            imageableType: 'Review'
        }
    })

    if (images.length < 10) {
        const newImage = await Image.create({
            imageableId: reviewId,
            imageableType: 'Review',
            url: url
        });

        const image = {};

        image.id = newImage.id;
        image.url = newImage.url;

        return res.json(image)
    } else {
        return res.status(403).json({ message: 'Maximum number of images for this resource was reached' });
    }
});

router.put('/:reviewId', requireAuth, validateReview, async (req, res) => {
    const reviewId = Number(req.params.reviewId);
    const review = await Review.findByPk(reviewId);

    if (!review) res.status(404).json({ message: "Review couldn't be found" });

    if (req.user.id !== review.userId) {
        return res.status(403).json({ message: 'Forbidden' });
    };

    review.set({
        review: req.body.review,
        stars: req.body.stars
    });

    await review.save();

    return res.json(review);
});

router.delete('/:reviewId', requireAuth, async (req, res) => {
    const reviewId = Number(req.params.reviewId);
    const review = await Review.findByPk(reviewId);

    if (!review) res.status(404).json({ message: "Review couldn't be found" });

    if (req.user.id !== review.userId) {
        return res.status(403).json({ message: 'Forbidden' });
    };

    await review.destroy();

    return res.json({ message: "Successfully deleted" });
});


module.exports = router;
