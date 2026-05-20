"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const express_validator_1 = require("express-validator");
const auth_1 = require("../middleware/auth");
const rbac_1 = require("../middleware/rbac");
const leadController_1 = require("../controllers/leadController");
const router = (0, express_1.Router)();
// Apply auth middleware to protect all routes under /api/leads
router.use(auth_1.protect);
// @route   GET /api/leads/export
// @desc    Export all leads to CSV
// @access  Private/Admin
// NOTE: This must sit above /:id to avoid matching export as an ID param
router.get('/export', (0, rbac_1.authorize)('admin'), leadController_1.exportLeadsCSV);
// @route   POST /api/leads
// @desc    Create a lead
// @access  Private
router.post('/', [
    (0, express_validator_1.body)('name').trim().notEmpty().withMessage('Lead name is required'),
    (0, express_validator_1.body)('email').isEmail().withMessage('Please enter a valid email address').normalizeEmail(),
    (0, express_validator_1.body)('source')
        .isIn(['Website', 'Instagram', 'Referral'])
        .withMessage('Source must be either Website, Instagram, or Referral'),
    (0, express_validator_1.body)('status')
        .optional()
        .isIn(['New', 'Contacted', 'Qualified', 'Lost'])
        .withMessage('Status must be either New, Contacted, Qualified, or Lost')
], leadController_1.createLead);
// @route   GET /api/leads
// @desc    Get all leads with filters, pagination, sort, search
// @access  Private
router.get('/', [
    (0, express_validator_1.query)('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
    (0, express_validator_1.query)('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be a positive integer up to 100'),
    (0, express_validator_1.query)('status')
        .optional()
        .isIn(['New', 'Contacted', 'Qualified', 'Lost'])
        .withMessage('Status filter must be either New, Contacted, Qualified, or Lost'),
    (0, express_validator_1.query)('source')
        .optional()
        .isIn(['Website', 'Instagram', 'Referral'])
        .withMessage('Source filter must be either Website, Instagram, or Referral'),
    (0, express_validator_1.query)('sort')
        .optional()
        .isIn(['latest', 'oldest'])
        .withMessage('Sort option must be either latest or oldest')
], leadController_1.getLeads);
// @route   GET /api/leads/:id
// @desc    Get single lead by ID
// @access  Private
router.get('/:id', leadController_1.getLeadById);
// @route   PUT /api/leads/:id
// @desc    Update lead by ID
// @access  Private
router.put('/:id', [
    (0, express_validator_1.body)('name').optional().trim().notEmpty().withMessage('Lead name cannot be empty'),
    (0, express_validator_1.body)('email').optional().isEmail().withMessage('Please enter a valid email address').normalizeEmail(),
    (0, express_validator_1.body)('source')
        .optional()
        .isIn(['Website', 'Instagram', 'Referral'])
        .withMessage('Source must be either Website, Instagram, or Referral'),
    (0, express_validator_1.body)('status')
        .optional()
        .isIn(['New', 'Contacted', 'Qualified', 'Lost'])
        .withMessage('Status must be either New, Contacted, Qualified, or Lost')
], leadController_1.updateLead);
// @route   DELETE /api/leads/:id
// @desc    Delete lead by ID
// @access  Private/Admin
router.delete('/:id', (0, rbac_1.authorize)('admin'), leadController_1.deleteLead);
exports.default = router;
