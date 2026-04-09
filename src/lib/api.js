// 使用 HTTP API 调用云函数
const API_BASE = '/api/';

export async function callFunction(action, params = {}) {
  try {
    const response = await fetch(API_BASE, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ action, ...params }),
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('调用云函数失败:', error);
    return { success: false, error: error.message };
  }
}

export async function getProviders() {
  const result = await callFunction('getProviders');
  return result?.data || [];
}

export async function getSettings() {
  const result = await callFunction('getSettings');
  return result?.data || {};
}

export async function updateReferralCode(providerId, code) {
  const result = await callFunction('updateReferralCode', { providerId, code });
  return result?.success;
}

export async function getComments(providerId) {
  const result = await callFunction('getComments', { providerId });
  return result?.data || [];
}

export async function addComment(providerId, userName, rating, content) {
  const result = await callFunction('addComment', { providerId, userName, rating, content });
  return result?.success;
}

export async function voteComment(commentId, voteType, userId) {
  const result = await callFunction('voteComment', { commentId, voteType, userId });
  return result;
}

export async function deleteComment(commentId) {
  const result = await callFunction('deleteComment', { commentId });
  return result?.success;
}