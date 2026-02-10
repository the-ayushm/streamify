import { Skeleton } from '@/components/ui/skeleton'

export function ChatSkeleton() {
  return (
    <div className="flex flex-col gap-3 p-4">
      {/* Left bubble */}
      <div className="flex justify-start">
        <Skeleton className="h-10 w-48 rounded-2xl" />
      </div>

      {/* Right bubble */}
      <div className="flex justify-end">
        <Skeleton className="h-10 w-40 rounded-2xl" />
      </div>

      {/* Left bubble (shorter) */}
      <div className="flex justify-start">
        <Skeleton className="h-8 w-32 rounded-2xl" />
      </div>
    </div>
  )
}