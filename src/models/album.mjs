import mongoose from 'mongoose';

const albumSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  created_at: { type: Date, default: Date.now },
  photos: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Photo' }]
}, {
  collection: 'albums',
  versionKey: false
}).set('toJSON', {
  transform: (_, ret) => {
    const retCopy = { ...ret };
    retCopy.id = retCopy._id;
    delete retCopy._id;
    return retCopy;
  }

});

export default albumSchema;
