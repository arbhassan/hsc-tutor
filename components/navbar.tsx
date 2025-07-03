"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { BarChart, BookOpen, Home, PenTool, Trophy, LogOut, User, Book, Settings } from "lucide-react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu"
import { useAuth } from "@/lib/auth-context"

const navItems = [
  { name: "Home", href: "/", icon: Home },
  { name: "Practice Zone", href: "/practice-zone", icon: PenTool },
  { name: "Knowledge Bank", href: "/knowledge-bank", icon: BookOpen },
  { name: "Progress", href: "/progress", icon: BarChart },
  { name: "Admin", href: "/admin", icon: Settings },
]

export default function Navbar() {
  const pathname = usePathname()
  const { user, profile, selectedBook, signOut } = useAuth()

  const getUserInitials = () => {
    if (!user?.user_metadata) return "U"
    const firstName = user.user_metadata.first_name || ""
    const lastName = user.user_metadata.last_name || ""
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase() || "U"
  }

  const getUserFullName = () => {
    if (!user?.user_metadata) return user?.email || "User"
    const firstName = user.user_metadata.first_name || ""
    const lastName = user.user_metadata.last_name || ""
    return `${firstName} ${lastName}`.trim() || user?.email || "User"
  }

  return (
    <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <div className="mr-4 flex">
          <Link href="/" className="flex items-center space-x-2">
            <div className="flex items-center space-x-1">
              <span className="font-bold text-xl">HSC</span>
              <span className="text-primary">Tutor</span>
            </div>
          </Link>
        </div>
        <nav className="flex items-center space-x-6 text-sm font-medium">
          {navItems.map((item) => {
            const Icon = item.icon
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center transition-colors hover:text-foreground/80",
                  pathname === item.href ? "text-foreground" : "text-foreground/60",
                )}
              >
                <Icon className="mr-1 h-4 w-4" />
                <span>{item.name}</span>
              </Link>
            )
          })}
        </nav>
        
        {/* Selected Book Display */}
        {selectedBook && user && (
          <div className="flex items-center space-x-2 mx-4 px-3 py-1 bg-primary/10 rounded-full">
            <Book className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium text-primary">{selectedBook.title}</span>
            <Badge variant="secondary" className="text-xs">{selectedBook.category}</Badge>
          </div>
        )}
        
        <div className="flex items-center space-x-4 ml-auto">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                <Avatar className="h-8 w-8">
                  <AvatarFallback>{getUserInitials()}</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">{getUserFullName()}</p>
                  <p className="text-xs leading-none text-muted-foreground">
                    {user?.email}
                  </p>
                  {selectedBook && (
                    <p className="text-xs leading-none text-primary">
                      Studying: {selectedBook.title}
                    </p>
                  )}
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/profile" className="flex items-center">
                  <User className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={signOut}>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Sign out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}
