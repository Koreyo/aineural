// 各服务商的邀请码参数映射
// 格式: { 服务商ID: { param: '参数名', url: '特殊URL（可选）' } }
export const referralConfig = {
  // 智谱AI - 支持邀请码
  zhipu: { param: 'invite_code', url: null },
  
  // 硅基流动 - 支持邀请码
  guicheng: { param: 'referral', url: null },
  
  // 月之暗面 - 支持邀请码
  moonshot: { param: 'invite_code', url: null },
  
  // DeepSeek - 支持邀请码
  deepseek: { param: 'invite_code', url: null },
  
  // 百度智能云 - 邀请码在URL路径中
  baidu: { param: 'invitationCode', url: null, campaignId: '20260225_invitation' },
  
  // 阿里云 - 支持邀请码
  aliyun: { param: 'utm_medium', url: null },
  
  // 火山引擎 - 邀请码参数
  huoshan: { param: 'inviteCode', url: null },
  
  // 腾讯云 - 支持邀请码（需要渠道合作）
  tencent: { param: 'from', url: null },
  
  // 华为云 - 支持邀请码
  huawei: { param: 'InvitationCode', url: null },
  
  // 讯飞星火 - 不支持公开邀请码
  iflytek: { param: null, url: null },
  
  // MiniMax
  minimax: { param: 'referral', url: null },
  
  // 百川智能
  baichuan: { param: 'invite_code', url: null },
  
  // 阶跃星辰
  stepfun: { param: 'referral', url: null },
  
  // OpenAI - Plus/Pro订阅没有邀请码，但有推荐奖励
  openai: { param: null, url: 'https://platform.openai.com/accountbilling?tab=subscriptions' },
  
  // Anthropic - Pro订阅没有邀请码
  anthropic: { param: null, url: null },
  
  // 中转API - 通常支持邀请码
  lingya: { param: 'code', url: null },
  dashen: { param: 'ref', url: null },
  yunwu: { param: 'invite', url: null },
};

/**
 * 构建带有邀请码的购买链接
 * @param {string} providerId - 服务商ID
 * @param {string} buyUrl - 原始购买URL
 * @param {string} referralCode - 邀请码
 * @param {string} referralLink - 自定义分享链接（完整URL）
 * @returns {string} 带有邀请码的URL
 */
export function buildAffiliateUrl(providerId, buyUrl, referralCode, referralLink) {
  // 优先级1: 自定义分享链接（完整URL）
  if (referralLink && (referralLink.startsWith('http://') || referralLink.startsWith('https://'))) {
    return referralLink;
  }
  
  // 优先级2: 邀请码 + 默认URL
  if (!referralCode) {
    return buyUrl;
  }
  
  const config = referralConfig[providerId];
  
  // 如果有特殊URL配置，使用特殊URL
  if (config?.url) {
    return config.url;
  }
  
  // 如果不支持邀请码，直接返回原URL
  if (!config?.param) {
    return buyUrl;
  }
  
  try {
    const url = new URL(buyUrl);
    
    // 根据服务商设置对应的参数
    url.searchParams.set(config.param, referralCode);
    
    // 额外的参数（如campaignId）
    if (config.campaignId) {
      url.searchParams.set('campaignId', config.campaignId);
    }
    
    // 同时尝试设置一些通用参数（提高兼容性）
    url.searchParams.set('ref', referralCode);
    url.searchParams.set('source', 'tokenhub');
    
    return url.toString();
  } catch (e) {
    console.error('构建Affiliate URL失败:', e);
    return buyUrl;
  }
}