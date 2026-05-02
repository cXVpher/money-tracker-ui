import type { ComponentProps } from "react";
import type { Icon as PhosphorIcon } from "@phosphor-icons/react";
import {
  Airplane,
  Bank,
  Briefcase,
  Bus,
  Coins,
  CreditCard,
  DotsThreeCircle,
  ForkKnife,
  GameController,
  Gift,
  Heartbeat,
  Money,
  Notebook,
  ShieldCheck,
  ShoppingBag,
  ShoppingCart,
  Student,
  Target,
  TrendUp,
  WifiHigh,
} from "@phosphor-icons/react";
import { DeviceMobile } from "@phosphor-icons/react";
import { cn } from "@/shared/_utils/cn";

const appIcons = {
  bank: Bank,
  bills: Notebook,
  bonus: Gift,
  cash: Money,
  credit_card: CreditCard,
  education: Student,
  entertainment: GameController,
  food: ForkKnife,
  freelance: Briefcase,
  groceries: ShoppingCart,
  health: Heartbeat,
  internet: WifiHigh,
  investment: TrendUp,
  mobile: DeviceMobile,
  other: DotsThreeCircle,
  salary: Coins,
  shield: ShieldCheck,
  shopping: ShoppingBag,
  target: Target,
  transport: Bus,
  travel: Airplane,
} as const satisfies Record<string, PhosphorIcon>;

const iconLabels: Record<keyof typeof appIcons, string> = {
  bank: "Bank",
  bills: "Tagihan",
  bonus: "Bonus",
  cash: "Tunai",
  credit_card: "Kartu kredit",
  education: "Pendidikan",
  entertainment: "Hiburan",
  food: "Makanan",
  freelance: "Freelance",
  groceries: "Groceries",
  health: "Kesehatan",
  internet: "Internet",
  investment: "Investasi",
  mobile: "E-wallet",
  other: "Lainnya",
  salary: "Gaji",
  shield: "Dana darurat",
  shopping: "Belanja",
  target: "Target",
  transport: "Transportasi",
  travel: "Liburan",
};

export type AppIconName = keyof typeof appIcons;

type AppIconProps = ComponentProps<PhosphorIcon> & {
  name: string;
};

export const APP_ICON_OPTIONS: Array<{
  label: string;
  value: AppIconName;
}> = Object.entries(iconLabels).map(([value, label]) => ({
  label,
  value: value as AppIconName,
}));

export const GOAL_ICON_OPTIONS = APP_ICON_OPTIONS.filter(({ value }) =>
  ["target", "shield", "travel", "freelance", "education", "investment", "bonus"].includes(value)
);

export function AppIcon({
  className,
  name,
  size = 20,
  weight = "regular",
  ...props
}: AppIconProps) {
  const Icon = appIcons[name as AppIconName] ?? DotsThreeCircle;

  return (
    <Icon
      aria-hidden="true"
      className={cn("shrink-0", className)}
      size={size}
      weight={weight}
      {...props}
    />
  );
}
