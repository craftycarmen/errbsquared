'use strict';

/** @type {import('sequelize-cli').Migration} */

const { Spot } = require('../models');

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;
}

const listOfSpots = [
  {
    ownerId: 4,
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
    ownerId: 5,
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
    ownerId: 6,
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
