import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BookModule } from './book/book.module';
import { AuthModule } from './auth/auth.module';
import * as dotenv from 'dotenv'; // Import dotenv

dotenv.config(); // Load environment variables from .env file

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env', // Specify the path to your .env file
      isGlobal: true,
    }),
    MongooseModule.forRoot(process.env.DB_URI), // Use process.env.DB_URI for MongoDB connection
    BookModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
