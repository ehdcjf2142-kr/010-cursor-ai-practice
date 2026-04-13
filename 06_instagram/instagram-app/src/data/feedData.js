/** 실제 파일 확장자 (img01·img04는 png) */
export const FEED_IMAGES = [
  { name: 'img01', ext: 'png' },
  { name: 'img02', ext: 'jpg' },
  { name: 'img03', ext: 'jpg' },
  { name: 'img04', ext: 'png' },
  { name: 'img05', ext: 'jpg' },
  { name: 'img06', ext: 'jpg' },
  { name: 'img07', ext: 'jpg' },
  { name: 'img08', ext: 'jpg' },
  { name: 'img09', ext: 'jpg' },
  { name: 'img10', ext: 'jpg' },
]

const USERNAMES = [
  'cozy_vibes',
  'urban_snap',
  'slow_life_kr',
  'pixel_day',
  'morning_run',
  'studio_m',
  'wave_side',
  'cafelatte',
  'bookstack',
  'sunset_lane',
]

const CAPTIONS = [
  '노을 지는 호수 🛶',
  '오늘의 거리 스냅',
  '천천히 가는 하루',
  '창밖 풍경 한 컷',
  '아침 러닝 후',
  '작업실 모서리',
  '파도 소리 들으며',
  '커피 한 잔의 여유',
  '책장 앞에서',
  '해 질 녘 하늘',
]

export function buildPosts() {
  return FEED_IMAGES.map((img, i) => ({
    id: i + 1,
    imageSrc: `/feed-images/${img.name}.${img.ext}`,
    username: USERNAMES[i],
    avatarSrc: i % 2 === 0 ? '/feed-images/man.png' : '/feed-images/woman.png',
    likes: 210 + i * 73 + (i % 5) * 12,
    caption: CAPTIONS[i],
    timeLabel: `${(i % 12) + 1}시간 전`,
  }))
}

export const STORY_USERS = [
  { name: '내 스토리', avatar: '/feed-images/man.png', isAdd: true },
  { name: 'slow_life', avatar: '/feed-images/woman.png' },
  { name: 'urban_snap', avatar: '/feed-images/man.png' },
  { name: 'wave_side', avatar: '/feed-images/woman.png' },
  { name: 'bookstack', avatar: '/feed-images/man.png' },
]
