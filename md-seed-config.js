import mongoose from 'mongoose';

import Permissions from './seeders/permissions.seeder';
import Roles from './seeders/roles.seeder';
import Users from './seeders/users.seeder';
import Currencies from './seeders/currencies.seeder';
import Amenities from './seeders/amenities.seeder';
import Properties from './seeders/properties.seeder'

const mongoURL = process.env.MONGO_URL || 'mongodb://localhost:27017/jinn_website';

/**
 * Seeders List
 * order is important
 * @type {Object}
 */
export const seedersList = {
  Permissions,
  Roles,
  Users,
  Currencies,
  Amenities,
  Properties
};
/**
 * Connect to mongodb implementation
 * @return {Promise}
 */
export const connect = async () =>
  await mongoose.connect(mongoURL, { useNewUrlParser: true });
/**
 * Drop/Clear the database implementation
 * @return {Promise}
 */
export const dropdb = async () => mongoose.connection.db.dropDatabase();
