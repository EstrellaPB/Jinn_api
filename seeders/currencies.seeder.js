import { Seeder } from 'mongoose-data-seed';
import Currency from '../models/currency';

const data = [
  { code: 'USD', symbol: '$' },
  { code: 'MXN', symbol: '$' }
];

class CurrenciesSeeder extends Seeder {

  async shouldRun() {
    return Currency.countDocuments().exec().then(count => count === 0);
  }

  async run() {
    return Currency.create(data);
  }
}

export default CurrenciesSeeder;
