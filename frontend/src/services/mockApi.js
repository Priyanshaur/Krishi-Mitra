// Mock API service for testing diagnosis functionality
const mockApi = {
  // Mock diagnosis function that simulates ML service response
  diagnose: async (formData) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Return mock diagnosis result
    return {
      data: {
        id: 'mock-diagnosis-123',
        userId: 'mock-user-456',
        imageUrl: '/mock-image.jpg',
        cropType: formData.get('cropType') || 'tomato',
        prediction: {
          disease: 'Early Blight',
          confidence: 0.92,
          scientificName: 'Alternaria solani',
          commonName: 'Early Blight'
        },
        recommendations: {
          treatment: 'Remove affected leaves and apply fungicide. Ensure proper spacing between plants for air circulation.',
          prevention: 'Practice crop rotation and avoid overhead watering. Remove plant debris from previous seasons.',
          organicRemedies: ['Neem oil spray (2%)', 'Baking soda solution (1 tbsp per gallon)', 'Garlic-chili spray'],
          chemicalTreatments: ['Chlorothalonil', 'Mancozeb', 'Copper-based fungicides']
        },
        severity: 'medium',
        status: 'processed',
        notes: formData.get('notes') || '',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    };
  },
  
  // Mock health check
  healthCheck: async () => {
    return {
      status: 'ok',
      services: {
        ml: 'connected',
        database: 'connected',
        api: 'running'
      }
    };
  }
};

export default mockApi;