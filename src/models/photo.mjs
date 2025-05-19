import mongoose from 'mongoose';

const photoSchema = new mongoose.Schema({
  title: { type: String, required: true },
  url: { type: String, required: true },
  description: String,
  created_at: { type: Date, default: Date.now },
  album: { type: mongoose.Schema.Types.ObjectId, ref: 'Album', required: true }
}, {
  collection: 'photos',
  versionKey: false
}).set('toJSON', {
  transform: (_, ret) => {
    const retCopy = { ...ret };
    retCopy.id = retCopy._id;
    delete retCopy._id;
    return retCopy;
  }
});

export default photoSchema;
