import { SlidesData } from '@/types/slides';

export const defaultSlidesData: SlidesData = {
  title: "致我最爱的你",
  subtitle: "2024 → 2025 跨年夜",
  lastUpdated: new Date().toISOString(),
  slides: [
    {
      id: '1',
      title: '亲爱的',
      contentType: 'article',
      richText: `<div class="text-center space-y-6">
        <h2 class="text-3xl font-bold text-gradient">亲爱的宝贝 💕</h2>
        <p class="text-lg leading-relaxed">
          当你打开这个页面的时候，<br/>
          新年的钟声即将敲响。
        </p>
        <p class="text-lg leading-relaxed">
          过去的一年里，<br/>
          感谢你一直陪在我身边。
        </p>
        <p class="text-xl font-medium text-secondary">
          ✨ 向右滑动，开始我们的专属回忆 ✨
        </p>
      </div>`,
      background: 'gradient-romantic',
      overlays: [{ type: 'hearts', position: 'center', size: 'md' }],
      transition: 'fade',
      order: 0
    },
    {
      id: '2',
      title: '我们的故事',
      contentType: 'mixed',
      richText: `<div class="space-y-4">
        <h2 class="text-2xl font-bold text-center">📖 我们的故事</h2>
        <p class="text-base leading-relaxed">
          还记得我们第一次相遇吗？那个时候的你，笑起来像春天的阳光一样温暖。
        </p>
        <p class="text-base leading-relaxed">
          从那一刻起，我就知道，你是我一直在寻找的人。
        </p>
      </div>`,
      images: ['https://images.unsplash.com/photo-1518199266791-5375a83190b7?w=800&q=80'],
      background: 'gradient-teal',
      overlays: [{ type: 'sparkles', position: 'top-right', size: 'sm' }],
      transition: 'slide',
      order: 1
    },
    {
      id: '3',
      title: '最美的时光',
      contentType: 'image',
      images: [
        'https://images.unsplash.com/photo-1529333166437-7750a6dd5a70?w=800&q=80',
        'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=800&q=80'
      ],
      richText: '<p class="text-center text-lg">每一个和你在一起的日子，都是最美的时光 🌸</p>',
      background: 'gradient-pink',
      overlays: [{ type: 'stars', position: 'center', size: 'lg' }],
      transition: 'scale',
      order: 2
    },
    {
      id: '4',
      title: '新年愿望',
      contentType: 'article',
      richText: `<div class="text-center space-y-6">
        <h2 class="text-3xl font-bold">🎊 新年愿望</h2>
        <div class="space-y-4 text-lg">
          <p>✨ 愿新的一年，我们更加相爱</p>
          <p>✨ 愿我们的每一天都充满欢笑</p>
          <p>✨ 愿我能给你更多的幸福</p>
          <p>✨ 愿我们一起走过更多的风景</p>
        </div>
      </div>`,
      background: 'hearts',
      overlays: [{ type: 'confetti', position: 'center', size: 'lg' }],
      transition: 'fade',
      order: 3
    },
    {
      id: '5',
      title: '我爱你',
      contentType: 'article',
      richText: `<div class="text-center space-y-8">
        <div class="text-6xl animate-heart-beat">❤️</div>
        <h2 class="text-4xl font-bold text-gradient">我爱你</h2>
        <p class="text-xl">
          无论过去、现在、还是未来<br/>
          你都是我最爱的人
        </p>
        <p class="text-2xl font-bold text-secondary">
          新年快乐，宝贝！
        </p>
        <p class="text-sm text-muted-foreground mt-8">
          — 你的专属恋人 🌹
        </p>
      </div>`,
      background: 'gradient-romantic',
      overlays: [
        { type: 'hearts', position: 'top-left', size: 'sm' },
        { type: 'hearts', position: 'top-right', size: 'sm' },
        { type: 'sparkles', position: 'bottom-left', size: 'md' },
        { type: 'sparkles', position: 'bottom-right', size: 'md' }
      ],
      transition: 'scale',
      order: 4
    }
  ]
};
