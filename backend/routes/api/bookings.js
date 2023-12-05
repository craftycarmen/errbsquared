const express = require('express');
const { Booking, Spot, Image } = require('../../db/models');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

const { requireAuth } = require('../../utils/auth');

const router = express.Router();

const validateBooking = [
    check('startDate')
        .exists({ checkFalsy: true })
        .custom(async (value, { req }) => {
            const date = new Date(value);
            const today = new Date();
            if (date < today) {
                throw new Error('startDate cannot be in the past')
            }
        }),
    check('endDate')
        .exists({ checkFalsy: true })
        .custom(async (value, { req }) => {
            const start = new Date(this.startDate)
            const end = new Date(value);
            if (end <= start) {
                throw new Error('endDate cannot be on or before startDate')
            }
        }),
    handleValidationErrors
];

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
});

router.put('/:bookingId', requireAuth, async (req, res) => {
    const bookingId = req.params.bookingId;
    const booking = await Booking.findByPk(bookingId);

    if (!booking) return res.status(404).json({ message: "Booking couldn't be found" });

    if (req.user.id !== booking.userId) return res.status(403).json({ message: 'Forbidden' });

    let requestedStartDate = new Date(req.body.startDate);
    let requestedEndDate = new Date(req.body.endDate);
    let today = new Date();

    const errObj = {};

    if (requestedStartDate < today) {
        errObj["startDate"] = "startDate cannot be in the past"
    }

    if (requestedEndDate <= requestedStartDate) {
        errObj["endDate"] = "endDate cannot come before startDate"
    }

    if (errObj.startDate || errObj.endDate) {
        res.status(400).json({
            message: 'Bad request',
            errors: errObj
        });
    }

    const existingBookings = await Booking.findAll({
        where: {
            spotId: booking.spotId
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

    booking.set({
        startDate: req.body.startDate,
        endDate: req.body.endDate
    });

    await booking.save();

    return res.json(booking);
});

router.delete('/:bookingId', requireAuth, async (req, res) => {
    const bookingId = req.params.bookingId;
    const booking = await Booking.findByPk(bookingId);

    if (!booking) return res.status(404).json({ message: "Booking couldn't be found" });

    if (req.user.id !== booking.userId) return res.status(403).json({ message: 'Forbidden' });
});

module.exports = router;
