import { Spinner } from "@/components/Spinner";

export default function Loading() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-4">
      <Spinner size="lg" color="text-primary-600" />
      <p className="text-sm text-gray-500 font-medium animate-pulse">Loading SoroSave...</p>
    </div>
  );
}
