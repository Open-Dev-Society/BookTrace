type SourceBadgeProps = {
  label?: string | null;
  verified?: boolean;
};

export function SourceBadge({ label, verified }: SourceBadgeProps) {
  const text = label ?? (verified ? "Verified" : "Source");
  const styles = (() => {
    if (label === "Free" || label === "Free Access") return "bg-green-100 text-green-800 border-green-200";
    if (label === "Paid") return "bg-yellow-100 text-yellow-800 border-yellow-200";
    if (label === "Open Source") return "bg-blue-100 text-blue-800 border-blue-200";
    if (verified) return "bg-emerald-100 text-emerald-800 border-emerald-200";
    return "bg-neutral-100 text-neutral-800 border-neutral-200";
  })();
  const prefix = (() => {
    if (label === "Free" || label === "Free Access") return "🆓 ";
    if (label === "Paid") return "💰 ";
    if (label === "Open Source") return "💾 ";
    if (verified) return "✅ ";
    return "";
  })();

  return (
    <span className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[11px] ${styles}`}>
      {prefix}
      {text}
    </span>
  );
}


