// Import the Mongoose library
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
	{
		// Define the name field with type String, required, and trimmed
		firstName: {
			type: String,
			required: true,
			trim: true,
		},
		lastName: {
			type: String,
			required: true,
			trim: true,
		},
		email: {
			type: String,
			required: true,
			trim: true,
			set: (value) => value.toLowerCase(), 
		},
		password: {
			type: String,
			required: true,
		},
		accountType: {
			type: String,
			enum: ["Admin", "Player"],
			required: true,
		},
		active: {
			type: Boolean,
			default: true,
		},
		approved: {
			type: Boolean,
			default: true,
		},
		additionalDetails: {
			type: mongoose.Schema.Types.ObjectId,
			required: true,
			ref: "Profile",
		},
		token: {
			type: String,
		},
		resetPasswordExpires: {
			type: Date,
		},
		image: {
			type: String,
			required: true,
		},
		gameDetails: {
			type: mongoose.Schema.Types.ObjectId,
			required: true,
			ref: "game",
		},
		// Add timestamps for when the document is created and last modified
	},
	{ timestamps: true }
);

// Export the Mongoose model for the user schema, using the name "user"
module.exports = mongoose.model("user", userSchema);