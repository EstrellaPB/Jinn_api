import { Seeder } from 'mongoose-data-seed';
import Amenity from '../models/amenity';

const data = [
  { name: 'guests', icon: 'users' },
  { name: 'bedrooms', icon: 'building' },
  { name: 'beds', icon: 'bed' },
  { name: 'bathroom', icon: 'bath' },
  { name: 'WiFi', icon: 'wifi' }
];

class AmenitiesSeeder extends Seeder {

  async shouldRun() {
    return Amenity.countDocuments().exec().then(count => count === 0);
  }

  async run() {
    return Amenity.create(data);
  }
}

export default AmenitiesSeeder;
