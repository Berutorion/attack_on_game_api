import express, { Application } from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import 'module-alias/register';
import dotenv from 'dotenv';
dotenv.config({ path: '.env' });
const app: Application = express();

app.use(express.json());
app.use(cors());
export default app;
//TODO:自動更新 MongoDB 的 IP 白名單設置
