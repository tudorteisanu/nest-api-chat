const getDbConfig: any = () => ({
  type: process.env.DB_TYPE || 'mysql',
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT) || 3306,
  username: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '12345678',
  database: process.env.DB_NAME || 'nestjs',
  entities: ['dist/modules/**/*.entity{.js,.ts}'],
  migrations: ['dist/migrations/**/*{.js,.ts}'],
  autoLoadEntities: false,
  synchronize: false,
  cli: {
    migrationsDir: 'src/migrations',
  },
});

export default getDbConfig;
