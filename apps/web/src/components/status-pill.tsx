const toneClasses = {
  healthy: "bg-emerald-50 text-emerald-700",
  warning: "bg-amber-50 text-amber-700",
  critical: "bg-rose-50 text-rose-700",
  offline: "bg-slate-100 text-slate-500",
  low: "bg-emerald-50 text-emerald-700",
  medium: "bg-amber-50 text-amber-700",
  high: "bg-rose-50 text-rose-700",
};

export function StatusPill({
  value,
}: {
  value: keyof typeof toneClasses;
}) {
  return (
    <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${toneClasses[value]}`}>
      {value}
    </span>
  );
}
