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
    preview: true
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
    preview: true
  },
  {
    imageableId: 1,
    imageableType: 'Spot',
    url: 'https://static.tripzilla.com/thumb/a/9/141225_800x.jpg',
    preview: false
  },
  {
    imageableId: 1,
    imageableType: 'Spot',
    url: 'https://i.pinimg.com/564x/b8/83/d2/b883d2b98b3af44aa77aefeccad4ddc7.jpg',
    preview: false
  },
  {
    imageableId: 1,
    imageableType: 'Spot',
    url: 'https://cdn.shopify.com/s/files/1/0268/8483/3383/files/xl-wall-mural-featuring-avengers-age-of-ultron-1024x1024.jpg?v=1582061926',
    preview: false
  },
  {
    imageableId: 1,
    imageableType: 'Spot',
    url: 'https://www.themeparkinsider.com/photos/images/dlp-marvel-ny1.jpg',
    preview: false
  },
  {
    imageableId: 2,
    imageableType: 'Spot',
    url: 'https://static.tripzilla.com/thumb/9/d/141213_800x.jpg',
    preview: true
  },
  {
    imageableId: 2,
    imageableType: 'Spot',
    url: 'https://static.tripzilla.com/thumb/a/3/141219_800x.jpg',
    preview: false
  },
  {
    imageableId: 2,
    imageableType: 'Spot',
    url: 'https://static.tripzilla.com/thumb/a/2/141218_800x.jpg',
    preview: false
  },
  {
    imageableId: 2,
    imageableType: 'Spot',
    url: 'https://static.tripzilla.com/thumb/a/5/141221_800x.jpg',
    preview: false
  },
  {
    imageableId: 2,
    imageableType: 'Spot',
    url: 'https://static.tripzilla.com/thumb/a/6/141222_800x.jpg',
    preview: false
  },
  {
    imageableId: 3,
    imageableType: 'Spot',
    url: 'https://static.tripzilla.com/thumb/a/1/141217_800x.jpg',
    preview: false
  },
  {
    imageableId: 3,
    imageableType: 'Spot',
    url: 'https://static.tripzilla.com/thumb/a/8/141224_800x.jpg',
    preview: true
  },
  {
    imageableId: 3,
    imageableType: 'Spot',
    url: 'https://i.shelterness.com/2017/06/02-a-gorgeous-3D-wall-art-inspired-by-Avengers-for-a-boys-bedroom.jpg',
    preview: false
  },
  {
    imageableId: 4,
    imageableType: 'Spot',
    url: 'https://static.tripzilla.com/thumb/9/f/141215_800x.jpg',
    preview: true
  },
  {
    imageableId: 5,
    imageableType: 'Spot',
    url: 'https://images.squarespace-cdn.com/content/51b3dc8ee4b051b96ceb10de/1426896373147-YMYLGMY2709FI4QCXC4Q/image-asset.jpeg?content-type=image%2Fjpeg',
    preview: true
  },
  {
    imageableId: 6,
    imageableType: 'Spot',
    url: 'https://st.hzcdn.com/simgs/pictures/bedrooms/avengers-murals-hand-painted-throughout-a-kids-bedroom-mural-art-llc-wall-murals-and-fine-art-img~80d18bc1056e3aff_14-8458-1-c26a5bc.jpg',
    preview: true
  },
  {
    imageableId: 7,
    imageableType: 'Spot',
    url: 'https://www.themeparkinsider.com/photos/images/dlp-marvel-ny1.jpg',
    preview: true
  },
  {
    imageableId: 8,
    imageableType: 'Spot',
    url: 'https://static.tripzilla.com/thumb/a/0/141216_800x.jpg',
    preview: true
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
