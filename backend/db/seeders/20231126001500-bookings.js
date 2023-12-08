'use strict';

/** @type {import('sequelize-cli').Migration} */

const { Booking } = require('../models');

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;
}

const listOfBookings = [
  {
    userId: 1,
    spotId: 2,
    startDate: '2024-01-01',
    endDate: '2024-01-04'
  },
  {
    userId: 2,
    spotId: 2,
    startDate: '2024-02-01',
    endDate: '2024-02-04'
  },
  {
    userId: 3,
    spotId: 1,
    startDate: '2024-03-01',
    endDate: '2024-03-04'
  },
  {
    userId: 3,
    spotId: 3,
    startDate: '2023-05-01',
    endDate: '2023-05-05'
  },
  {
    userId: 3,
    spotId: 3,
    startDate: '2023-12-05',
    endDate: '2023-12-06'
  },
  {
    userId: 3,
    spotId: 3,
    startDate: '2023-12-06',
    endDate: '2023-12-15'
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
