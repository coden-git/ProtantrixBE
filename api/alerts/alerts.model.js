const mongoose = require('mongoose');
const crypto = require('crypto');

const { Schema } = mongoose;

// Potential enum for alert types; adjust as domain evolves
const ALERT_TYPES = ['ACTIVITY_UNLOCK', 'NEW_COMMENT'];
const ALERT_STATUS = ['PENDING', 'COMPLETED', 'REJECTED'];

// Embedded subdocuments (no separate _id) to mirror lightweight reference style used elsewhere
const UserMetaSchema = new Schema(
	{
		name: { type: String, required: true, trim: true },
		userId: { type: String, required: true, trim: true }, // could store user uuid or ObjectId string
	},
	{ _id: false }
);

const ProjectMetaSchema = new Schema(
	{
		projectId: { type: String, required: true, trim: true }, // store project uuid
		projectName: { type: String, required: true, trim: true },
	},
	{ _id: false }
);

const ActivityMetaSchema = new Schema(
	{
		activityId: { type: String, required: true, trim: true }, // store activity uuid/id
		activityName: { type: String, required: true, trim: true },
	},
	{ _id: false }
);

const AlertSchema = new Schema(
	{
		uuid: {
			type: String,
			required: true,
			unique: true,
			index: true,
			default: () => crypto.randomUUID(),
			trim: true,
		},
		type: {
			type: String,
			required: true,
			enum: ALERT_TYPES,
			default: 'ACTIVITY_UNLOCK',
			trim: true,
		},
		status: {
			type: String,
			required: true,
			enum: ALERT_STATUS,
			default: 'PENDING',
			index: true,
		},
		createdBy: {
			type: UserMetaSchema,
			required: true,
		},
		// Approval metadata may be absent until processed
		approvedBy: {
			type: UserMetaSchema,
			required: false,
			default: null,
		},
		requestedOn: {
			type: Date,
			required: true,
			default: () => new Date(),
		},
		approvedOn: {
			type: Date,
			required: false,
			default: null,
		},
		project: {
			type: ProjectMetaSchema,
			required: true,
		},
        activity: {
            type: ActivityMetaSchema,
            required: true,
        },
        alertText: {
            type: String,
            required: true,
            trim: true,
        },
        seenBy: { type: [String], default: [] }, // array of userId strings who have seen the alert
	},
	{
		timestamps: true, // createdAt / updatedAt for audit
		collection: 'alert',
	}
);

// Helpful compound indexes
AlertSchema.index({ 'project.projectId': 1, type: 1, status: 1 });
AlertSchema.index({ 'project.projectId': 1, 'activity.activityId': 1, status: 1 });

module.exports = mongoose.model('Alert', AlertSchema);
module.exports.ALERT_TYPES = ALERT_TYPES;
module.exports.ALERT_STATUS = ALERT_STATUS;

