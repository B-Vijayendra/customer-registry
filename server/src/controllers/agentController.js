const User = require('../models/User');
const Agent = require('../models/Agent');
const Complaint = require('../models/Complaint');
const { success, fail } = require('../utils/responseFormatter');

// @desc    Get all agents (admin) - includes workload counts
// @route   GET /api/agents
// @access  Private (admin)
const getAgents = async (req, res, next) => {
  try {
    const agents = await Agent.find()
      .populate('userId', 'name email avatar phone isActive')
      .lean();

    const withCounts = await Promise.all(
      agents.map(async (agent) => {
        const openCount = await Complaint.countDocuments({
          agentId: agent.userId?._id,
          status: { $in: ['open', 'in_progress'] },
        });
        return { ...agent, openComplaintsCount: openCount };
      })
    );

    return success(res, 200, 'Agents fetched', { agents: withCounts });
  } catch (err) {
    next(err);
  }
};

// @desc    Update agent availability/department (admin or self)
// @route   PUT /api/agents/:id
// @access  Private
const updateAgent = async (req, res, next) => {
  try {
    const { department, isAvailable } = req.body;
    const agent = await Agent.findOne({ userId: req.params.id });
    if (!agent) return fail(res, 404, 'Agent not found');

    if (req.user.role !== 'admin' && String(req.user._id) !== req.params.id) {
      return fail(res, 403, 'You cannot update this agent');
    }

    if (department !== undefined) agent.department = department;
    if (typeof isAvailable === 'boolean') agent.isAvailable = isAvailable;
    await agent.save();

    return success(res, 200, 'Agent updated', { agent });
  } catch (err) {
    next(err);
  }
};

module.exports = { getAgents, updateAgent };
