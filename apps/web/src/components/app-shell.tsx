"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { navigation } from "@/lib/navigation";
import { useT, LanguageToggle } from "@/lib/i18n";

export function AppShell({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  const pathname = usePathname() ?? "";
  const t = useT();

  return (
    <div className="min-h-screen bg-white">
      {/* Top bar */}
      <header className="sticky top-0 z-30 border-b border-slate-200 bg-white">
        <div className="mx-auto flex h-14 max-w-[1400px] items-center justify-between px-6">
          <Link href="/" className="text-lg font-bold tracking-tight text-slate-900">
            EMWAC
          </Link>
          <div className="flex items-center gap-3">
            <nav className="flex items-center gap-1">
              {navigation.map((item) => {
                const active = pathname === item.href || pathname.startsWith(item.href + "/");
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`rounded-lg px-3 py-1.5 text-sm transition ${
                      active
                        ? "bg-teal-700 font-medium text-white"
                        : "text-slate-600 hover:bg-slate-100"
                    }`}
                  >
                    {t(item.labelKey)}
                  </Link>
                );
              })}
            </nav>
            <LanguageToggle />
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="mx-auto max-w-[1400px] px-6 py-8">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">{title}</h1>
        <div className="mt-6">{children}</div>
      </main>
    </div>
  );
}
