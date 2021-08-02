import { Seeder } from 'mongoose-data-seed';
import Permission from '../models/permission';

const data = [
  // User permissions
  { name: 'view.user' },
  { name: 'edit.user' },
  { name: 'delete.user' },
  { name: 'create.user' },

  // Role permissions
  { name: 'view.role' },
  { name: 'edit.role' },
  { name: 'delete.role' },
  { name: 'create.role' },

  // Property permissions
  { name: 'view.property' },
  { name: 'edit.property' },
  { name: 'delete.property' },
  { name: 'create.property' },

  // Amenity permissions
  { name: 'view.amenity' },
  { name: 'edit.amenity' },
  { name: 'delete.amenity' },
  { name: 'create.amenity' },

  // Currency permissions
  { name: 'view.currency' },
  { name: 'edit.currency' },
  { name: 'delete.currency' },
  { name: 'create.currency' }
];

class PermissionsSeeder extends Seeder {

  async shouldRun() {
    return Permission.countDocuments().exec().then(count => count === 0);
  }

  async run() {
    return Permission.create(data);
  }
}

export default PermissionsSeeder;
