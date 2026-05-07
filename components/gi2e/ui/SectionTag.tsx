interface SectionTagProps {
  children: React.ReactNode;
  className?: string;
  light?: boolean;
}

export default function SectionTag({ children, className = '', light = false }: SectionTagProps) {
  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <span className="block w-0.5 h-5 rounded-full bg-[#22a05a]" />
      <span
        className={`text-[11px] font-semibold uppercase tracking-[0.15em] ${
          light ? 'text-[#4ade80]' : 'text-[#22a05a]'
        }`}
      >
        {children}
      </span>
    </div>
  );
}
