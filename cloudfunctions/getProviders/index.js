const cloudbase = require('@cloudbase/node-sdk');

const app = cloudbase.init({
  env: cloudbase.SYMBOL_CURRENT_ENV,
});

const db = app.database();

// 调试日志
function log(msg, data) {
  console.log(msg, JSON.stringify(data, null, 2));
}

// 获取action - 支持多种传入方式
function getAction(event) {
  // 1. 直接在event.action
  if (event.action) return event.action;
  // 2. 在event.body中
  if (event.body) {
    try {
      const body = typeof event.body === 'string' ? JSON.parse(event.body) : event.body;
      if (body.action) return body.action;
    } catch (e) {}
  }
  // 3. 在HTTP query string中
  if (event.openpath) {
    const path = event.openpath.split('?');
    if (path[1]) {
      const params = new URLSearchParams(path[1]);
      if (params.get('action')) return params.get('action');
    }
  }
  // 4. 在event.queryStringParameters
  if (event.queryStringParameters?.action) return event.queryStringParameters.action;
  
  return undefined;
}

// 获取所有参数
function getParams(event) {
  let params = { ...event };
  if (event.body) {
    try {
      const body = typeof event.body === 'string' ? JSON.parse(event.body) : event.body;
      params = { ...params, ...body };
    } catch (e) {
      log('Parse body error:', e);
    }
  }
  // 移除不必要的字段
  delete params.action;
  delete params.body;
  delete params.__req__;
  delete params.context;
  return params;
}

exports.main = async (event, context) => {
  log('Received event keys:', Object.keys(event));
  log('Event:', event);
  
  const action = getAction(event);
  const params = getParams(event);
  
  log('Parsed action:', action);
  log('Parsed params:', params);

  switch (action) {
    case 'getProviders': {
      try {
        const res = await db.collection('providers').get();
        log('Providers count:', res.data.length);
        
        // 去重：按id分组，只保留第一条
        const uniqueMap = new Map();
        for (const item of res.data) {
          if (!uniqueMap.has(item.id)) {
            uniqueMap.set(item.id, item);
          }
        }
        const uniqueData = Array.from(uniqueMap.values());
        
        log('Unique providers:', uniqueData.length);
        return { success: true, data: uniqueData };
      } catch (e) {
        log('getProviders error:', e.message);
        return { success: false, error: e.message };
      }
    }
    case 'getSettings': {
      const res = await db.collection('settings').limit(1).get();
      return { success: true, data: res.data[0] || {} };
    }
    case 'updateReferralCode': {
      const { providerId, code } = params;
      const existing = await db.collection('settings').limit(1).get();
      // 判断是完整URL还是邀请码
      const isFullUrl = code && (code.startsWith('http://') || code.startsWith('https://'));
      const field = isFullUrl ? `referralLinks.${providerId}` : `referralCodes.${providerId}`;
      if (existing.data.length > 0) {
        await db.collection('settings').doc(existing.data[0]._id).update({
          [field]: code,
        });
      } else {
        const data = {};
        data[field] = code;
        await db.collection('settings').add(data);
      }
      return { success: true, isFullUrl };
    }
    case 'updateReferralLink': {
      const { providerId, link } = params;
      const existing = await db.collection('settings').limit(1).get();
      if (existing.data.length > 0) {
        await db.collection('settings').doc(existing.data[0]._id).update({
          [`referralLinks.${providerId}`]: link,
        });
      } else {
        await db.collection('settings').add({
          referralLinks: { [providerId]: link },
        });
      }
      return { success: true };
    }
    case 'getComments': {
      const { providerId } = params;
      const res = await db.collection('comments').where({ providerId }).orderBy('createdAt', 'desc').get();
      return { success: true, data: res.data };
    }
    case 'addComment': {
      const { providerId, userName, rating, content } = params;
      await db.collection('comments').add({
        providerId,
        userName: userName || '匿名用户',
        rating,
        content,
        likes: 0,
        dislikes: 0,
        voters: [],
        createdAt: new Date().toISOString(),
      });
      return { success: true };
    }
    case 'voteComment': {
      const { commentId, voteType, userId } = params;
      try {
        const comment = await db.collection('comments').doc(commentId).get();
        if (!comment.data[0]) {
          return { success: false, message: '评论不存在' };
        }
        const voters = comment.data[0].voters || [];
        if (voters.some(v => v.userId === userId && v.type === voteType)) {
          return { success: false, message: '你已经投过票了' };
        }
        const updateData = {
          voters: [...voters, { userId, type: voteType, createdAt: new Date().toISOString() }]
        };
        updateData[voteType === 'like' ? 'likes' : 'dislikes'] = db.command.inc(1);
        await db.collection('comments').doc(commentId).update(updateData);
        return { success: true };
      } catch (e) {
        log('voteComment error:', e.message);
        return { success: false, error: e.message };
      }
    }
    case 'deleteComment': {
      const { commentId } = params;
      await db.collection('comments').doc(commentId).remove();
      return { success: true };
    }
    case 'updateProviderUrl': {
    }
    case 'deleteProvider': {
      const { providerId } = params;
      if (!providerId) {
        return { success: false, error: 'providerId required' };
      }
      // 先查询匹配的记录
      const res = await db.collection('providers').where({ id: providerId }).get();
      if (res.data.length === 0) {
        return { success: false, error: 'Provider not found' };
      }
      // 删除除了第一个之外的所有记录
      let deleted = 0;
      for (let i = 1; i < res.data.length; i++) {
        await db.collection('providers').doc(res.data[i]._id).remove();
        deleted++;
      }
      return { success: true, deleted };
    }
      const { providerId, buyUrl } = params;
    }
    case 'deleteProvider': {
      const { providerId } = params;
      if (!providerId) {
        return { success: false, error: 'providerId required' };
      }
      // 先查询匹配的记录
      const res = await db.collection('providers').where({ id: providerId }).get();
      if (res.data.length === 0) {
        return { success: false, error: 'Provider not found' };
      }
      // 删除除了第一个之外的所有记录
      let deleted = 0;
      for (let i = 1; i < res.data.length; i++) {
        await db.collection('providers').doc(res.data[i]._id).remove();
        deleted++;
      }
      return { success: true, deleted };
    }
      const res = await db.collection('providers').where({ id: providerId }).get();
      if (res.data.length > 0) {
        for (const doc of res.data) {
          await db.collection('providers').doc(doc._id).update({ buyUrl });
        }
        return { success: true, updated: res.data.length };
      }
      return { success: false, message: 'Provider not found' };
    }
    default:
      log('Unknown action, event:', event);
      return { success: false, message: 'Unknown action: ' + action };
  }
};