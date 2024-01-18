// src/lib/api.js
export async function request(endpoint, method = 'GET', data = null) {
    const config = {
      method,
      headers: {
        'Content-Type': 'application/json',
      },
    };
  
    if (data) {
      config.body = JSON.stringify(data);
    }
  
    const response = await fetch(endpoint, config);
  
    if (!response.ok) {
      throw new Error(`Error: ${response.status} - ${response.statusText}`);
    }
  
    return await response.json();
  }
  