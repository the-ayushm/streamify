import { Avatar, AvatarFallback, AvatarImage } from "./../components/ui/avatar"
import { Button } from "./../components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./../components/ui/dropdown-menu"
import {
  BadgeCheckIcon,
  BellIcon,
  LogOutIcon,
  SettingsIcon
} from "lucide-react"
import { useAuth } from "@/context/AuthContext"

interface DropdownMenuAvatarProps {
  name: string
  email: string
  avatarFallback: string
}

export function DropdownMenuAvatar({
  name,
  email,
  avatarFallback,
}: DropdownMenuAvatarProps) {
  const {logout} = useAuth();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="rounded-full">
          <Avatar>
            <AvatarImage src="https://github.com/shadcn.png" alt={name} />
            <AvatarFallback>{avatarFallback}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuGroup>
          <div className="px-2 py-1.5 text-sm">
            <div className="font-semibold">{name}</div>
            <div className="text-xs text-muted-foreground">{email}</div>
          </div>
          <DropdownMenuSeparator />
          <DropdownMenuItem>
            <BadgeCheckIcon />
            Account
          </DropdownMenuItem>
          <DropdownMenuItem>
            <SettingsIcon />
            Settings
          </DropdownMenuItem>
          <DropdownMenuItem>
            <BellIcon />
            Notifications
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={logout}>
          <LogOutIcon/>
          Sign Out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
