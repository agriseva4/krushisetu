import { Droplets, Tractor, Sprout, Bug } from "lucide-react";
import type { DictKey } from "./i18n";

export const categories: {
  slug: string;
  labelKey: DictKey;
  icon: typeof Droplets;
  color: string;
  bg: string;
}[] = [
  { slug: "fertilizer", labelKey: "catFertilizer", icon: Droplets, color: "var(--field-700)", bg: "var(--field-50)" },
  { slug: "equipment", labelKey: "catEquipment", icon: Tractor, color: "var(--clay-700)", bg: "var(--clay-100)" },
  { slug: "seeds", labelKey: "catSeeds", icon: Sprout, color: "var(--mustard-600)", bg: "var(--mustard-100)" },
  { slug: "pesticide", labelKey: "catPesticide", icon: Bug, color: "var(--field-700)", bg: "var(--field-50)" },
];
