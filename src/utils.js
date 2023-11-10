const fetch = require('node-fetch');

export async function fetchDataFromAPI(apiUrl) {
  try {
    const response = await fetch(apiUrl, {
      method: 'GET',
      credentials: 'include', // Include cookies for session data
    })
    
    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    throw error;
  }
}