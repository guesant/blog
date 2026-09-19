import {
  Archive,
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  Book,
  Bookmark,
  BookOpen,
  Briefcase,
  Building2,
  Calendar,
  Check,
  CheckCircle2,
  ChevronDown,
  CircleDashed,
  CircleHelp,
  Clapperboard,
  Clock,
  Compass,
  Copy,
  Download,
  ExternalLink,
  FileText,
  FolderGit2,
  GitBranch,
  Globe,
  GraduationCap,
  Home,
  Languages,
  LayoutGrid,
  Lightbulb,
  ListVideo,
  type LucideProps,
  Mail,
  Menu,
  MessagesSquare,
  MoreHorizontal,
  Newspaper,
  PenLine,
  PlayCircle,
  Podcast,
  ScrollText,
  Search,
  Rss,
  ShoppingCart,
  SlidersHorizontal,
  Sparkles,
  Star,
  StarOff,
  Tag,
  Tv,
  User,
  Video,
  Wrench,
  X,
  XCircle,
} from 'lucide-react';
import type { ComponentType, CSSProperties } from 'react';

export type IconName =
  | 'arrow'
  | 'arrow-left'
  | 'menu'
  | 'close'
  | 'mail'
  | 'document'
  | 'external'
  | 'north-east'
  | 'problem'
  | 'solution'
  | 'evolution'
  | 'chevron-down'
  | 'home'
  | 'briefcase'
  | 'graduation-cap'
  | 'copy'
  | 'check'
  | 'search'
  | 'rss'
  | 'filter'
  | 'layout-grid'
  | 'pen-line'
  | 'sparkles'
  | 'user'
  | 'tag'
  | 'star'
  | 'star-off'
  | 'calendar'
  | 'compass'
  | 'book'
  | 'newspaper'
  | 'scroll-text'
  | 'folder-git'
  | 'globe'
  | 'book-open'
  | 'wrench'
  | 'video'
  | 'list-video'
  | 'tv'
  | 'podcast'
  | 'clapperboard'
  | 'more-horizontal'
  | 'bookmark'
  | 'clock'
  | 'check-circle'
  | 'x-circle'
  | 'archive'
  | 'circle-dashed'
  | 'download'
  | 'shopping-cart'
  | 'play-circle'
  | 'languages'
  | 'messages-square'
  | 'building';

type IconProps = {
  name: IconName;
  size?: number;
  style?: CSSProperties;
  strokeWidth?: number;
} & Omit<LucideProps, 'name' | 'size' | 'style' | 'strokeWidth'>;

const icons: Record<IconName, ComponentType<LucideProps>> = {
  arrow: ArrowRight,
  'arrow-left': ArrowLeft,
  menu: Menu,
  close: X,
  mail: Mail,
  document: FileText,
  external: ExternalLink,
  'north-east': ArrowUpRight,
  problem: CircleHelp,
  solution: Lightbulb,
  evolution: GitBranch,
  'chevron-down': ChevronDown,
  home: Home,
  briefcase: Briefcase,
  'graduation-cap': GraduationCap,
  copy: Copy,
  check: Check,
  search: Search,
  rss: Rss,
  filter: SlidersHorizontal,
  'layout-grid': LayoutGrid,
  'pen-line': PenLine,
  sparkles: Sparkles,
  user: User,
  tag: Tag,
  star: Star,
  'star-off': StarOff,
  calendar: Calendar,
  compass: Compass,
  book: Book,
  newspaper: Newspaper,
  'scroll-text': ScrollText,
  'folder-git': FolderGit2,
  globe: Globe,
  'book-open': BookOpen,
  wrench: Wrench,
  video: Video,
  'list-video': ListVideo,
  tv: Tv,
  podcast: Podcast,
  clapperboard: Clapperboard,
  'more-horizontal': MoreHorizontal,
  bookmark: Bookmark,
  clock: Clock,
  'check-circle': CheckCircle2,
  'x-circle': XCircle,
  archive: Archive,
  'circle-dashed': CircleDashed,
  download: Download,
  'shopping-cart': ShoppingCart,
  'play-circle': PlayCircle,
  languages: Languages,
  'messages-square': MessagesSquare,
  building: Building2,
};

export function Icon(iconProps: IconProps) {
  const { name, size = 20, style, ...lucideProps } = iconProps;
  const LucideIcon = icons[name] as ComponentType<
    LucideProps & { strokeWidth?: number; style?: CSSProperties }
  >;

  return (
    <LucideIcon
      size={size}
      strokeWidth={1.8}
      aria-hidden
      style={{ display: 'block', flex: '0 0 auto', ...style }}
      {...lucideProps}
    />
  );
}
