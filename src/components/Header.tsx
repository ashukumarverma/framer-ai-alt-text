import { Sparkles } from "lucide-react";

export function Header() {
  return (
    <div className="flex items-center gap-2 bg-white text-black w-full shadow-md pd-10">
      <div className="flex items-center gap-2">
        <Sparkles className="text-blue-500 h-8" />
      </div>
      <div>
        <div className="font-bold">Image Alt Text Generator</div>
      </div>
    </div>
  );
}
