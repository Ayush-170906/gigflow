"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.exportLeadsCSV = exports.deleteLead = exports.updateLead = exports.getLeadById = exports.getLeads = exports.createLead = void 0;
const express_validator_1 = require("express-validator");
const Lead_1 = require("../models/Lead");
/**
 * @desc    Create a new lead
 * @route   POST /api/leads
 * @access  Private
 */
const createLead = async (req, res, next) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        res.status(400).json({
            success: false,
            data: null,
            message: errors.array().map(e => e.msg).join(', ')
        });
        return;
    }
    const { name, email, status, source } = req.body;
    try {
        const lead = await Lead_1.Lead.create({
            name,
            email,
            status: status || 'New',
            source,
            createdBy: req.user._id
        });
        res.status(201).json({
            success: true,
            data: lead,
            message: 'Lead created successfully'
        });
    }
    catch (error) {
        next(error);
    }
};
exports.createLead = createLead;
/**
 * @desc    Get all leads with pagination, search, sort, and filters
 * @route   GET /api/leads
 * @access  Private
 */
const getLeads = async (req, res, next) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        res.status(400).json({
            success: false,
            data: null,
            message: errors.array().map(e => e.msg).join(', ')
        });
        return;
    }
    const { status, source, search, sort, page, limit } = req.query;
    try {
        // 1. Build Query Filters
        const query = {};
        if (status) {
            query.status = status;
        }
        if (source) {
            query.source = source;
        }
        if (search) {
            const searchRegex = new RegExp(search, 'i');
            query.$or = [
                { name: searchRegex },
                { email: searchRegex }
            ];
        }
        // 2. Sorting options
        let sortOption = { createdAt: -1 }; // default is latest
        if (sort === 'oldest') {
            sortOption = { createdAt: 1 };
        }
        // 3. Pagination options
        const pageNum = parseInt(page, 10) || 1;
        const limitNum = parseInt(limit, 10) || 10;
        const skip = (pageNum - 1) * limitNum;
        // 4. Execute Query
        const totalLeads = await Lead_1.Lead.countDocuments(query);
        const leads = await Lead_1.Lead.find(query)
            .populate('createdBy', 'name email role')
            .sort(sortOption)
            .skip(skip)
            .limit(limitNum);
        const totalPages = Math.ceil(totalLeads / limitNum);
        res.status(200).json({
            success: true,
            data: {
                leads,
                pagination: {
                    total: totalLeads,
                    page: pageNum,
                    limit: limitNum,
                    totalPages: totalPages
                }
            },
            message: 'Leads retrieved successfully'
        });
    }
    catch (error) {
        next(error);
    }
};
exports.getLeads = getLeads;
/**
 * @desc    Get a single lead by ID
 * @route   GET /api/leads/:id
 * @access  Private
 */
const getLeadById = async (req, res, next) => {
    try {
        const lead = await Lead_1.Lead.findById(req.params.id).populate('createdBy', 'name email role');
        if (!lead) {
            res.status(404).json({
                success: false,
                data: null,
                message: `Lead with ID ${req.params.id} not found`
            });
            return;
        }
        res.status(200).json({
            success: true,
            data: lead,
            message: 'Lead retrieved successfully'
        });
    }
    catch (error) {
        next(error);
    }
};
exports.getLeadById = getLeadById;
/**
 * @desc    Update a lead
 * @route   PUT /api/leads/:id
 * @access  Private
 */
const updateLead = async (req, res, next) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        res.status(400).json({
            success: false,
            data: null,
            message: errors.array().map(e => e.msg).join(', ')
        });
        return;
    }
    const { name, email, status, source } = req.body;
    try {
        const lead = await Lead_1.Lead.findById(req.params.id);
        if (!lead) {
            res.status(404).json({
                success: false,
                data: null,
                message: `Lead with ID ${req.params.id} not found`
            });
            return;
        }
        // Update fields if provided
        if (name !== undefined)
            lead.name = name;
        if (email !== undefined)
            lead.email = email;
        if (status !== undefined)
            lead.status = status;
        if (source !== undefined)
            lead.source = source;
        const updatedLead = await lead.save();
        res.status(200).json({
            success: true,
            data: updatedLead,
            message: 'Lead updated successfully'
        });
    }
    catch (error) {
        next(error);
    }
};
exports.updateLead = updateLead;
/**
 * @desc    Delete a lead (Admin only)
 * @route   DELETE /api/leads/:id
 * @access  Private/Admin
 */
const deleteLead = async (req, res, next) => {
    try {
        const lead = await Lead_1.Lead.findById(req.params.id);
        if (!lead) {
            res.status(404).json({
                success: false,
                data: null,
                message: `Lead with ID ${req.params.id} not found`
            });
            return;
        }
        await lead.deleteOne();
        res.status(200).json({
            success: true,
            data: null,
            message: 'Lead deleted successfully'
        });
    }
    catch (error) {
        next(error);
    }
};
exports.deleteLead = deleteLead;
/**
 * @desc    Export all leads as CSV (Admin only)
 * @route   GET /api/leads/export
 * @access  Private/Admin
 */
const exportLeadsCSV = async (req, res, next) => {
    try {
        // Fetch all leads without limit and populate user info
        const leads = await Lead_1.Lead.find({}).populate('createdBy', 'name email');
        // Setup CSV headers
        const headers = [
            'ID',
            'Name',
            'Email',
            'Status',
            'Source',
            'Created At',
            'Created By (Name)',
            'Created By (Email)'
        ];
        // Format utility to escape CSV values
        const escapeCSVValue = (val) => {
            if (val === null || val === undefined)
                return '';
            let cleanVal = String(val).replace(/"/g, '""');
            if (cleanVal.includes(',') ||
                cleanVal.includes('"') ||
                cleanVal.includes('\n') ||
                cleanVal.includes('\r')) {
                cleanVal = `"${cleanVal}"`;
            }
            return cleanVal;
        };
        // Construct CSV Rows
        const rows = leads.map(lead => [
            lead._id.toString(),
            lead.name,
            lead.email,
            lead.status,
            lead.source,
            lead.createdAt ? lead.createdAt.toISOString() : '',
            lead.createdBy?.name || 'N/A',
            lead.createdBy?.email || 'N/A'
        ]);
        const csvContent = [
            headers.join(','),
            ...rows.map(row => row.map(escapeCSVValue).join(','))
        ].join('\r\n');
        // Send downloadable response
        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', 'attachment; filename=leads.csv');
        res.status(200).send(csvContent);
    }
    catch (error) {
        next(error);
    }
};
exports.exportLeadsCSV = exportLeadsCSV;
