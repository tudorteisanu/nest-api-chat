const getDbConfig: any = () => ({
  type: process.env.DB_TYPE || 'mysql',
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT) || 3306,
  username: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '12345678',
  database: process.env.DB_NAME || 'nestjs',
  autoLoadEntities: Boolean(Number(process.env.DB_AUTOLOADENTITIES)),
  synchronize: process.env.APP_ENV === 'development',
});

export default getDbConfig;
