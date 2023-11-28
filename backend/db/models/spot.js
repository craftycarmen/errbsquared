'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Spot extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here

      Spot.belongsTo(
        models.User,
        {
          foreignKey: 'ownerId'
        }
      );

      Spot.belongsToMany(
        models.User,
        {
          through: models.Booking,
          foreignKey: 'spotId',
          otherKey: 'userId',
          onDelete: 'CASCADE'
        }
      );

      Spot.belongsToMany(
        models.User,
        {
          through: models.Review,
          foreignKey: 'spotId',
          otherKey: 'userId',
          onDelete: 'CASCADE'
        }
      );

      Spot.hasMany(
        models.Image, {
        foreignKey: 'imageableId',
        constraints: false,
        scope: {
          imageableType: 'Spot'
        }
      });

    }
  }
  Spot.init({
    ownerId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    address: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'Street address is required'
        }
      }
    },
    city: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'City is required'
        }
      }
    },
    state: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'State is required'
        }
      }
    },
    country: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'Country is required'
        }
      }
    },
    lat: {
      type: DataTypes.DECIMAL,
      allowNull: false,
      validate: {
        min: {
          args: [-90],
          msg: 'Latitude is not valid'
        },
        max: {
          args: [90],
          msg: 'Latitude is not valid'
        }
      }
    },
    lng: {
      type: DataTypes.DECIMAL,
      allowNull: false,
      validate: {
        min: {
          args: [-180],
          msg: 'Longitude is not valid'
        },
        max: {
          args: [180],
          msg: 'Longitude is not valid'
        }
      }
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: {
          args: [1, 50],
          msg: 'Name must be less than 50 characters'
        }
      }
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'Description is required'
        }
      }
    },
    price: {
      type: DataTypes.DECIMAL,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'Price per day is required'
        },
        min: {
          args: [1],
          msg: 'Price per day is invalid'
        }
      }
    }
  }, {
    sequelize,
    modelName: 'Spot',
  });
  return Spot;
};
