import { BASE_URL } from './ApiEndpoints';

// Get chat messages for a specific order
export const getChatMessages = async (orderId) => {
  try {
    // Get token from localStorage or Redux store
    let token = localStorage.getItem('auth_token');
    
    if (!token) {
      try {
        const store = window.__REDUX_STORE__ || (window.store && window.store.getState());
        if (store && store.auth && store.auth.user && store.auth.user.token) {
          token = store.auth.user.token;
        }
      } catch (error) {
        console.warn('Could not access Redux store:', error);
      }
    }

    console.log('Fetching chat messages for order:', orderId);
    console.log('Using token:', token ? 'Token found' : 'No token found');

    const response = await fetch(`${BASE_URL}/api/v1/chat/${orderId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });

    console.log('Chat messages API response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Chat messages API error:', errorText);
      throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
    }

    const data = await response.json();
    console.log('Chat messages fetched successfully:', data);
    return data;
  } catch (error) {
    console.error('Error fetching chat messages:', error);
    throw error;
  }
};

// Send chat message via API (backup method)
export const sendChatMessage = async (orderId, message, userId = 'staff') => {
  try {
    let token = localStorage.getItem('auth_token');
    
    if (!token) {
      try {
        const store = window.__REDUX_STORE__ || (window.store && window.store.getState());
        if (store && store.auth && store.auth.user && store.auth.user.token) {
          token = store.auth.user.token;
        }
      } catch (error) {
        console.warn('Could not access Redux store:', error);
      }
    }

    console.log('Sending chat message via API:', { orderId, message, userId });

    const response = await fetch(`${BASE_URL}/api/v1/chat/${orderId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        orderId: orderId,
        userId: userId,
        message: message,
        timestamp: new Date().toISOString()
      })
    });

    console.log('Send message API response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Send message API error:', errorText);
      throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
    }

    const data = await response.json();
    console.log('Message sent via API successfully:', data);
    return data;
  } catch (error) {
    console.error('Error sending chat message via API:', error);
    throw error;
  }
};

// Mark messages as read
export const markMessagesAsRead = async (messageIds) => {
  try {
    let token = localStorage.getItem('auth_token');
    
    if (!token) {
      try {
        const store = window.__REDUX_STORE__ || (window.store && window.store.getState());
        if (store && store.auth && store.auth.user && store.auth.user.token) {
          token = store.auth.user.token;
        }
      } catch (error) {
        console.warn('Could not access Redux store:', error);
      }
    }

    console.log('Marking messages as read:', messageIds);

    const response = await fetch(`${BASE_URL}/api/v1/chat/read/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        messageIds: messageIds
      })
    });

    console.log('Mark messages as read API response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Mark messages as read API error:', errorText);
      throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
    }

    const data = await response.json();
    console.log('Messages marked as read successfully:', data);
    return data;
  } catch (error) {
    console.error('Error marking messages as read:', error);
    throw error;
  }
};
