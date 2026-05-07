export const navigation = [
  { href: "/dashboard", labelKey: "nav.dashboard", label: "Dashboard", icon: "grid" },
  { href: "/sites", labelKey: "nav.sites", label: "Sites", icon: "pin" },
  { href: "/analytics", labelKey: "nav.analytics", label: "Analytics", icon: "chart" },
  { href: "/intelligence", labelKey: "nav.intelligence", label: "Intelligence", icon: "brain" },
  { href: "/alerts", labelKey: "nav.alerts", label: "Alerts", icon: "bell" },
  { href: "/reports", labelKey: "nav.reports", label: "Reports", icon: "file" },
  { href: "/settings", labelKey: "nav.settings", label: "Settings", icon: "gear" },
] as const;

export type NavIcon = (typeof navigation)[number]["icon"];
