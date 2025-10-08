const mongoose = require('mongoose');
const crypto = require('crypto');

const { Schema } = mongoose;

// Embedded user meta (no separate _id) similar to alert schema style
const UserMetaSchema = new Schema(
	{
		userId: { type: String, required: true, trim: true }, // store user uuid or _id string
		userName: { type: String, required: true, trim: true },
	},
	{ _id: false }
);

const CommentSchema = new Schema(
	{
		uuid: {
			type: String,
			required: true,
			unique: true,
			index: true,
			default: () => crypto.randomUUID(),
			trim: true,
		},
		comment: {
			type: String,
			required: true,
			trim: true,
			maxlength: 5000,
		},
		project: {
			type: new Schema({
				projectId: { type: String, required: true, trim: true },
				projectName: { type: String, required: true, trim: true },
			}, { _id: false }),
			required: true,
		},
		activity: {
			type: new Schema({
				activityId: { type: String, required: true, trim: true },
				activityName: { type: String, required: true, trim: true },
			}, { _id: false }),
			required: true,
		},
		createdDate: {
			type: Date,
			required: true,
			default: () => new Date(),
			index: true,
		},
		commentedBy: {
			type: UserMetaSchema,
			required: true,
		},
		fileUri: {
			type: String,
			trim: true,
			index: true,
		},
	},
	{
		timestamps: true, // createdAt / updatedAt
		collection: 'comment',
	}
);

// Helpful compound indexes for retrieval per file chronologically & user queries
CommentSchema.index({ fileUri: 1, createdDate: -1 });
CommentSchema.index({ 'commentedBy.userId': 1, createdDate: -1 });
CommentSchema.index({ 'project.projectId': 1, 'activity.activityId': 1, createdDate: -1 });
CommentSchema.index({ 'project.projectId': 1, createdDate: -1 });

module.exports = mongoose.model('Comment', CommentSchema);
