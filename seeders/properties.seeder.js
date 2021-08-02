import faker from 'faker/locale/en_US';

import { Seeder } from 'mongoose-data-seed';
import Property from '../models/property';
import Amenity from '../models/amenity';
import Currency from '../models/currency';
import User from '../models/user';

class PropertiesSeeder extends Seeder {
  async beforeRun() {
    this.amenities = await Amenity.find().exec();
    this.currency = await Currency.find({code: 'USD'}).exec();
    this.homeowner = await User.find({name: 'Admin'});
    this.propertiesData = this._generateProperties();
  }
  async shouldRun() {
    return Property.countDocuments().exec().then(count => count === 0);
  }

  async run() {
    return Property.create(this.propertiesData);
  }

  _generateProperties() {
    return Array.apply(null, Array(10)).map(() => {
      const randomTagsCount = faker.random.number({
        min: 1,
        max: 5,
        precision: 1,
      });

      const randomAmenities = Array.apply(null, Array(randomTagsCount)).map(() => { 
        return {
          qty: faker.random.number({min: 1, max: 5, precision: 1}),
          amenity: faker.random.arrayElement(this.amenities)._id
        }
      });
      
      return {
        title: faker.lorem.words(),
        description: faker.lorem.words(),
        stars: faker.random.number({min: 0, max: 5, precision: 1}),
        price: faker.random.number({min: 1, max: 100, precision: 1}),
        currency: this.currency[0]._id,
        address: faker.address.streetAddress("###"),
        maxGuests: faker.random.number({ min: 1, max: 8, precision: 1 }),
        location: {
          lat: faker.address.latitude(),
          long: faker.address.longitude()
        },
        amenities: randomAmenities,
        homeowner: this.homeowner[0]._id
      };
    });
  }
}
  
export default PropertiesSeeder;