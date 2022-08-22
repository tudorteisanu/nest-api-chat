import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';
import getDbConfig from './database';

dotenv.config();

const AppDataSource = new DataSource({
  ...getDbConfig(),
} as any);

AppDataSource.initialize().catch((err) => {
  console.error('Error during Data Source initialization', err);
});

export default AppDataSource;
