const mongoose = require('mongoose');

const { Schema } = mongoose;

const ConfigSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      index: true,
      trim: true,
    },
    // value can be any JSON-serializable data: string, number, object, array, etc.
    value: {
      type: Schema.Types.Mixed,
      required: false,
      default: null,
    },
  },
  {
    timestamps: true,
    collection: 'config',
  }
);


const Config = mongoose.model('Config', ConfigSchema);

// Ensure a default config document exists for schema versioning.
// This will upsert { name: 'json_schema_version', value: 1 } when the DB connection is ready.
async function ensureDefaultSchemaVersion() {
  try {
    await Config.findOneAndUpdate(
      { name: 'json_schema_version' },
      { $setOnInsert: { value: 1 } },
      { upsert: true, setDefaultsOnInsert: true }
    );
    // silent success
  } catch (err) {
    // Log but don't throw — startup should continue even if this fails
    // eslint-disable-next-line no-console
    console.error('Failed to ensure default config json_schema_version:', err && err.message ? err.message : err);
  }
}

if (mongoose.connection && mongoose.connection.readyState === 1) {
  ensureDefaultSchemaVersion();
} else if (mongoose.connection) {
  mongoose.connection.once('open', ensureDefaultSchemaVersion);
}

module.exports = Config;
