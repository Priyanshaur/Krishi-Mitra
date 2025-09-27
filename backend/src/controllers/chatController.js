export const chatWithAI = async (req, res) => {
  try {
    const { message } = req.body;
    
    // Mock AI response (replace with actual AI service)
    const responses = {
      'hello': 'Hello! How can I help you with farming today?',
      'disease': 'For disease diagnosis, please upload an image of the affected leaf.',
      'price': 'Market prices vary. Check the marketplace for current rates.',
      'default': 'I can help with farming advice, disease diagnosis, and market information.'
    };
    
    const response = responses[message.toLowerCase()] || responses.default;
    
    res.json({
      success: true,
      response: response
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error processing chat message'
    });
  }
};