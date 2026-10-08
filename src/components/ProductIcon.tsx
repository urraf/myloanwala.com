import {
  Briefcase,
  Building2,
  Calculator,
  Car,
  Coins,
  Home,
  Newspaper,
  Tag,
  Handshake,
  Wallet,
  type LucideIcon,
} from "lucide-react";
import type { IconName } from "@/lib/products";

const ICONS: Record<IconName, LucideIcon> = {
  personal: Wallet,
  business: Briefcase,
  home: Home,
  property: Building2,
  gold: Coins,
  car: Car,
  calculator: Calculator,
  offer: Tag,
  partner: Handshake,
  blog: Newspaper,
};

export default function ProductIcon({ name, className = "h-6 w-6" }: { name: IconName; className?: string }) {
  const Icon = ICONS[name];
  return <Icon className={className} strokeWidth={1.75} />;
}
