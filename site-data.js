// Shared site data — bilingual content. All variations consume from here.
window.SITE_DATA = {
  name: { zh: '兰斯', en: 'Lance' },
  handle: { zh: '兰斯AI', en: '@LanceAI' },
  tagline: {
    zh: '先干了再说 · Code is cheap',
    en: 'Ship first · Code is cheap',
  },
  bio: {
    zh: '独立开发者。Hetu Protocol 产品负责人。2026 all-in 在 AI 上，公开挑战靠 Vibe Coding 赚到一百万。',
    en: 'Indie hacker. Product Lead at Hetu Protocol. All-in on AI in 2026 — publicly challenging myself to make ¥1M with vibe coding.',
  },

  // Challenge
  challenge: {
    goal: 1000000,
    earned: 199, // current actual revenue
    currency: '¥',
    title: { zh: '一百万挑战', en: 'The ¥1M Challenge' },
    sub: {
      zh: '从零开始，用 AI 写代码，把产品做到一百万营收。没有时间限制。全部产品营收累计。',
      en: 'Zero to ¥1,000,000 in product revenue. Built with AI. No deadline. Every product counts.',
    },
    days: 12, // since challenge start
  },

  // Products / 作品集
  products: [
    {
      id: 'easyrecord',
      name: 'EasyRecord',
      url: 'easyrecord.vercel.app',
      desc: {
        zh: '口播录屏工具 · 录屏 + 虚拟形象 · 一键出片',
        en: 'Talking-head recorder · screen capture + virtual avatar · one-click export',
      },
      status: 'operating',
      stat: { zh: '已上线', en: 'Live' },
      year: 2026,
      tags: ['AI', 'Video', 'Web'],
      accent: '#FF5722',
    },
    {
      id: 'bg-sanxiu',
      name: '素材库',
      url: 'bg-sanxiu.vercel.app',
      desc: {
        zh: 'AI 动态背景素材库 · Canvas 实时渲染 · 粒子/神经网络/矩阵雨 · 4K 60fps 下载即用',
        en: 'AI motion background library · real-time Canvas rendering · particles / neural nets / matrix rain · 4K 60fps ready-to-use',
      },
      status: 'operating',
      stat: { zh: '已上线', en: 'Live' },
      year: 2026,
      tags: ['AI', 'Video', 'Canvas', 'Web'],
      accent: '#FFD90A',
    },
    {
      id: 'next-2',
      name: { zh: '更多产品', en: 'More to come' },
      url: '',
      desc: {
        zh: '一个想法、一个产品、一次发布',
        en: 'One idea, one product, one launch at a time',
      },
      status: 'upcoming',
      stat: { zh: '排队中', en: 'Queued' },
      year: 2026,
      tags: ['—'],
    },
  ],

  // Grants & Recognition
  grants: [
    { org: 'Starknet Foundation', amount: '$25,000', label: { zh: 'Atomic Stark · 最高级别 Grant', en: 'Atomic Stark · Max Grant' } },
    { org: 'Starknet Foundation', amount: '$25,000', label: { zh: 'zk2048 · 世界首个 ZK 游戏', en: 'zk2048 · world\'s first ZK game' } },
    { org: 'Moonbeam Foundation', amount: '$18,000', label: { zh: 'Eternity Network · Polkadot S2', en: 'Eternity Network · Polkadot S2' } },
    { org: 'Hetu Protocol', amount: '$400,000', label: { zh: 'EigenLayer AVS · 产品负责人', en: 'EigenLayer AVS · Product Lead' } },
    { org: 'TON Foundation', amount: 'MAU 1000+', label: { zh: 'Linkol · Marketing Support', en: 'Linkol · Marketing Support' } },
  ],

  // Timeline
  timeline: [
    { year: '2021', text: { zh: 'Eternity Network · Polkadot Hackathon · Moonbeam $18K', en: 'Eternity Network · Polkadot Hackathon · Moonbeam $18K' } },
    { year: '2023', text: { zh: 'zk2048 — 世界首个 ZK 游戏 · Starknet $25K\n一周自学 Rust 拿下 Offer', en: 'zk2048 — world\'s first ZK game · Starknet $25K\nLearned Rust in a week with AI · landed the offer' } },
    { year: '2024', text: { zh: 'Hetu Protocol · 产品负责人 · EigenLayer AVS · $400K（在职）', en: 'Hetu Protocol · Product Lead · EigenLayer AVS · $400K (current)' } },
    { year: '2025', text: { zh: 'OpenClaw 上线 · 首位付费用户', en: 'OpenClaw shipped · first paying user' } },
    { year: '2026', text: { zh: 'All in AI · @兰斯AI · building in public', en: 'All in on AI · @LanceAI · building in public' } },
  ],

  // Identity
  identity: {
    main: { zh: '产品导演 · Web3 × AI 产品人', en: 'Product Director · Web3 × AI' },
    roles: [
      { zh: '全栈工程师', en: 'Full-stack Engineer' },
      { zh: '内容型产品人', en: 'Content-driven PM' },
      { zh: '独立开发者', en: 'Indie Hacker' },
    ],
    method: { zh: '边做边讲 · 一个人 + 三个 AI · Vibe Coding', en: 'Build in public · Solo + 3 AIs · Vibe Coding' },
    tagline: { zh: '懂技术的产品导演', en: 'A product director who codes' },
  },

  // Stack
  stack: {
    languages: ['Rust', 'Python', 'Solidity', 'TypeScript'],
    frameworks: ['React', 'Node.js', 'Next.js'],
    tools: ['Claude Code', 'Cursor', 'Antigravity'],
  },

  // Log entries (building in public)
  log: [
    { date: '2026·05·14', text: { zh: '把博客 RSS 跑通了。下一篇写挑战缘起。', en: 'RSS pipeline live. Next post: why this challenge.' } },
    { date: '2026·05·11', text: { zh: '产品 #1 的核心循环跑通，今晚上线 landing。', en: 'Core loop of product #1 works. Landing goes live tonight.' } },
    { date: '2026·05·08', text: { zh: '挑战开始。账面 ¥0，朋友说我疯了。', en: 'Day 1. ¥0 in the bank. Friends say I\'m crazy.' } },
    { date: '2026·05·02', text: { zh: '开始利用业余时间搞副业。白天 Hetu，晚上 Vibe Coding。', en: 'Started side-hustling after hours. Hetu by day, vibe coding by night.' } },
    { date: '2026·04·25', text: { zh: 'OpenClaw 暂停运营。复盘很长，但值得。', en: 'OpenClaw paused. Long retro, worth every minute.' } },
  ],

  // Social
  socials: [
    { label: '微信', value: 'lancese999', href: '#' },
    { label: '小红书', value: '@兰斯AI', href: '#' },
    { label: '抖音', value: '@兰斯AI', href: '#' },
    { label: '视频号', value: '@兰斯AI', href: '#' },
    { label: 'GitHub', value: 'peter-jim', href: 'https://github.com/peter-jim' },
    { label: 'X / Twitter', value: '@lancedeng0', href: 'https://twitter.com/lancedeng0' },
  ],

  // Paid community offer
  community: {
    price: 99,
    currency: '¥',
    type: { zh: '一次付费 · 永久加入', en: 'one-time · lifetime access' },
    seats: { current: 47, cap: 200 },
    benefits: {
      zh: [
        '实时看到挑战进度、营收数据、跳过的坎',
        '每周一场连麦 / 复盘 · 可提问',
        '产品内测名额 · 上线前拿到',
        '朋友圈内推 · 独立开发者圈内资源',
        '不满意七天全额退款',
      ],
      en: [
        'Live access to challenge progress, revenue & retros',
        'Weekly call / inside-look · ask anything',
        'Beta-test future products · first to try',
        'Indie-hacker circle warm intros · deal flow',
        '7-day full refund if it’s not for you',
      ],
    },
  },

  // GitHub-ish stats
  gh: {
    stars: 412,
    commits: 3120,
    repos: 47,
    contribs: 1280,
  },

  // Copy strings (UI labels)
  ui: {
    work: { zh: '作品', en: 'Work' },
    challenge: { zh: '挑战', en: 'Challenge' },
    log: { zh: '日志', en: 'Log' },
    about: { zh: '关于', en: 'About' },
    contact: { zh: '联系', en: 'Contact' },
    hire: { zh: '合作 / 接单', en: 'Work with me' },
    newsletter: { zh: '订阅通讯', en: 'Newsletter' },
    newsletter_sub: { zh: '每月一封 · 公开记录这次挑战的进度、踩坑、复盘。', en: 'Monthly · the full inside view of this ¥1M challenge — progress, mistakes, retros.' },
    subscribe: { zh: '订阅', en: 'Subscribe' },
    subscribers_count: { zh: '已有 1,247 位读者', en: '1,247 builders subscribed' },
    subscribed_ok: { zh: '搞定。下一封月初发。', en: 'Locked in. Next issue drops at the start of the month.' },
    invalid_email: { zh: '邮箱格式不对 · 再试试', en: 'Hmm, that doesn’t look right.' },
    email_placeholder: { zh: '你的邮箱', en: 'your@email.com' },
    progress: { zh: '进度', en: 'Progress' },
    earned: { zh: '已完成', en: 'Earned' },
    goal: { zh: '目标', en: 'Goal' },
    remaining: { zh: '还差', en: 'To go' },
    day: { zh: '第', en: 'Day' },
    day_suffix: { zh: '天', en: '' },
    status_shutdown: { zh: '已停运', en: 'Sunset' },
    status_operating: { zh: '运营中', en: 'Live' },
    status_building: { zh: '筹备中', en: 'Building' },
    status_upcoming: { zh: '即将上线', en: 'Soon' },
    visit: { zh: '访问', en: 'Visit' },
    read_post: { zh: '阅读', en: 'Read' },
    view_all: { zh: '查看全部', en: 'View all' },
    stack: { zh: '技术栈', en: 'Stack' },
    identity: { zh: '身份', en: 'Identity' },
    grants: { zh: '资助 & 成就', en: 'Grants & Recognition' },
    timeline: { zh: '时间线', en: 'Timeline' },
    products: { zh: '作品集', en: 'Products' },
    building_in_public: { zh: '公开日志', en: 'Building in public' },
    hero_cta_primary: { zh: '看看作品', en: 'See the work' },
    hero_cta_secondary: { zh: '跟进挑战', en: 'Follow the challenge' },
    hire_desc: { zh: '产品 0→1 · AI 工程 · Web3 / ZK · 长期合作或单次项目', en: 'Product 0→1 · AI engineering · Web3 / ZK · long-term or project work' },
    hire_cta: { zh: '发邮件聊聊', en: 'Send a brief' },

    // Community
    community_title: { zh: '加入社群', en: 'Join the community' },
    community_pitch: { zh: '一起看这个一百万挑战怎么从 0 走到靠。不是粉丝群，是一个独立开发者的环。', en: 'Front-row seat to the ¥1M challenge — every number, every retro. Not a fan club; a working circle of solo builders.' },
    community_cta: { zh: '扫码付款', en: 'Scan to pay' },
    community_pay_wechat: { zh: '微信支付', en: 'WeChat Pay' },
    community_pay_alipay: { zh: '支付宝', en: 'Alipay' },
    community_seats: { zh: '名额', en: 'Seats' },
    community_after_pay: { zh: '付款后截图发 ', en: 'After payment, DM the receipt to ' },
  },
};

// Helper — pick localized string. Accepts plain string or {zh,en} object.
window.t = function (v, lang) {
  if (v == null) return '';
  if (typeof v === 'string') return v;
  return v[lang] ?? v.en ?? v.zh ?? '';
};
