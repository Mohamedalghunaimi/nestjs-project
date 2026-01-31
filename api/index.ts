/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { NestFactory } from '@nestjs/core';
import { AppModule } from '../src/app.module'; // استورد من src مباشرة
import { ExpressAdapter } from '@nestjs/platform-express';
import express, { Request, Response } from 'express';

const server = express();

export default async function handler(req:Request, res:Response) {
  try {
    const app = await NestFactory.create(AppModule, new ExpressAdapter(server));
    app.setGlobalPrefix('api'); // أي route هيبقى /api/...
    await app.init();
    return server(req, res);
  } catch (err) {
    console.error(err); // هتطبع أي error على Vercel logs
    res.status(500).send('Internal Server Error');
  }
}