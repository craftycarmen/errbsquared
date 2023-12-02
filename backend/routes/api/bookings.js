const express = require('express');
const { Booking, Spot, Image } = require('../../db/models');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

const { requireAuth } = require('../../utils/auth');

const router = express.Router();

router.get('/', async (req, res) => {
    return res.json({
        message: 'success'
    })
})

router.get('/current', requireAuth, async (req, res) => {
    const { user } = req;

    if (user) {
        const bookings = await Booking.findAll({
            where: {
                userId: user.id
            },
            include: [
                {
                    model: Spot
                }
            ]
        })

        let bookingsList = [];
        let userBookings = {};

        const images = await Image.unscoped().findAll({
            include: [Spot]
        })

        bookings.forEach(booking => {
            bookingsList.push(
                userBookings = {
                    id: booking.id,
                    spotId: booking.spotId,
                    Spot: {
                        id: booking.Spot.id,
                        ownerId: booking.Spot.ownerId,
                        address: booking.Spot.address,
                        city: booking.Spot.city,
                        state: booking.Spot.state,
                        country: booking.Spot.country,
                        lat: booking.Spot.lat,
                        lng: booking.Spot.lng,
                        name: booking.Spot.name,
                        description: booking.Spot.description,
                        price: booking.Spot.price,
                    },
                    userId: booking.userId,
                    startDate: booking.startDate,
                    endDate: booking.endDate,
                    createdAt: booking.createdAt,
                    updatedAt: booking.updatedAt
                })

            images.forEach(image => {
                if (image.imageableType === 'Spot' && image.imageableId === booking.spotId) {
                    userBookings.Spot.previewImage = image.url
                } else {
                    userBookings.Spot.previewImage = 'No images available'
                }
            })
        });

        return res.json({ Bookings: bookingsList })
    };

})

module.exports = router;
