import Link from "next/link"
import { cn } from "../_lib/utils"

export function MainNav({
  className,
  ...props
}: React.HTMLAttributes<HTMLElement>) {
  return (
    <nav
      className={cn("flex items-center space-x-4 lg:space-x-6", className)}
      {...props}
    >
      <Link
        href="/dashboard"
        className="p-2 rounded-md text-sm font-medium transition-colors hover:text-muted-foreground focus:bg-primary focus:text-primary-foreground"
      >
        Dashboard
      </Link>
      <Link
        href="/library"
        className="p-2 rounded-md text-sm font-medium transition-colors hover:text-muted-foreground focus:bg-primary focus:text-primary-foreground"
      >
        Biblioteca de Faturas
      </Link>
    </nav>
  )
}