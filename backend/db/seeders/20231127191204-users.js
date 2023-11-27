'use strict';

/** @type {import('sequelize-cli').Migration} */

const { User } = require('../models');
const bcrypt = require('bcryptjs');

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;
}

const listOfUsers = [
  {
    firstName: 'Steve',
    lastName: 'Rogers',
    email: 'steve@captainamerica.com',
    username: 'CaptainAmerica',
    hashedPassword: bcrypt.hashSync('password')
  },
  {
    firstName: 'Peter',
    lastName: 'Parker',
    email: 'peter@spiderman.com',
    username: 'SpiderMan',
    hashedPassword: bcrypt.hashSync('password')
  },
  {
    firstName: 'Tony',
    lastName: 'Starks',
    email: 'tony@ironman.com',
    username: 'IronMan',
    hashedPassword: bcrypt.hashSync('password')
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
      await User.bulkCreate(listOfUsers, { validate: true })
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

    options.tableName = 'Users';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, { [Op.or]: listOfUsers }, {});
  }
};
