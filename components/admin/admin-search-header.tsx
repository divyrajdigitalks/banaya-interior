import { Search, LucideIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface AdminSearchHeaderProps {
  searchQuery: string;
  setSearchQuery: (val: string) => void;
  searchPlaceholder?: string;
  actionLabel?: string;
  onAction?: () => void;
  ActionIcon?: LucideIcon;
  children?: React.ReactNode;
}

export function AdminSearchHeader({
  searchQuery,
  setSearchQuery,
  searchPlaceholder = "Search...",
  actionLabel,
  onAction,
  ActionIcon,
  children
}: AdminSearchHeaderProps) {
  return (
    <div className="flex flex-col lg:flex-row gap-4 items-center justify-between mb-4">
      <div className="relative w-full lg:w-96 group">
        <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-charcoal/30 group-focus-within:text-gold transition-colors" size={18} />
        <Input
          placeholder={searchPlaceholder}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-12 h-11 bg-white border-charcoal/5 rounded-xl focus:ring-gold/20 focus:border-gold transition-all shadow-md shadow-charcoal/5 text-sm"
        />
      </div>

      <div className="flex items-center gap-4 w-full lg:w-auto">
        {children}
        {actionLabel && onAction && (
          <Button
            onClick={onAction}
            className="w-full lg:w-auto bg-gold hover:bg-gold/90 text-charcoal font-black text-[10px] uppercase tracking-widest px-6 py-4 rounded-xl shadow-md shadow-gold/10 flex items-center gap-2 group transition-all duration-500 h-11"
          >
            {ActionIcon && <ActionIcon className="group-hover:rotate-90 transition-transform duration-500" size={14} />}
            {actionLabel}
          </Button>
        )}
      </div>
    </div>
  );
}
