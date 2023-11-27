'use strict';

/** @type {import('sequelize-cli').Migration} */

const { Booking } = require('../models');

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;
}

const listOfBookings = [
  {
    userId: 7,
    spotId: 5,
    startDate: '2024-01-01',
    endDate: '2024-01-04'
  },
  {
    userId: 7,
    spotId: 6,
    startDate: '2024-02-01',
    endDate: '2024-02-04'
  },
  {
    userId: 8,
    spotId: 6,
    startDate: '2024-03-01',
    endDate: '2024-03-04'
  },
  {
    userId: 9,
    spotId: 7,
    startDate: '2024-05-01',
    endDate: '2024-05-05'
  }
]



module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */

    try {
      await Booking.bulkCreate(listOfBookings, { validate: true })
    } catch (err) {
      console.error(err);
      throw err;
    }
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */

    options.tableName = 'Bookings';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, { [Op.or]: listOfBookings }, {});
  }
};
