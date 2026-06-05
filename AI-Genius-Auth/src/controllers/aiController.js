
const getFreeModel = (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'Free AI model accessed successfully.',
    data: {
      model: 'ai-genius-free-v1',
      result: 'Hello! I am the free-tier AI model. Limited but functional.',
      accessedBy: { email: req.user.email, role: req.user.role },
    },
  });
};


const postPremiumModel = (req, res) => {
  const { prompt } = req.body;

  res.status(200).json({
    status: 'success',
    message: 'Premium AI model accessed successfully.',
    data: {
      model: 'ai-genius-premium-v3',
      prompt: prompt || '(no prompt provided)',
      result:
        'Premium response: Advanced text generation with 32k context window activated. Your role grants full access to GPT-4 and DALL·E 3 capabilities.',
      accessedBy: { email: req.user.email, role: req.user.role },
    },
  });
};


const purgeCache = (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'AI model cache purged successfully.',
    data: {
      action: 'CACHE_PURGED',
      itemsCleared: 1423,
      purgedBy: { email: req.user.email, role: req.user.role },
      timestamp: new Date().toISOString(),
    },
  });
};

module.exports = { getFreeModel, postPremiumModel, purgeCache };