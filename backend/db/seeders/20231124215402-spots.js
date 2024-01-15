'use strict';

/** @type {import('sequelize-cli').Migration} */

const { Spot } = require('../models');

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;
}

const listOfSpots = [
  {
    ownerId: 1,
    address: '244 Marvel Ave',
    city: 'Los Angeles',
    state: 'California',
    country: 'US',
    lat: 37.7645358,
    lng: 30.50055,
    name: 'Avenger House',
    description: 'Completely Marvel-themed',
    price: 50
  },
  {
    ownerId: 2,
    address: '259 Marvel Ave',
    city: 'Los Angeles',
    state: 'California',
    country: 'US',
    lat: 38.7645358,
    lng: 123.4730327,
    name: 'Captain America House',
    description: 'Completely Captain America-themed. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Tellus at urna condimentum mattis pellentesque id nibh. Ac tortor vitae purus faucibus ornare. Mollis nunc sed id semper risus in hendrerit gravida. In eu mi bibendum neque egestas congue quisque egestas. Velit egestas dui id ornare arcu odio ut. Eget nulla facilisi etiam dignissim diam quis enim. Accumsan in nisl nisi scelerisque eu ultrices. Et pharetra pharetra massa massa ultricies mi quis. Aliquam id diam maecenas ultricies mi. Senectus et netus et malesuada fames ac. In aliquam sem fringilla ut morbi tincidunt augue. Sed augue lacus viverra vitae congue eu consequat ac felis.',
    price: 75
  },
  {
    ownerId: 3,
    address: '260 Marvel Ave',
    city: 'Los Angeles',
    state: 'California',
    country: 'US',
    lat: 39.7645358,
    lng: 34.500880,
    name: 'Spidey House',
    description: 'Completely Spider-Man-themed',
    price: 75
  },
  {
    ownerId: 3,
    address: '260 Captain America Ave',
    city: 'Los Angeles',
    state: 'California',
    country: 'US',
    lat: 40.7645358,
    lng: 130.4730327,
    name: 'Steve Roger House',
    description: 'All things Stevey!',
    price: 125
  },
  {
    ownerId: 2,
    address: '260 Hulk Ave',
    city: 'Los Angeles',
    state: 'California',
    country: 'US',
    lat: 39.7645358,
    lng: 129.4730327,
    name: 'Green House',
    description: 'Perfect for Hulk Lovers',
    price: 70
  },
  {
    ownerId: 2,
    address: '260 Black Widow Ave',
    city: 'Los Angeles',
    state: 'California',
    country: 'US',
    lat: 39.7645358,
    lng: 124.4730327,
    name: 'Spidey House',
    description: 'Hope you like spiders',
    price: 1000
  },
  {
    ownerId: 1,
    address: '25950 Marvel Ave',
    city: 'Los Angeles',
    state: 'California',
    country: 'US',
    lat: 37,
    lng: 124.4730327,
    name: 'Scarlet Witch',
    description: 'Red!',
    price: 800
  },
  {
    ownerId: 1,
    address: '234 Black Panther Ave',
    city: 'Los Angeles',
    state: 'California',
    country: 'US',
    lat: 36,
    lng: 120,
    name: 'Wakanda Forever',
    description: 'For Black Panther Lovers',
    price: 800
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
      await Spot.bulkCreate(listOfSpots, { validate: true })
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

    options.tableName = 'Spots';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, { [Op.or]: listOfSpots }, {});
  }
};
