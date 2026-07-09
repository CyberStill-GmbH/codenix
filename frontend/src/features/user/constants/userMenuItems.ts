import { LogOut, Send, Settings, TrendingUp, UserRound } from "lucide-react";
import type { UserMenuItem } from "@/features/user/types/userMenu.types";

export const USER_MENU_ITEMS: UserMenuItem[] = [
  {
    id: "profile",
    label: "Mi perfil",
    icon: UserRound,
    route: "/profile",
    variant: "default",
  },
  {
    id: "progress",
    label: "Progreso",
    icon: TrendingUp,
    route: "/profile",
    variant: "default",
  },
  {
    id: "submissions",
    label: "Envíos",
    icon: Send,
    route: "/submissions",
    variant: "default",
  },
  {
    id: "settings",
    label: "Configuración",
    icon: Settings,
    route: "/settings",
    variant: "default",
  },
];

export const USER_MENU_DANGER_ITEMS: UserMenuItem[] = [
  {
    id: "logout",
    label: "Cerrar sesión",
    icon: LogOut,
    variant: "danger",
  },
];
