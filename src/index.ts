import 'dotenv/config';
import express from 'express';
import mongoose from 'mongoose';
import http from 'http';
import session from 'express-session';
import passport from 'passport';
import { User } from './models';
import './middlewares/auth-google';

declare module 'express-session' {
  interface SessionData {
    views?: number;
  }
}

// App and Middlewares
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(session({ secret: process.env.SECRET as string, resave: false, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());

// Auth routes
app.get('/auth/google', passport.authenticate('google', { scope: ['email', 'profile'] }));

app.get(
  '/auth/google/callback',
  passport.authenticate('google', { successRedirect: '/api', failureRedirect: '/login' })
);

app.post('/register', async (req, res) => {
  const { username, password, email } = req.body;

  const user = new User({ email, password, username });
  // await user.save();

  res.status(200).send('Registered successfully');
});

app.get('/api', (req, res) => {
  res.send('Welcome Home');
});

app.get('/login', (req, res) => {
  res.send('Please login again' + '<a href="http://localhost:9000/auth/google">Continue with Google</a>');
});

// Server and Database connection
const server = http.createServer(app);
server.listen(9000, async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL as string);
    console.log('Database connected successfully');
  } catch (ex: any) {
    console.log('Database connection error: ', ex.message);
  }

  console.log('Server running');
});
