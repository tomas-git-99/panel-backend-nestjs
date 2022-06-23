import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { AppDataSource } from './DBconfig/DataBase';

import dotenv from 'dotenv';


require('dotenv').config();


async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  app.setGlobalPrefix('api');

  await app.listen(9000);
  //await app.listen(9000, '0.0.0.0');
}




AppDataSource.initialize()
.then(() => {
    console.log("Data Source has been initialized!")
})
.catch((err) => {
  console.log(err)
    console.error("Error during Data Source initialization", err)
});

bootstrap();
