import { registerAs } from '@nestjs/config';
import { config as dotenvConfig } from 'dotenv';
import { DataSource, DataSourceOptions } from 'typeorm';
import { join } from 'path';

dotenvConfig({ path: '.env.development' });

const config: DataSourceOptions = {
    type: 'postgres',
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    //host: 'host.docker.internal',
    port: Number(process.env.DB_PORT),
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD, 
    entities: ['dist/**/*.entity{.ts,.js}'],
    migrations: ['dist/migrations/*{.ts,.js}'],
    logging: true, //Muestra los loggins por consola
    synchronize: true, //En desarrollo puede ser true, nunca en producción. Sincroniza los cambios en las entidades con la base de datos
    dropSchema: true, //En desarrollo puede ser true, nunca en producción. Borra la base de datos | Para la precarga de datos puede ponerse en false, luego de levantar con los datos precargados
}

export default registerAs('typeorm', () => config);
export const connectionSource = new DataSource(config);


