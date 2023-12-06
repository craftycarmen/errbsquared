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
    preview: true
  },
  {
    imageableId: 1,
    imageableType: 'Review',
    url: 'https://www.home-designing.com/wp-content/uploads/2014/07/marvel-themed-apartment.jpg',
    preview: false
  },
  {
    imageableId: 2,
    imageableType: 'Review',
    url: 'https://projectnursery.com/wp-content/uploads/2017/05/IMG_9314-728x728.jpg',
    preview: true
  },
  {
    imageableId: 3,
    imageableType: 'Review',
    url: 'https://uc.orez.io/i/dd5dcb76e8b64f849121e592cde0c1fd-Large',
    preview: true
  },
  {
    imageableId: 4,
    imageableType: 'Review',
    url: 'https://cdn.homecrux.com/wp-content/uploads/2015/05/Avengers-themed-Apartment_4.jpg',
    preview: true
  },
  {
    imageableId: 1,
    imageableType: 'Spot',
    url: 'https://www.home-designing.com/wp-content/uploads/2014/07/marvel-themed-apartment.jpg',
    preview: false
  },
  {
    imageableId: 2,
    imageableType: 'Spot',
    url: 'https://static.tripzilla.com/thumb/a/9/141225_800x.jpg',
    preview: true
  },
  {
    imageableId: 2,
    imageableType: 'Spot',
    url: 'https://i.pinimg.com/564x/b8/83/d2/b883d2b98b3af44aa77aefeccad4ddc7.jpg',
    preview: false
  },
  {
    imageableId: 2,
    imageableType: 'Spot',
    url: 'https://cdn.shopify.com/s/files/1/0268/8483/3383/files/xl-wall-mural-featuring-avengers-age-of-ultron-1024x1024.jpg?v=1582061926',
    preview: true
  },
  {
    imageableId: 3,
    imageableType: 'Spot',
    url: 'https://static.tripzilla.com/thumb/a/8/141224_800x.jpg',
    preview: true
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
