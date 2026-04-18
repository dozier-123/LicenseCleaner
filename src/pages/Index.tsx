import { useState } from "react";
import { toast } from "sonner";
import { Clipboard, ClipboardCheck, Sparkles, Trash2, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();
  const [input, setInput] = useState("");
  const [licenses, setLicenses] = useState<string[]>([]);
  const [copiedFull, setCopiedFull] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const clean = () => {
    if (!input.trim()) {
      toast.error("Paste some text first.");
      return;
    }
    // Split by whitespace, newlines, commas, semicolons
    const tokens = input.split(/[\s,;|\n\r]+/);
    const found = tokens.filter((t) => t.toUpperCase().startsWith("UNTITLED_") || t.toUpperCase().startsWith("UNTITLED-") || t.toUpperCase().startsWith("AMAIRTE"));
    if (found.length === 0) {
      toast.error("No licenses starting with 'UNTITLED_', 'UNTITLED-', or 'AMAIRTE' found.");
      return;
    }
    setLicenses(found);
    toast.success(`${found.length} license${found.length > 1 ? "s" : ""} extracted.`);
  };

  const reset = () => {
    setInput("");
    setLicenses([]);
    setCopiedFull(false);
    setCopiedIndex(null);
  };

  const copyFull = () => {
    navigator.clipboard.writeText(licenses.join("\n"));
    setCopiedFull(true);
    toast.success("Full list copied!");
    setTimeout(() => setCopiedFull(false), 2000);
  };

  const copySingle = (lic: string, i: number) => {
    navigator.clipboard.writeText(lic);
    setCopiedIndex(i);
    toast.success("License copied!");
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="min-h-screen bg-[#0d0d0f] text-white flex flex-col">
      {/* Header */}
      <header className="border-b border-white/10 px-6 py-4 flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center">
          <Sparkles size={16} className="text-white" />
        </div>
        <div>
          <h1 className="text-base font-semibold leading-none">LicenseCleaner</h1>
          <p className="text-xs text-white/40 mt-0.5">Strip the junk, keep what matters</p>
        </div>
        <button
          onClick={() => navigate("/sorter")}
          className="ml-auto flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 hover:bg-amber-500/15 border border-white/10 hover:border-amber-500/40 text-white/50 hover:text-amber-400 text-xs font-medium transition-all"
        >
          Sorter
          <ArrowRight size={13} />
        </button>
      </header>

      <main className="flex-1 flex flex-col lg:flex-row gap-6 p-6 max-w-6xl mx-auto w-full">
        {/* Left: Input */}
        <div className="flex-1 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-white/60 uppercase tracking-wider text-xs">Paste Raw Input</span>
            <button
              onClick={reset}
              className="text-xs text-white/30 hover:text-white/60 flex items-center gap-1 transition-colors"
            >
              <Trash2 size={12} />
              Clear
            </button>
          </div>
          <textarea
            className="flex-1 min-h-[300px] lg:min-h-0 w-full bg-[#18181b] border border-white/10 rounded-xl p-4 text-sm text-white/80 placeholder-white/20 resize-none focus:outline-none focus:border-violet-500/60 transition-colors font-mono leading-relaxed"
            placeholder={"Paste your messy license text here...\n\nExample:\ndelete  UNTITLED_STANDARD_ABC123  used by john@email.com\nUNTITLED-PREMIUM-XY99  [expired]  random junk"}
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <button
            onClick={clean}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-semibold text-sm transition-all active:scale-[0.98] shadow-lg shadow-violet-900/30"
          >
            Extract Licenses
          </button>
        </div>

        {/* Right: Output */}
        <div className="flex-1 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-white/60 uppercase tracking-wider">
              Clean Output
              {licenses.length > 0 && (
                <span className="ml-2 px-2 py-0.5 rounded-full bg-violet-500/20 text-violet-400 text-[10px]">
                  {licenses.length} found
                </span>
              )}
            </span>
            {licenses.length > 0 && (
              <button
                onClick={copyFull}
                className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg bg-white/5 hover:bg-violet-500/20 border border-white/10 hover:border-violet-500/40 text-white/60 hover:text-violet-300 transition-all"
              >
                {copiedFull ? <ClipboardCheck size={12} /> : <Clipboard size={12} />}
                {copiedFull ? "Copied!" : "Copy All"}
              </button>
            )}
          </div>

          <div className="flex-1 bg-[#18181b] border border-white/10 rounded-xl overflow-hidden flex flex-col min-h-[300px] lg:min-h-0">
            {licenses.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center gap-2 text-white/20 select-none">
                <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center">
                  <Sparkles size={20} className="text-white/20" />
                </div>
                <p className="text-sm">Clean licenses will appear here</p>
              </div>
            ) : (
              <div className="flex-1 overflow-y-auto p-2 flex flex-col gap-1.5">
                {licenses.map((lic, i) => (
                  <button
                    key={i}
                    onClick={() => copySingle(lic, i)}
                    className="group flex items-center justify-between px-4 py-2.5 rounded-lg bg-white/[0.03] hover:bg-violet-500/10 border border-white/5 hover:border-violet-500/30 transition-all text-left"
                  >
                    <span className="font-mono text-sm text-white/80 group-hover:text-white truncate">{lic}</span>
                    <span className="ml-3 flex-shrink-0 text-white/20 group-hover:text-violet-400 transition-colors">
                      {copiedIndex === i ? <ClipboardCheck size={14} /> : <Clipboard size={14} />}
                    </span>
                  </button>
                ))}
              </div>
            )}

            {/* Full string strip */}
            {licenses.length > 0 && (
              <div className="border-t border-white/10 p-3">
                <p className="text-[10px] text-white/30 uppercase tracking-wider mb-2">Full String</p>
                <div
                  onClick={copyFull}
                  className="cursor-pointer bg-[#0d0d0f] rounded-lg px-3 py-2 font-mono text-xs text-white/50 hover:text-white/70 break-all leading-relaxed transition-colors border border-white/5 hover:border-violet-500/30"
                >
                  {licenses.join("  ")}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
