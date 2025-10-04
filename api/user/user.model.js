const mongoose = require('mongoose');

const { Schema } = mongoose;

const USER_ROLES = ['admin', 'user'];

const ProjectRefSchema = new Schema(
  {
    uuid: { type: String, required: true, trim: true },
    name: { type: String, required: true, trim: true },
  },
  { _id: false }
);

const UserSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    phone: {
      type: String,
      required: true,
      trim: true,
      match: [/^\d{10}$/, 'phone must be exactly 10 digits'],
      // unique: true, // uncomment if phone numbers must be unique
    },
    password: {
      type: String,
      required: true,
      trim: true,
      select: false, // do not return password by default
    },
    isActive: {
      type: Boolean,
      required: true,
      default: true,
    },
    role: {
      type: String,
      enum: USER_ROLES,
      required: true,
      default: 'user',
    },
    projects: {
      type: [ProjectRefSchema],
      required: false,
      default: [],
    },
  },
  {
    timestamps: true,
    collection: 'user',
  }
);

module.exports = mongoose.model('User', UserSchema);
module.exports.USER_ROLES = USER_ROLES;
