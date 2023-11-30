'use strict';

/** @type {import('sequelize-cli').Migration} */

const { Review } = require('../models');

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;
}

const listOfReviews = [
  {
    userId: 1,
    spotId: 1,
    review: 'This place was awesome!',
    stars: 5
  },
  {
    userId: 2,
    spotId: 2,
    review: 'Highly recommend!',
    stars: 5
  },
  {
    userId: 1,
    spotId: 2,
    review: 'Good!',
    stars: 4
  },
  {
    userId: 3,
    spotId: 3,
    review: 'Very clean',
    stars: 4
  },
  {
    userId: 1,
    spotId: 3,
    review: 'It was aite',
    stars: 3
  },
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
      await Review.bulkCreate(listOfReviews, { validate: true })
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

    options.tableName = 'Reviews';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, { [Op.or]: listOfReviews }, {});
  }
};
