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
            const start = new Date(req.body.startDate)
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
                        lat: Number.parseFloat(booking.Spot.lat),
                        lng: Number.parseFloat(booking.Spot.lng),
                        name: booking.Spot.name,
                        description: booking.Spot.description,
                        price: Number.parseFloat(booking.Spot.price),
                    },
                    userId: booking.userId,
                    startDate: booking.startDate,
                    endDate: booking.endDate,
                    createdAt: booking.createdAt,
                    updatedAt: booking.updatedAt
                })

            images.forEach(image => {
                if (image.preview === true) {
                    if (image.imageableType === 'Spot' && image.imageableId === booking.spotId) {
                        userBookings.Spot.previewImage = image.url
                    }
                } else {
                    userBookings.Spot.previewImage = 'No images available'
                }
            })
        });

        return res.json({ Bookings: bookingsList })
    };
});

router.put('/:bookingId', requireAuth, validateBooking, async (req, res, next) => {
    const bookingId = Number(req.params.bookingId);
    const booking = await Booking.findByPk(bookingId);

    if (!booking) return res.status(404).json({ message: "Booking couldn't be found" });

    if (req.user.id !== booking.userId) return res.status(403).json({ message: 'Forbidden' });

    let requestedStartDate = new Date(req.body.startDate);
    let requestedEndDate = new Date(req.body.endDate);

    const errors = [];
    const err = new Error

    const existingBookings = await Booking.findAll({
        where: {
            spotId: booking.spotId
        }
    })

    existingBookings.forEach(booking => {

        let bookedStartDate = new Date(booking.startDate);
        let bookedEndDate = new Date(booking.endDate);

        if (booking.id !== bookingId) {

            if ((requestedStartDate < bookedStartDate && requestedEndDate > bookedEndDate) || (requestedStartDate >= bookedStartDate && requestedEndDate <= bookedEndDate)) {
                err.message = "Sorry, this spot is already booked for the specified dates";
                err.status = 403;
                err.errors = { startDate: "Start date conflicts with an existing booking", endDate: "End date conflicts with an existing booking" };
                errors.push(err);
                return next(err)
            }

            if (requestedStartDate.getTime() === bookedStartDate.getTime() ||
                requestedStartDate.getTime() === bookedEndDate.getTime() ||
                (requestedStartDate >= bookedStartDate && requestedStartDate <= bookedEndDate)
            ) {
                err.message = "Sorry, this spot is already booked for the specified dates";
                err.status = 403;
                err.errors = { startDate: "Start date conflicts with an existing booking" };
                errors.push(err);
                return next(err)
            }

            if (requestedEndDate.getTime() === bookedStartDate.getTime() ||
                requestedEndDate.getTime() === bookedEndDate.getTime() ||
                (requestedStartDate <= bookedStartDate && requestedEndDate >= bookedStartDate && requestedEndDate <= bookedEndDate) ||
                (requestedStartDate >= bookedEndDate && requestedEndDate <= bookedEndDate)
            ) {
                err.message = "Sorry, this spot is already booked for the specified dates";
                err.status = 403;
                err.errors = { endDate: "End date conflicts with an existing booking" };
                errors.push(err);
                return next(err)
            }

        }
    })

    if (!errors.length) {
        booking.set({
            startDate: req.body.startDate,
            endDate: req.body.endDate
        });

        await booking.save();


        let editedBooking = {
            id: booking.id,
            spotId: booking.spotId,
            userId: booking.userId,
            startDate: booking.startDate,
            endDate: booking.endDate,
            createdAt: booking.createdAt,
            updatedAt: booking.updatedAt
        }
        return res.json(editedBooking);
    }
});

router.delete('/:bookingId', requireAuth, async (req, res) => {
    const bookingId = Number(req.params.bookingId);
    const booking = await Booking.findByPk(bookingId);

    if (!booking) return res.status(404).json({ message: "Booking couldn't be found" });

    const spot = await Spot.findByPk(booking.spotId);

    if (req.user.id !== booking.userId && req.user.id !== spot.ownerId) return res.status(403).json({ message: 'Forbidden' });

    let bookedStartDate = new Date(booking.startDate);
    let today = new Date();

    if (bookedStartDate <= today) return res.status(403).json({ message: "Bookings that have been started can't be deleted" })

    await booking.destroy();

    return res.json({ message: "Successfully deleted" })
});

module.exports = router;
