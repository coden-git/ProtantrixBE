const mongoose = require('mongoose');

const { Schema } = mongoose;
const crypto = require('crypto');

const PROJECT_STATUSES = ['READY', 'IN_PROGRESS', 'COMPLETED', 'DELETED'];

const ProjectSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: false,
      default: null,
      trim: true,
    },
    status: {
      type: String,
      enum: PROJECT_STATUSES,
      required: true,
      default: 'READY',
    },
    docs: {
      type: [String],
      required: false,
      default: [],
    },
    uuid: {
      type: String,
      required: true,
      unique: true,
      index: true,
      default: () => crypto.randomUUID(),
      trim: true,
    },
    activities: {
      // store arbitrary JSON for activities; default to empty array
      type: [Schema.Types.Mixed],
      required: false,
      default: [],
    },
    json_schema_version: {
      type: Number,
      required: false,
      default: 0,
    },
  },
  {
    timestamps: true,
    collection: 'project',
  }
);

module.exports = mongoose.model('Project', ProjectSchema);
