import { Scan, Loader2 } from "lucide-react";

interface ScanButtonProps {
  isScanning: boolean;
  onScan: () => void;
}

export function ScanButton({ isScanning, onScan }: ScanButtonProps) {
  return (
    <button onClick={onScan} disabled={isScanning}>
      {isScanning ? (
        <>
          <Loader2 />
          Scanning...
        </>
      ) : (
        <>
          <Scan />
          Scan for Images
        </>
      )}
    </button>
  );
}
