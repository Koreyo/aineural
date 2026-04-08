import { useState, useEffect } from 'react';
import { callFunction } from '../lib/api';

export function useProviders() {
  const [providers, setProviders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchProviders();
  }, []);

  async function fetchProviders() {
    try {
      const result = await callFunction('getProviders');
      if (result?.success && result?.data) {
        // 按 id 去重，保留第一个
        const uniqueMap = new Map();
        result.data.forEach(p => {
          if (!uniqueMap.has(p.id)) {
            uniqueMap.set(p.id, p);
          }
        });
        setProviders(Array.from(uniqueMap.values()));
      } else {
        setError(result?.error || 'Unknown error');
      }
    } catch (err) {
      console.error('获取服务商失败:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return { providers, loading, error, refetch: fetchProviders };
}

export function useSettings() {
  const [settings, setSettings] = useState({ referralCodes: {}, referralLinks: {} });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSettings();
  }, []);

  async function fetchSettings() {
    try {
      const result = await callFunction('getSettings');
      if (result?.success) {
        setSettings(result.data || {});
      }
    } catch (err) {
      console.error('获取设置失败:', err);
    } finally {
      setLoading(false);
    }
  }

  async function updateCode(providerId, code) {
    try {
      const result = await callFunction('updateReferralCode', { providerId, code });
      if (result?.success) {
        await fetchSettings();
        return true;
      }
      return false;
    } catch (err) {
      console.error('更新邀请码失败:', err);
      return false;
    }
  }

  async function updateLink(providerId, link) {
    try {
      const result = await callFunction('updateReferralLink', { providerId, link });
      if (result?.success) {
        await fetchSettings();
        return true;
      }
      return false;
    } catch (err) {
      console.error('更新分享链接失败:', err);
      return false;
    }
  }

  return { settings, loading, updateReferralCode: updateCode, updateReferralLink: updateLink, refetch: fetchSettings };
}

export function useComments(providerId) {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (providerId) {
      fetchComments();
    }
  }, [providerId]);

  async function fetchComments() {
    try {
      const result = await callFunction('getComments', { providerId });
      if (result?.success) {
        setComments(result.data || []);
      }
    } catch (err) {
      console.error('获取评论失败:', err);
    } finally {
      setLoading(false);
    }
  }

  async function add(data) {
    try {
      const result = await callFunction('addComment', { providerId, ...data });
      if (result?.success) {
        await fetchComments();
        return true;
      }
      return false;
    } catch (err) {
      console.error('添加评论失败:', err);
      return false;
    }
  }

  async function vote(commentId, voteType, userId) {
    try {
      const result = await callFunction('voteComment', { commentId, voteType, userId });
      return result;
    } catch (err) {
      console.error('投票失败:', err);
      return { success: false };
    }
  }

  return { comments, loading, addComment: add, voteComment: vote, refetch: fetchComments };
}