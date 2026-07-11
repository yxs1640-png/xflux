import { USER_SOURCE_OPTIONS } from "@/lib/user-source-config";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";

interface UserSourceSelectProps {
  value: string;
  onChange: (value: string) => void;
  detail: string;
  onDetailChange: (value: string) => void;
  label?: string;
  description?: string;
  required?: boolean;
  className?: string;
}

export function UserSourceSelect({
  value,
  onChange,
  detail,
  onDetailChange,
  label = "How did you hear about XFlux?",
  description = "Helps us understand which channels work best.",
  required = true,
  className,
}: UserSourceSelectProps) {
  return (
    <div className={cn("space-y-3", className)}>
      <div>
        <label className="mb-1.5 block text-sm text-zinc-400">
          {label}
          {required && <span className="text-red-400 ml-0.5">*</span>}
        </label>
        {description && <p className="mb-2 text-xs text-zinc-500">{description}</p>}
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          required={required}
          className="w-full rounded-lg border border-zinc-700 bg-zinc-900 px-4 py-2.5 text-sm text-white focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500/50 transition-colors"
        >
          <option value="" disabled>
            Select one...
          </option>
          {USER_SOURCE_OPTIONS.map((option) => (
            <option key={option.id} value={option.id}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      {value === "other" && (
        <div>
          <label className="mb-1.5 block text-sm text-zinc-400">
            Please specify <span className="text-zinc-500">(optional)</span>
          </label>
          <Input
            value={detail}
            onChange={(e) => onDetailChange(e.target.value)}
            placeholder="e.g. Discord community, conference, ad..."
            maxLength={200}
          />
        </div>
      )}
    </div>
  );
}
