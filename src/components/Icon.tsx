import {
  PanelTop,
  Server,
  Cog,
  RefreshCw,
  Gauge,
  Wrench,
  Droplets,
  Waves,
  Thermometer,
  Flame,
  Filter,
  Recycle,
  CupSoda,
  Sun,
  TriangleAlert,
  Bolt,
  FlaskConical,
  SprayCan,
  RadioTower,
  Target,
  FileText,
  Check,
  X,
  Mail,
  ClipboardList,
  ImageOff,
  Wifi,
  ShieldAlert,
  type LucideIcon,
} from "lucide-react";

// Central icon registry — referenced by string name from data (categories,
// use-cases) and components, so no emoji are used anywhere in the UI.
const ICONS: Record<string, LucideIcon> = {
  // Categories
  "panel-top": PanelTop,
  server: Server,
  cog: Cog,
  "refresh-cw": RefreshCw,
  gauge: Gauge,
  wrench: Wrench,
  // Use cases
  droplets: Droplets,
  waves: Waves,
  thermometer: Thermometer,
  flame: Flame,
  filter: Filter,
  recycle: Recycle,
  "cup-soda": CupSoda,
  sun: Sun,
  "triangle-alert": TriangleAlert,
  bolt: Bolt,
  "flask-conical": FlaskConical,
  "spray-can": SprayCan,
  "radio-tower": RadioTower,
  // UI accents
  target: Target,
  "file-text": FileText,
  check: Check,
  x: X,
  mail: Mail,
  "clipboard-list": ClipboardList,
  "image-off": ImageOff,
  wifi: Wifi,
  "shield-alert": ShieldAlert,
};

export type IconName = keyof typeof ICONS;

export function Icon({
  name,
  className,
  size,
  strokeWidth,
}: {
  name: string;
  className?: string;
  size?: number;
  strokeWidth?: number;
}) {
  const Cmp = ICONS[name] ?? ICONS["panel-top"];
  return <Cmp className={className} size={size} strokeWidth={strokeWidth} aria-hidden />;
}
