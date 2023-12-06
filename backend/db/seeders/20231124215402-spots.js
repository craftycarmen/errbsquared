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
    lng: -122.4730327,
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
    lng: -123.4730327,
    name: 'Captain America House',
    description: 'Completely Captain America-themed',
    price: 75
  },
  {
    ownerId: 3,
    address: '260 Marvel Ave',
    city: 'Los Angeles',
    state: 'California',
    country: 'US',
    lat: 39.7645358,
    lng: -124.4730327,
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
    lng: -130.4730327,
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
    lng: -129.4730327,
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
    lng: -124.4730327,
    name: 'Spidey House',
    description: 'Hope you like spiders',
    price: 1000
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
