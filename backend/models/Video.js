import mongoose from 'mongoose';

const VideoSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, unique: true },
    desc: { type: String },
    video: { type: String },
    trailer: { type: String },
    thumbnail: { type: String },
    thumbnailSmall: { type: String },
    date: { type: String },
    isDrone: { type: Boolean, default: false },
    category: { type: String },
  },
  { timestamps: true },
);

module.exports = mongoose.model('Video', VideoSchema);
