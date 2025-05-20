import express from 'express';
import mongoose from 'mongoose';
import helmet from 'helmet';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import fs from 'fs';
import https from 'https';
import dotenv from 'dotenv';
import config from './config.mjs';
import routes from './controllers/routes.mjs';

dotenv.config();

const Server = class Server {
  constructor() {
    this.app = express();
    this.config = config[process.argv[2]] || config.development;
  }

  async dbConnect() {
    try {
      this.connect = await mongoose.createConnection(this.config.mongodb);
    } catch (err) {
      console.error('MongoDB error:', err);
    }
  }

  middleware() {
    this.app.use(helmet());
    this.app.use(cors({ origin: '*' }));
    this.app.use(express.json());

    const limiter = rateLimit({
      windowMs: 60 * 60 * 1000, // 1 heure
      max: 100,
      message: 'Too many requests from this IP, please try again in an hour'
    });
    this.app.use(limiter);
  }

  routes() {
    new routes.Users(this.app, this.connect);
    new routes.Albums(this.app, this.connect);
    new routes.Photos(this.app, this.connect);
    new routes.Pipeline(this.app, this.connect);

    this.app.use((req, res) => {
      res.status(404).json({ code: 404, message: 'Not Found' });
    });
  }

  errorHandler() {
    this.app.use((err, req, res) => {
      console.error(err);
      res.status(500).json({ error: 'Internal Server Error' });
    });
  }

  async run() {
    await this.dbConnect();
    this.middleware();
    this.routes();
    this.errorHandler();

    // HTTPS server with local certificate
    const sslOptions = {
      key: fs.readFileSync('./cert/key.pem'),
      cert: fs.readFileSync('./cert/cert.pem')
    };

    https.createServer(sslOptions, this.app).listen(this.config.port, () => {
      console.log(`✅ HTTPS Server running on port ${this.config.port}`);
    });
  }
};

export default Server;
