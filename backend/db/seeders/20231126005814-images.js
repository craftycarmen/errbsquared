'use strict';

/** @type {import('sequelize-cli').Migration} */

const { Image } = require('../models');

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;
}

const listOfImages = [
  {
    imageableId: 1,
    imageableType: 'Review',
    url: 'https://thepopinsider.com/wp-content/uploads/sites/6/2018/05/popinsider_marvel_header.jpg',
    previewImage: true
  },
  {
    imageableId: 2,
    imageableType: 'Review',
    url: 'https://www.home-designing.com/wp-content/uploads/2014/07/marvel-themed-apartment.jpg',
    previewImage: false
  },
  {
    imageableId: 5,
    imageableType: 'Spot',
    url: 'https://static.tripzilla.com/thumb/a/9/141225_800x.jpg',
    previewImage: true
  },
  {
    imageableId: 4,
    imageableType: 'Spot',
    url: 'https://static.tripzilla.com/thumb/a/8/141224_800x.jpg',
    previewImage: true
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
      await Image.bulkCreate(listOfImages, { validate: true })
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

    options.tableName = 'Images';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, { [Op.or]: listOfImages }, {});
  }
};
