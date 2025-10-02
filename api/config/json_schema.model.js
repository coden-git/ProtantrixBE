const mongoose = require('mongoose');

const { Schema } = mongoose;

const JsonSchemaSchema = new Schema(
  {
    version: {
      type: Number,
      required: true,
      default: 1,
    },
    // 'shema' intentionally matches the requested property name and can hold any JSON
    schema: {
      type: Schema.Types.Mixed,
      required: true,
      default: null,
    },
  },
  {
    timestamps: true,
    collection: 'json_schema',
  }
);

module.exports = mongoose.model('JsonSchema', JsonSchemaSchema);
