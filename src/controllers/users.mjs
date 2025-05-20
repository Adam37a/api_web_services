import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import UserModel from '../models/user.mjs';

dotenv.config();

const Users = class Users {
  constructor(app, connect) {
    this.app = app;
    this.UserModel = connect.model('User', UserModel);

    this.run();
  }

  create() {
    this.app.post('/user', (req, res) => {
      try {
        console.log('req.body =', req.body);
        const { username, password } = req.body;
        if (!username || !password) {
          return res.status(400).json({ error: 'Username and password are required' });
        }
        const userModel = new this.UserModel({ username, password });
        return userModel.save()
          .then((user) => res.status(201).json(user || {}))
          .catch((err) => res.status(500).json({ error: 'Database error', detail: err }));
      } catch (err) {
        console.error(`[ERROR] users/create -> ${err}`);
        return res.status(400).json({
          code: 400,
          message: 'Bad request'
        });
      }
    });
  }

  showById() {
    this.app.get('/user/:id', (req, res) => {
      try {
        this.UserModel.findById(req.params.id).then((user) => {
          res.status(200).json(user || {});
        }).catch(() => {
          res.status(500).json({
            code: 500,
            message: 'Internal Server error'
          });
        });
      } catch (err) {
        console.error(`[ERROR] users/:id -> ${err}`);
        res.status(400).json({
          code: 400,
          message: 'Bad request'
        });
      }
    });
  }

  deleteById() {
    this.app.delete('/user/:id', (req, res) => {
      try {
        this.UserModel.findByIdAndDelete(req.params.id).then((user) => {
          res.status(200).json(user || {});
        }).catch(() => {
          res.status(500).json({
            code: 500,
            message: 'Internal Server error'
          });
        });
      } catch (err) {
        console.error(`[ERROR] users/:id -> ${err}`);
        res.status(400).json({
          code: 400,
          message: 'Bad request'
        });
      }
    });
  }

  login() {
    this.app.post('/login', async (req, res) => {
      const { username, password } = req.body;

      if (!username || !password) {
        return res.status(400).json({ error: 'Username and password are required' });
      }

      try {
        const user = await this.UserModel.findOne({ username });
        console.log('user from DB:', user);

        if (!user || user.password !== password) {
          return res.status(401).json({ error: 'Invalid credentials' });
        }

        const token = jwt.sign(
          { id: user._id, username: user.username },
          process.env.JWT_SECRET,
          { expiresIn: '1h' }
        );

        return res.status(200).json({ token }); // ✅ ajout du return
      } catch (err) {
        console.error(`[ERROR] login -> ${err}`);
        return res.status(500).json({ error: 'Server error' }); // ✅ ajout du return
      }
    });
  }

  run() {
    this.create();
    this.showById();
    this.deleteById();
    this.login();
  }
};

export default Users;
