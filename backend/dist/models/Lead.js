"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Lead = void 0;
const mongoose_1 = require("mongoose");
const LeadSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: [true, 'Lead name is required'],
        trim: true,
    },
    email: {
        type: String,
        required: [true, 'Lead email is required'],
        trim: true,
        lowercase: true,
        match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email address'],
    },
    status: {
        type: String,
        enum: ['New', 'Contacted', 'Qualified', 'Lost'],
        default: 'New',
        required: true,
    },
    source: {
        type: String,
        enum: ['Website', 'Instagram', 'Referral'],
        required: [true, 'Lead source is required'],
    },
    createdBy: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
}, {
    timestamps: true,
});
exports.Lead = (0, mongoose_1.model)('Lead', LeadSchema);
exports.default = exports.Lead;
