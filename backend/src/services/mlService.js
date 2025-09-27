import axios from 'axios';

class MLService {
  constructor() {
    this.baseURL = process.env.ML_SERVICE_URL || 'http://localhost:8000';
    this.client = axios.create({
      baseURL: this.baseURL,
      timeout: 30000
    });
  }

  async predictDisease(imageBuffer, cropType = 'tomato') {
    try {
      const formData = new FormData();
      const blob = new Blob([imageBuffer], { type: 'image/jpeg' });
      formData.append('image', blob, 'image.jpg');
      formData.append('crop_type', cropType);

      const response = await this.client.post('/predict', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      return response.data;
    } catch (error) {
      console.error('ML Service Error:', error.message);
      throw new Error('Disease prediction service is temporarily unavailable');
    }
  }

  async getRecommendations(disease, cropType) {
    try {
      const response = await this.client.get('/recommendations', {
        params: { disease, crop_type: cropType }
      });

      return response.data;
    } catch (error) {
      console.error('ML Recommendations Error:', error.message);
      return this.getFallbackRecommendations(disease, cropType);
    }
  }

  getFallbackRecommendations(disease, cropType) {
    // Fallback recommendations if ML service is down
    const recommendations = {
      general: [
        'Remove and destroy infected plant parts',
        'Ensure proper spacing for air circulation',
        'Avoid overhead watering',
        'Practice crop rotation'
      ],
      organic: [
        'Use neem oil spray',
        'Apply baking soda solution',
        'Use garlic or chili spray'
      ]
    };

    return {
      disease,
      cropType,
      recommendations,
      source: 'fallback'
    };
  }
}

export default new MLService();