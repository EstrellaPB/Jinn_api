import { Seeder } from 'mongoose-data-seed';
import User from '../models/user';
import Role from '../models/role';

class UsersSeeder extends Seeder {
  async beforeRun() {
    this.role = await Role.find({name: 'Administrator'}).exec();
    this.userData = await this._generateUser();
  }

  async shouldRun() {
    return User.countDocuments().exec().then(count => count === 0);
  }

  async run() {
    return User.create(this.userData);
  }

  async _generateUser() {
    const pass = await User.hashPassword('admin123');
    return [{
      name: 'Admin',
      surname: 'admin',
      email: 'admin@jinn.com',
      password: pass,
      role: this.role[0]._id
    }]
  }
}

export default UsersSeeder;
