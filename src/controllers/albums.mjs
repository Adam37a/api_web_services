import albumModel from '../models/album.mjs';

const Albums = class Albums {
  constructor(app, connect) {
    this.app = app;
    this.AlbumModel = connect.model('Albums', albumModel);

    this.run();
  }

  deleteById() {
    this.app.delete('/album/:id', (req, res) => {
      try {
        this.AlbumModel.findByIdAndDelete(req.params.id).then((user) => {
          res.status(200).json(user || {});
        }).catch(() => {
          res.status(500).json({
            code: 500,
            message: 'Internal Server error'
          });
        });
      } catch (err) {
        console.error(`[ERROR] album/:id -> ${err}`);

        res.status(400).json({
          code: 400,
          message: 'Bad request'
        });
      }
    });
  }

  showById() {
    this.app.get('/album/:id', (req, res) => {
      try {
        this.AlbumModel.findById(req.params.id).then((user) => {
          res.status(200).json(user || {});
        }).catch(() => {
          res.status(500).json({
            code: 500,
            message: 'Internal Server error'
          });
        });
      } catch (err) {
        console.error(`[ERROR] album/:id -> ${err}`);

        res.status(400).json({
          code: 400,
          message: 'Bad request'
        });
      }
    });
  }

  showAll() {
    this.app.get('/albums', (req, res) => {
      try {
        this.AlbumModel.findById(req.params.id).then((user) => {
          res.status(200).json(user || {});
        }).catch(() => {
          res.status(500).json({
            code: 500,
            message: 'Internal Server error'
          });
        });
      } catch (err) {
        console.error(`[ERROR] albums -> ${err}`);

        res.status(400).json({
          code: 400,
          message: 'Bad request'
        });
      }
    });
  }

  putAlbum() {
    this.app.put('/album/:id', (req, res) => {
      try {
        this.AlbumModel.findById(req.params.id).then((user) => {
          res.status(200).json(user || {});
        }).catch(() => {
          res.status(500).json({
            code: 500,
            message: 'Internal Server error'
          });
        });
      } catch (err) {
        console.error(`[ERROR] album/:id ${err}`);

        res.status(400).json({
          code: 400,
          message: 'Bad request'
        });
      }
    });
  }

  create() {
    this.app.post('/album', (req, res) => {
      try {
        const AlbumModel = new this.AlbumModel(req.body);

        AlbumModel.save().then((user) => {
          res.status(200).json(user || {});
        }).catch(() => {
          res.status(200).json({});
        });
      } catch (err) {
        console.error(`[ERROR] album/create -> ${err}`);

        res.status(400).json({
          code: 400,
          message: 'Bad request'
        });
      }
    });
  }

  run() {
    this.create();
    this.showById();
    this.deleteById();
    this.showAll();
    this.putAlbum();
  }
};

export default Albums;
