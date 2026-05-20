import { Router } from 'express';
import { body, query } from 'express-validator';
import { protect } from '../middleware/auth';
import { authorize } from '../middleware/rbac';
import {
  createLead,
  getLeads,
  getLeadById,
  updateLead,
  deleteLead,
  exportLeadsCSV
} from '../controllers/leadController';

const router = Router();

// Apply auth middleware to protect all routes under /api/leads
router.use(protect);

// @route   GET /api/leads/export
// @desc    Export all leads to CSV
// @access  Private/Admin
// NOTE: This must sit above /:id to avoid matching export as an ID param
router.get('/export', authorize('admin'), exportLeadsCSV);

// @route   POST /api/leads
// @desc    Create a lead
// @access  Private
router.post(
  '/',
  [
    body('name').trim().notEmpty().withMessage('Lead name is required'),
    body('email').isEmail().withMessage('Please enter a valid email address').normalizeEmail(),
    body('source')
      .isIn(['Website', 'Instagram', 'Referral'])
      .withMessage('Source must be either Website, Instagram, or Referral'),
    body('status')
      .optional()
      .isIn(['New', 'Contacted', 'Qualified', 'Lost'])
      .withMessage('Status must be either New, Contacted, Qualified, or Lost')
  ],
  createLead
);

// @route   GET /api/leads
// @desc    Get all leads with filters, pagination, sort, search
// @access  Private
router.get(
  '/',
  [
    query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
    query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be a positive integer up to 100'),
    query('status')
      .optional()
      .isIn(['New', 'Contacted', 'Qualified', 'Lost'])
      .withMessage('Status filter must be either New, Contacted, Qualified, or Lost'),
    query('source')
      .optional()
      .isIn(['Website', 'Instagram', 'Referral'])
      .withMessage('Source filter must be either Website, Instagram, or Referral'),
    query('sort')
      .optional()
      .isIn(['latest', 'oldest'])
      .withMessage('Sort option must be either latest or oldest')
  ],
  getLeads
);

// @route   GET /api/leads/:id
// @desc    Get single lead by ID
// @access  Private
router.get('/:id', getLeadById);

// @route   PUT /api/leads/:id
// @desc    Update lead by ID
// @access  Private
router.put(
  '/:id',
  [
    body('name').optional().trim().notEmpty().withMessage('Lead name cannot be empty'),
    body('email').optional().isEmail().withMessage('Please enter a valid email address').normalizeEmail(),
    body('source')
      .optional()
      .isIn(['Website', 'Instagram', 'Referral'])
      .withMessage('Source must be either Website, Instagram, or Referral'),
    body('status')
      .optional()
      .isIn(['New', 'Contacted', 'Qualified', 'Lost'])
      .withMessage('Status must be either New, Contacted, Qualified, or Lost')
  ],
  updateLead
);

// @route   DELETE /api/leads/:id
// @desc    Delete lead by ID
// @access  Private/Admin
router.delete('/:id', authorize('admin'), deleteLead);

export default router;
