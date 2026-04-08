const cloudbase = require('@cloudbase/node-sdk');

const app = cloudbase.init({
  env: cloudbase.SYMBOL_CURRENT_ENV,
});

const db = app.database();

const providers = [
  {
    id: "anthropic",
    name: "Anthropic",
    logo: "https://upload.wikimedia.org/wikipedia/commons/e/e5/Anthropic_Logo.svg",
    description: "Claude AI 背后的人工智能安全公司",
    features: ["Claude 模型", "安全可靠", "长上下文", "200K 上下文"],
    isOfficial: true,
    referralCode: "",
    buyUrl: "https://console.anthropic.com/settings/plans",
    packages: [
      { name: "API 按量计费 (Claude 3.5 Sonnet)", price: 0, discountPrice: 0, tokenCount: "输入$3/百万 输出$15/百万", badge: "热门", model: "Claude 3.5 Sonnet" },
      { name: "API 按量计费 (Claude 3 Opus)", price: 0, discountPrice: 0, tokenCount: "输入$15/百万 输出$75/百万", badge: "", model: "Claude 3 Opus" },
      { name: "API 按量计费 (Claude 3 Haiku)", price: 0, discountPrice: 0, tokenCount: "输入$0.25/百万 输出$1.25/百万", badge: "", model: "Claude 3 Haiku" },
      { name: "Claude Pro", price: 20, discountPrice: 20, tokenCount: "$20/月，5小时 Claude 3.5", badge: "", model: "Claude Pro" },
    ],
    models: ["Claude 3.5 Sonnet", "Claude 3 Opus", "Claude 3 Haiku"],
    discountInfo: "新用户免费试用"
  },
  {
    id: "zhipu",
    name: "智谱AI",
    logo: "https://www.zhipuai.cn/icon.svg",
    description: "国产自研大模型公司，清华技术",
    features: ["国产自研", "中文优化", "性价比高", "GLM-4", "API 稳定"],
    isOfficial: true,
    referralCode: "",
    buyUrl: "https://open.bigmodel.cn",
    packages: [
      { name: "API 按量计费 (GLM-4)", price: 0, discountPrice: 0, tokenCount: "¥0.1/千token", badge: "热门", model: "GLM-4" },
      { name: "API 按量计费 (GLM-4V)", price: 0, discountPrice: 0, tokenCount: "¥0.3/千token", badge: "", model: "GLM-4V" },
      { name: "API 按量计费 (GLM-3)", price: 0, discountPrice: 0, tokenCount: "¥0.01/千token", badge: "", model: "GLM-3-Turbo" },
      { name: "Plus 会员", price: 49, discountPrice: 49, tokenCount: "¥49/月，100万token", badge: "", model: "Plus 会员" },
      { name: "Pro 会员", price: 199, discountPrice: 199, tokenCount: "¥199/月，1000万token", badge: "", model: "Pro 会员" },
    ],
    models: ["GLM-4", "GLM-4V", "GLM-3-Turbo", "CogView-3"],
    discountInfo: "新用户赠送10万token"
  },
  {
    id: "guicheng",
    name: "硅基流动",
    logo: "https://siliconflow.cn/favicon.ico",
    description: "国内领先的 AI 基础设施提供商",
    features: ["国内可访问", "价格优惠", "中文支持", "响应快", "模型丰富"],
    isOfficial: false,
    referralCode: "",
    buyUrl: "https://siliconflow.cn",
    packages: [
      { name: "免费额度", price: 0, discountPrice: 0, tokenCount: "新人免费", badge: "免费", model: "" },
      { name: "API 按量", price: 0, discountPrice: 0, tokenCount: "按量计费", badge: "", model: "" },
      { name: "会员订阅", price: 29, discountPrice: 29, tokenCount: "¥29/月", badge: "", model: "" },
    ],
    models: ["Qwen2", "DeepSeek", "ChatGLM", "Yi", "Stable Diffusion"],
    discountInfo: "新用户送20元"
  },
  {
    id: "moonshot",
    name: "月之暗面",
    logo: "https://www.moonshot.cn/favicon.ico",
    description: "国产 AI 大模型公司，Kimi 出品",
    features: ["Kimi AI", "长上下文", "中文优化", "200K 上下文"],
    isOfficial: true,
    referralCode: "",
    buyUrl: "https://platform.moonshot.cn",
    packages: [
      { name: "API 按量计费", price: 0, discountPrice: 0, tokenCount: "按量计费", badge: "", model: "" },
      { name: "Kimi+ 会员", price: 49, discountPrice: 49, tokenCount: "¥49/月", badge: "热门", model: "" },
    ],
    models: ["Moonshot-v1"],
    discountInfo: "新用户送15元"
  },
  {
    id: "deepseek",
    name: "DeepSeek",
    logo: "https://deepseek.com/favicon.ico",
    description: "国产开源大模型，性能对标 GPT-4",
    features: ["开源", "API 便宜", "性能强", "Coding 支持", "长上下文"],
    isOfficial: true,
    referralCode: "",
    buyUrl: "https://platform.deepseek.com",
    packages: [
      { name: "API 按量计费 (DeepSeek Coder)", price: 0, discountPrice: 0, tokenCount: "$0.14/百万", badge: "热门", model: "DeepSeek Coder" },
      { name: "API 按量计费 (DeepSeek Chat)", price: 0, discountPrice: 0, tokenCount: "$0.14/百万", badge: "", model: "DeepSeek Chat" },
      { name: "API 按量计费 (DeepSeek VL)", price: 0, discountPrice: 0, tokenCount: "$0.14/百万", badge: "", model: "DeepSeek VL" },
    ],
    models: ["DeepSeek Coder", "DeepSeek Chat", "DeepSeek VL"],
    discountInfo: "新用户送10元"
  },
  {
    id: "baidu",
    name: "百度智能云",
    logo: "https://cloud.baidu.com/favicon.ico",
    description: "百度旗下云计算服务，文心一言",
    features: ["国内官方", "文心一言", "稳定可靠", "ERNIE"],
    isOfficial: true,
    referralCode: "",
    buyUrl: "https://login.bce.baidu.com",
    packages: [
      { name: "API 按量计费 (ERNIE 4.0)", price: 0, discountPrice: 0, tokenCount: "¥120/百万tokens", badge: "", model: "ERNIE 4.0" },
      { name: "API 按量计费 (ERNIE 3.5)", price: 0, discountPrice: 0, tokenCount: "¥12/百万tokens", badge: "", model: "ERNIE 3.5" },
      { name: "API 按量计费 (ERNIE Speed)", price: 0, discountPrice: 0, tokenCount: "免费", badge: "", model: "ERNIE Speed" },
    ],
    models: ["ERNIE 4.0", "ERNIE 3.5", "ERNIE Speed"],
    discountInfo: "新用户送15元"
  },
  {
    id: "aliyun",
    name: "阿里云",
    logo: "https://www.aliyun.com/favicon.ico",
    description: "阿里旗下云计算服务，通义千问",
    features: ["国内官方", "通义千问", "稳定可靠", "Qwen"],
    isOfficial: true,
    referralCode: "",
    buyUrl: "https://help.aliyun.com/document_detail/189944.html",
    packages: [
      { name: "API 按量计费 (Qwen-Turbo)", price: 0, discountPrice: 0, tokenCount: "¥0.008/千tokens", badge: "", model: "Qwen-Turbo" },
      { name: "API 按量计费 (Qwen-Plus)", price: 0, discountPrice: 0, tokenCount: "¥0.04/千tokens", badge: "", model: "Qwen-Plus" },
      { name: "API 按量计费 (Qwen-Max)", price: 0, discountPrice: 0, tokenCount: "¥0.12/千tokens", badge: "热门", model: "Qwen-Max" },
    ],
    models: ["Qwen-Turbo", "Qwen-Plus", "Qwen-Max"],
    discountInfo: "新用户送15元"
  },
  {
    id: "huoshan",
    name: "火山引擎",
    logo: "https://www.volcengine.com/favicon.ico",
    description: "字节跳动旗下云计算服务平台",
    features: ["国内官方", "字节背书", "稳定可靠", "豆包大模型"],
    isOfficial: true,
    referralCode: "",
    buyUrl: "https://www.volcengine.com/docs/829",
    packages: [
      { name: "API 按量计费 (豆包)", price: 0, discountPrice: 0, tokenCount: "¥0.0003/千tokens", badge: "热门", model: "豆包" },
      { name: "API 按量计费", price: 0, discountPrice: 0, tokenCount: "按量计费", badge: "", model: "" },
    ],
    models: ["豆包"],
    discountInfo: "新用户送15元"
  },
  {
    id: "stepfun",
    name: "阶跃星辰",
    logo: "https://www.stepfun.com/favicon.ico",
    description: "国产 AI 大模型公司",
    features: ["Step 系列", "多模态", "中文优化"],
    isOfficial: true,
    referralCode: "",
    buyUrl: "https://platform.stepfun.com",
    packages: [
      { name: "API 按量计费", price: 0, discountPrice: 0, tokenCount: "按量计费", badge: "", model: "" },
    ],
    models: ["Step-1", "Step-1V", "Step-2"],
    discountInfo: "新用户送10元"
  },
  {
    id: "tencent",
    name: "腾讯云",
    logo: "https://cloud.tencent.com/favicon.ico",
    description: "腾讯旗下云计算服务，混元大模型",
    features: ["国内官方", "混元大模型", "稳定可靠", "微信生态"],
    isOfficial: true,
    referralCode: "",
    buyUrl: "https://cloud.tencent.com/document/product/1729",
    packages: [
      { name: "API 按量计费 (混元-pro)", price: 0, discountPrice: 0, tokenCount: "¥100/百万tokens", badge: "", model: "混元-pro" },
      { name: "API 按量计费 (混元-standard)", price: 0, discountPrice: 0, tokenCount: "¥12.5/百万tokens", badge: "", model: "混元-standard" },
      { name: "API 按量计费 (混元-lite)", price: 0, discountPrice: 0, tokenCount: "免费", badge: "", model: "混元-lite" },
    ],
    models: ["混元-pro", "混元-standard", "混元-lite"],
    discountInfo: "新用户送15元"
  }
];

exports.main = async (event, context) => {
  let added = 0;
  let updated = 0;
  
  for (const provider of providers) {
    // 先检查是否已存在
    const existing = await db.collection('providers').where({ id: provider.id }).get();
    
    if (existing.data && existing.data.length > 0) {
      // 已存在，更新
      await db.collection('providers').doc(existing.data[0]._id).set(provider);
      updated++;
    } else {
      // 不存在，新增
      await db.collection('providers').add(provider);
      added++;
    }
  }
  
  return { success: true, added, updated, total: providers.length };
};