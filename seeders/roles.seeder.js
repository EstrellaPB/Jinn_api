//import faker from 'faker/locale/en_US'; // or es_MX
import { Seeder } from 'mongoose-data-seed';
import Role from '../models/role';
import Permission from '../models/permission';

class RolesSeeder extends Seeder {
  async beforeRun() {
    this.permissions = await Permission.find().exec();
    this.roleAdminData = this._generateRole();
  }

  async shouldRun() {
    return Role.countDocuments().exec().then(count => count === 0);
  }

  async run() {
    return Role.create(this.roleAdminData);
  }

  _generateRole() {
    const permissionsArr = this.permissions.map(function(permission) {
      return permission._id;
    });
    console.log(permissionsArr);
    return [{
      name: 'Administrator',
      permissions: permissionsArr
    }];
  }

  // _generateRoles() {
  //   return Array.apply(null, Array(10)).map(() => {
  //     const randomPermissions = faker.random.arrayElement(this.permissions);

  //     const randomTagsCount = faker.random.number({
  //       min: 0,
  //       max: 5,
  //       precision: 1,
  //     });
  //     const randomTags = Array.apply(null, Array(randomTagsCount))
  //       .map(() => faker.random.arrayElement(TAGS))
  //       .join(',');

  //     return {
  //       author: randomUser._id,
  //       title: faker.lorem.words(),
  //       body: faker.lorem.paragraphs(),
  //       tags: randomTags,
  //     };
  //   });
  // }
}

export default RolesSeeder;
