import { useState, useEffect } from 'react';
import { callFunction } from '../lib/api';

// 生成随机昵称
function generateNickname() {
  const prefixes = ['AI达人', ' coder', '开发者', '极客', '探索者', '追光者', '筑梦师', '数据匠', '算法家', '未来派'];
  const suffixes = ['007', '888', '666', '520', '2024', 'Pro', 'Plus', 'Max', 'Lite', 'Vip'];
  const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
  const suffix = suffixes[Math.floor(Math.random() * suffixes.length)];
  return prefix + suffix + Math.floor(Math.random() * 100);
}

// 获取或创建用户ID
function getUserId() {
  let userId = localStorage.getItem('tokenhub_userid');
  if (!userId) {
    userId = 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    localStorage.setItem('tokenhub_userid', userId);
  }
  return userId;
}

// 获取或创建昵称
function getNickname() {
  let nickname = localStorage.getItem('tokenhub_nickname');
  if (!nickname) {
    nickname = generateNickname();
    localStorage.setItem('tokenhub_nickname', nickname);
  }
  return nickname;
}

export default function CommentSection({ providerId, providerName, onClose, isAdmin = false }) {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [newComment, setNewComment] = useState({ userName: '', rating: 5, content: '' });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const userId = getUserId();

  useEffect(() => {
    // 自动填充昵称
    setNewComment(prev => ({
      ...prev,
      userName: getNickname()
    }));
    fetchComments();
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

  async function handleSubmit(e) {
    e.preventDefault();
    if (!newComment.content.trim()) {
      setError('请输入评论内容');
      return;
    }
    
    // 保存昵称
    if (newComment.userName) {
      localStorage.setItem('tokenhub_nickname', newComment.userName);
    }
    
    setSubmitting(true);
    setError('');
    const result = await callFunction('addComment', { 
      providerId, 
      userName: newComment.userName || getNickname(), 
      rating: newComment.rating, 
      content: newComment.content 
    });
    setSubmitting(false);
    
    if (result?.success) {
      setNewComment({ userName: getNickname(), rating: 5, content: '' });
      setShowForm(false);
      await fetchComments();
    } else {
      setError('评论失败，请重试');
    }
  }

  async function handleVote(commentId, voteType) {
    const userVotes = JSON.parse(localStorage.getItem('tokenhub_votes') || '{}');
    const voteKey = `${providerId}_${commentId}`;
    
    // 检查是否已经投过
    if (userVotes[voteKey]?.includes(voteType)) {
      alert('你已经在评论区投过票了');
      return;
    }
    
    const result = await callFunction('voteComment', { 
      commentId, 
      voteType,
      userId 
    });
    
    if (result?.success) {
      // 记录投票
      if (!userVotes[voteKey]) {
        userVotes[voteKey] = [];
      }
      userVotes[voteKey].push(voteType);
      localStorage.setItem('tokenhub_votes', JSON.stringify(userVotes));
      
      await fetchComments();
    }
  }

  const getUserVotes = (commentId) => {
    const userVotes = JSON.parse(localStorage.getItem('tokenhub_votes') || '{}');
    return userVotes[`${providerId}_${commentId}`] || [];
  };

  const renderStars = (rating) => {
    return '★'.repeat(rating) + '☆'.repeat(5 - rating);
  };

  // 按热度排序（点赞-踩）
  const sortedComments = [...comments].sort((a, b) => {
    const scoreA = (a.likes || 0) - (a.dislikes || 0);
    const scoreB = (b.likes || 0) - (b.dislikes || 0);
    return scoreB - scoreA;
  });

  return (
    <div className="border-t border-gray-200 bg-gradient-to-b from-gray-50 to-white p-4">
      <div className="flex items-center justify-between mb-3">
        <h4 className="font-semibold text-gray-800 text-sm">
          💬 {providerName} 的评论 ({comments.length})
        </h4>
        <div className="flex items-center gap-2">
          <button 
            onClick={() => setShowForm(!showForm)}
            className="text-xs text-[#0D9488] hover:text-[#0F766E] font-medium transition-colors"
          >
            {showForm ? '取消评论' : '发表评论'}
          </button>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-sm ml-2">✕</button>
        </div>
      </div>

      {/* Comment Form - 紧凑模式 */}
      {showForm && (
        <form onSubmit={handleSubmit} className="mb-3 p-3 bg-white rounded-lg border border-gray-200 shadow-sm">
          <div className="flex gap-2 mb-2">
            <input
              type="text"
              placeholder="昵称"
              value={newComment.userName}
              onChange={(e) => setNewComment({ ...newComment, userName: e.target.value })}
              className="flex-1 px-3 py-1.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#0D9488] focus:ring-1 focus:ring-[#0D9488]"
            />
            <select
              value={newComment.rating}
              onChange={(e) => setNewComment({ ...newComment, rating: Number(e.target.value) })}
              className="px-2 py-1.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#0D9488]"
            >
              <option value={5}>★★★★★</option>
              <option value={4}>★★★★☆</option>
              <option value={3}>★★★☆☆</option>
              <option value={2}>★★☆☆☆</option>
              <option value={1}>★☆☆☆☆</option>
            </select>
          </div>
          <textarea
            placeholder="分享你的使用体验..."
            value={newComment.content}
            onChange={(e) => setNewComment({ ...newComment, content: e.target.value })}
            className="w-full px-3 py-1.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#0D9488] focus:ring-1 focus:ring-[#0D9488] resize-none"
            rows={2}
          />
          {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
          <div className="flex justify-end mt-2">
            <button
              type="submit"
              disabled={submitting}
              className="px-4 py-1.5 bg-gradient-to-r from-[#0D9488] to-[#0F766E] text-white text-xs font-medium rounded-lg hover:opacity-90 disabled:opacity-50 transition-opacity"
            >
              {submitting ? '提交中...' : '发布评论'}
            </button>
          </div>
        </form>
      )}

      {/* Comments List - 按热度排序 */}
      {loading ? (
        <div className="text-center py-4 text-gray-400 text-sm">加载中...</div>
      ) : sortedComments.length === 0 ? (
        <div className="text-center py-4 text-gray-400 text-sm">暂无评论，快来抢先评价吧！</div>
      ) : (
        <div className="space-y-2 max-h-48 overflow-y-auto scrollbar-thin">
          {sortedComments.slice(0, 5).map((comment) => {
            const userVotes = getUserVotes(comment._id || comment.id);
            return (
              <div key={comment._id || comment.id} className="p-3 bg-white rounded-lg border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-gray-900 text-xs">
                      {comment.userName || '匿名用户'}
                    </span>
                    <span className="text-orange-400 text-xs">{renderStars(comment.rating)}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    {/* 点赞 */}
                    <button 
                      onClick={() => handleVote(comment._id || comment.id, 'like')}
                      className={`flex items-center gap-1 text-xs transition-colors ${
                        userVotes.includes('like') ? 'text-[#0D9488]' : 'text-gray-400 hover:text-[#0D9488]'
                      }`}
                    >
                      <span>👍</span>
                      <span className={comment.likes > 0 ? 'text-[#0D9488] font-medium' : ''}>{comment.likes || 0}</span>
                    </button>
                    {/* 踩 */}
                    <button 
                      onClick={() => handleVote(comment._id || comment.id, 'dislike')}
                      className={`flex items-center gap-1 text-xs transition-colors ${
                        userVotes.includes('dislike') ? 'text-red-500' : 'text-gray-400 hover:text-red-500'
                      }`}
                    >
                      <span>👎</span>
                      <span className={comment.dislikes > 0 ? 'text-red-500 font-medium' : ''}>{comment.dislikes || 0}</span>
                    </button>
                    {/* 删除 - 仅管理员 */}
                    {isAdmin && (
                      <button 
                        onClick={() => handleDelete(comment._id || comment.id)}
                        className="text-xs text-red-400 hover:text-red-600"
                      >
                        删除
                      </button>
                    )}
                  </div>
                </div>
                <p className="text-gray-600 text-xs leading-relaxed line-clamp-2">{comment.content}</p>
                <p className="text-gray-300 text-xs mt-1">
                  {comment.createdAt ? new Date(comment.createdAt).toLocaleDateString('zh-CN') : ''}
                </p>
              </div>
            );
          })}
          {sortedComments.length > 5 && (
            <p className="text-center text-xs text-gray-400 py-2">还有 {sortedComments.length - 5} 条评论 ↓</p>
          )}
        </div>
      )}
    </div>
  );
}

async function handleDelete(commentId) {
  if (!confirm('确定要删除这条评论吗？')) return;
  const result = await callFunction('deleteComment', { commentId });
  if (result?.success) {
    window.location.reload();
  }
}