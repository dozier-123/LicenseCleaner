import { useState } from "react";
import { toast } from "sonner";
import { Clipboard, ClipboardCheck, Sparkles, Trash2, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface Group {
  variety: string;
  licenses: string[];
}

const Sorter = () => {
  const navigate = useNavigate();
  const [input, setInput] = useState("");
  const [groups, setGroups] = useState<Group[]>([]);
  const [copiedGroup, setCopiedGroup] = useState<string | null>(null);

  const sort = () => {
    if (!input.trim()) {
      toast.error("Paste some licenses first.");
      return;
    }

    const tokens = input.split(/[\s,;|\n\r]+/).filter((t) =>
      t.toUpperCase().startsWith("UNTITLED_") || t.toUpperCase().startsWith("UNTITLED-") || t.toUpperCase().startsWith("AMAIRTE")
    );

    if (tokens.length === 0) {
      toast.error("No UNTITLED or AMAIRTE licenses found in the pasted text.");
      return;
    }

    const map: Record<string, string[]> = {};

    for (const token of tokens) {
      // Remove the "UNTITLED_" or "UNTITLED-" prefix (case-insensitive)
      const withoutPrefix = token.replace(/^untitled[-_]/i, "").replace(/^amairte[-_]/i, "");
      // The variety is the next segment (split by _ or -)
      const parts = withoutPrefix.split(/[-_]/);
      const variety = parts[0]?.toUpperCase() || "UNKNOWN";

      if (!map[variety]) map[variety] = [];
      map[variety].push(token);
    }

    const result: Group[] = Object.entries(map).map(([variety, licenses]) => ({
      variety,
      licenses,
    }));

    setGroups(result);
    toast.success(`Sorted into ${result.length} variet${result.length > 1 ? "ies" : "y"}.`);
  };

  const reset = () => {
    setInput("");
    setGroups([]);
    setCopiedGroup(null);
  };

  const copyGroup = (variety: string, licenses: string[]) => {
    navigator.clipboard.writeText(licenses.join(" "));
    setCopiedGroup(variety);
    toast.success(`${variety} licenses copied!`);
    setTimeout(() => setCopiedGroup(null), 2000);
  };

  const VARIETY_COLORS: Record<string, { bg: string; border: string; badge: string; text: string }> = {
    PREMIUM: {
      bg: "hover:bg-amber-500/10",
      border: "border-amber-500/30",
      badge: "bg-amber-500/20 text-amber-400",
      text: "text-amber-400",
    },
    STANDARD: {
      bg: "hover:bg-sky-500/10",
      border: "border-sky-500/30",
      badge: "bg-sky-500/20 text-sky-400",
      text: "text-sky-400",
    },
  };

  const getColors = (variety: string) =>
    VARIETY_COLORS[variety] ?? {
      bg: "hover:bg-violet-500/10",
      border: "border-violet-500/30",
      badge: "bg-violet-500/20 text-violet-400",
      text: "text-violet-400",
    };

  return (
    <div className="min-h-screen bg-[#0d0d0f] text-white flex flex-col">
      {/* Header */}
      <header className="border-b border-white/10 px-6 py-4 flex items-center gap-3">
        <button
          onClick={() => navigate("/")}
          className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors mr-1"
          title="Back to Cleaner"
        >
          <ArrowLeft size={15} className="text-white/60" />
        </button>
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center">
          <Sparkles size={16} className="text-white" />
        </div>
        <div>
          <h1 className="text-base font-semibold leading-none">LicenseSorter</h1>
          <p className="text-xs text-white/40 mt-0.5">Group licenses by variety for easy copying</p>
        </div>
      </header>

      <main className="flex-1 flex flex-col lg:flex-row gap-6 p-6 max-w-6xl mx-auto w-full">
        {/* Left: Input */}
        <div className="flex-1 flex flex-col gap-3 lg:max-w-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-white/60 uppercase tracking-wider">Paste Licenses</span>
            <button
              onClick={reset}
              className="text-xs text-white/30 hover:text-white/60 flex items-center gap-1 transition-colors"
            >
              <Trash2 size={12} />
              Clear
            </button>
          </div>
          <textarea
            className="flex-1 min-h-[300px] lg:min-h-0 w-full bg-[#18181b] border border-white/10 rounded-xl p-4 text-sm text-white/80 placeholder-white/20 resize-none focus:outline-none focus:border-amber-500/60 transition-colors font-mono leading-relaxed"
            placeholder={"Paste your clean license list here...\n\nExample:\nUNTITLED_STANDARD_ABC123\nUNTITLED_PREMIUM_XY99\nUNTITLED_PREMIUM_FI77"}
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <button
            onClick={sort}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white font-semibold text-sm transition-all active:scale-[0.98] shadow-lg shadow-amber-900/30"
          >
            Sort by Variety
          </button>
        </div>

        {/* Right: Grouped Output */}
        <div className="flex-1 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-white/60 uppercase tracking-wider">
              Sorted Groups
              {groups.length > 0 && (
                <span className="ml-2 px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400 text-[10px]">
                  {groups.length} variet{groups.length > 1 ? "ies" : "y"}
                </span>
              )}
            </span>
          </div>

          <div className="flex-1 bg-[#18181b] border border-white/10 rounded-xl overflow-hidden flex flex-col min-h-[300px] lg:min-h-0">
            {groups.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center gap-2 text-white/20 select-none">
                <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center">
                  <Sparkles size={20} className="text-white/20" />
                </div>
                <p className="text-sm">Sorted groups will appear here</p>
              </div>
            ) : (
              <div className="flex-1 overflow-y-auto p-3 flex flex-col gap-4">
                {groups.map((group) => {
                  const colors = getColors(group.variety);
                  const isCopied = copiedGroup === group.variety;
                  return (
                    <div key={group.variety} className="rounded-xl bg-white/[0.02] border border-white/8 overflow-hidden">
                      {/* Group header */}
                      <div className="flex items-center justify-between px-4 py-3 border-b border-white/5">
                        <div className="flex items-center gap-2">
                          <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${colors.badge}`}>
                            {group.variety}
                          </span>
                          <span className="text-xs text-white/30">{group.licenses.length} license{group.licenses.length > 1 ? "s" : ""}</span>
                        </div>
                        <button
                          onClick={() => copyGroup(group.variety, group.licenses)}
                          className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 transition-all ${isCopied ? `${colors.text} border-opacity-40` : "text-white/50 hover:text-white/80"} ${colors.bg} hover:${colors.border}`}
                        >
                          {isCopied ? <ClipboardCheck size={12} /> : <Clipboard size={12} />}
                          {isCopied ? "Copied!" : `Copy ${group.variety}`}
                        </button>
                      </div>

                      {/* License list */}
                      <div className="p-2 flex flex-col gap-1">
                        {group.licenses.map((lic, i) => (
                          <div
                            key={i}
                            className="px-3 py-2 rounded-lg bg-[#0d0d0f] font-mono text-xs text-white/60 border border-white/5"
                          >
                            {lic}
                          </div>
                        ))}
                      </div>

                      {/* Full string strip */}
                      <div className="border-t border-white/5 px-3 pb-3 pt-2">
                        <p className="text-[10px] text-white/20 uppercase tracking-wider mb-1.5">Full String</p>
                        <div
                          onClick={() => copyGroup(group.variety, group.licenses)}
                          className={`cursor-pointer bg-[#0d0d0f] rounded-lg px-3 py-2 font-mono text-xs text-white/40 break-all leading-relaxed transition-colors border border-white/5 ${colors.bg} hover:${colors.border} hover:text-white/60`}
                        >
                          {group.licenses.join("  ")}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Sorter;
