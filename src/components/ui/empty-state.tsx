import * as React from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { FileQuestion, Plus, Upload } from "lucide-react"

interface EmptyStateProps {
  title: string
  description?: string
  icon?: "file" | "upload" | "plus" | "custom"
  customIcon?: React.ReactNode
  action?: {
    label: string
    onClick: () => void
  }
  className?: string
}

const iconMap = {
  file: FileQuestion,
  upload: Upload,
  plus: Plus,
  custom: null,
}

export function EmptyState({
  title,
  description,
  icon = "file",
  customIcon,
  action,
  className,
}: EmptyStateProps) {
  const Icon = iconMap[icon]

  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center py-16 px-4 text-center",
        className
      )}
    >
      <div className="rounded-full bg-muted dark:bg-muted/30 p-4 mb-4">
        {customIcon || (Icon && <Icon className="h-8 w-8 text-muted-foreground" />)}
      </div>
      <h3 className="text-lg font-semibold text-foreground mb-2">{title}</h3>
      {description && (
        <p className="text-sm text-muted-foreground max-w-sm mb-6">
          {description}
        </p>
      )}
      {action && (
        <Button onClick={action.onClick}>
          {action.label}
        </Button>
      )}
    </div>
  )
}
