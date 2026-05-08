const axios = require('axios');
const config = require('../config/env');

async function getAIPrediction(method, payload) {
  try {
    const response = await axios.post(config.aiModel.url, {
      user_id: "user_" + Date.now(),
      method: method,
      payload: payload
    });

    if (response.data && response.data.status === 'success') {
      return response.data.data;
    }
    throw new Error('AI API returned error status');
  } catch (error) {
    console.error(' [AI Service Error]:', error.message);
    throw error;
  }
}

module.exports = {
  getAIPrediction
};
