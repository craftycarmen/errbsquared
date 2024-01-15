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
    review: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Tellus at urna condimentum mattis pellentesque id nibh. Ac tortor vitae purus faucibus ornare. Mollis nunc sed id semper risus in hendrerit gravida. In eu mi bibendum neque egestas congue quisque egestas. Velit egestas dui id ornare arcu odio ut. Eget nulla facilisi etiam dignissim diam quis enim. Accumsan in nisl nisi scelerisque eu ultrices. Et pharetra pharetra massa massa ultricies mi quis. Aliquam id diam maecenas ultricies mi. Senectus et netus et malesuada fames ac. In aliquam sem fringilla ut morbi tincidunt augue. Sed augue lacus viverra vitae congue eu consequat ac felis.',
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
