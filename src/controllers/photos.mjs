import photoSchema from '../models/photo.mjs';
import albumSchema from '../models/album.mjs';

const Photos = class Photos {
  constructor(app, mongoose) {
    this.app = app;
    this.Photo = mongoose.model('Photo', photoSchema);
    this.Album = mongoose.model('Album', albumSchema);
    this.run();
  }

  run() {
    // Liste toutes les photos d'un album
    this.app.get('/album/:idalbum/photos', async (req, res) => {
      try {
        const photos = await this.Photo.find({ album: req.params.idalbum });
        res.json(photos);
      } catch (err) {
        res.status(500).json({ error: err.message });
      }
    });
    this.app.get('/album/:idalbum/photo/:idphoto', async (req, res) => {
      try {
        // eslint-disable-next-line max-len
        const photo = await this.Photo.findOne({ _id: req.params.idphoto, album: req.params.idalbum });
        res.json(photo);
      } catch (err) {
        res.status(500).json({ error: err.message });
      }
    });
    this.app.post('/album/:idalbum/photo', async (req, res) => {
      try {
        const newPhoto = new this.Photo({ ...req.body, album: req.params.idalbum });
        const photo = await newPhoto.save();

        await this.Album.findByIdAndUpdate(req.params.idalbum, {
          $push: { photos: photo._id }
        });

        res.status(201).json(photo);
      } catch (err) {
        res.status(400).json({ error: err.message });
      }
    });
    this.app.put('/album/:idalbum/photo/:idphoto', async (req, res) => {
      try {
        const photo = await this.Photo.findOneAndUpdate(
          { _id: req.params.idphoto, album: req.params.idalbum },
          req.body,
          { new: true }
        );
        res.json(photo);
      } catch (err) {
        res.status(400).json({ error: err.message });
      }
    });
    this.app.delete('/album/:idalbum/photo/:idphoto', async (req, res) => {
      try {
        const deletedPhoto = await this.Photo.findOneAndDelete({
          _id: req.params.idphoto,
          album: req.params.idalbum
        });

        await this.Album.findByIdAndUpdate(req.params.idalbum, {
          $pull: { photos: req.params.idphoto }
        });

        res.json(deletedPhoto);
      } catch (err) {
        res.status(400).json({ error: err.message });
      }
    });
  }
};

export default Photos;
