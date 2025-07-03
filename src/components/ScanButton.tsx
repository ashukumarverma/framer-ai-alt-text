import { Scan, Loader2 } from "lucide-react";

interface ScanButtonProps {
  isScanning: boolean;
  onScan: () => void;
}

export function ScanButton({ isScanning, onScan }: ScanButtonProps) {
  return (
    <button
      onClick={onScan}
      disabled={isScanning}
      className="flex items-center justify-center gap-2 w-full pd-4 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white text-sm font-medium rounded-md transition-colors"
    >
      {isScanning ? (
        <>
          <Loader2 className="w-4 h-4 animate-spin" />
          Scanning...
        </>
      ) : (
        <>
          <Scan className="w-4 h-4" />
          Scan for Images
        </>
      )}
    </button>
  );
}
