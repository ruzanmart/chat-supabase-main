// components/header.tsx
import * as React from 'react'
import Link from 'next/link'

import { auth } from '@/auth'
import { clearChats } from '@/app/actions'
import { Button } from '@/components/ui/button'
import { Sidebar } from '@/components/sidebar'
import { SidebarList } from '@/components/sidebar-list'
import { IconNextChat, IconSeparator } from '@/components/ui/icons'
import { SidebarFooter } from '@/components/sidebar-footer'
import { ThemeToggle } from '@/components/theme-toggle'
import { ClearHistory } from '@/components/clear-history'
import { UserMenu } from '@/components/user-menu'

// ВАЖНО: без 'use client' — это серверный компонент
export async function Header() {
  // NextAuth сам читает cookies внутри auth()
  const session = await auth()
  const userId = session?.user?.id as string | undefined

  return (
    <header className="sticky top-0 z-50 flex h-16 w-full shrink-0 items-center justify-between border-b bg-gradient-to-b from-background/10 via-background/50 to-background/80 px-4 backdrop-blur-xl">
      <div className="flex items-center">
        {session?.user ? (
          <Sidebar>
            <React.Suspense fallback={<div className="flex-1 overflow-auto" />}>
              {userId ? (
                <SidebarList userId={userId} />
              ) : (
                <div className="p-3 text-sm text-muted-foreground">Loading…</div>
              )}
            </React.Suspense>
            <SidebarFooter>
              <ThemeToggle />
              <ClearHistory clearChats={clearChats} />
            </SidebarFooter>
          </Sidebar>
        ) : (
          <Link href="/">
            <IconNextChat className="mr-2 h-6 w-6 dark:hidden" inverted />
            <IconNextChat className="mr-2 hidden h-6 w-6 dark:block" />
          </Link>
        )}

        <div className="flex items-center">
          <IconSeparator className="h-6 w-6 text-muted-foreground/50" />
          <h1 className="ml-2 text-lg font-semibold text-foreground">AI Ментор</h1>
        </div>
      </div>

      <div className="flex items-center">
        {session?.user ? (
          <UserMenu user={session.user} />
        ) : (
          <Button variant="link" asChild className="-ml-2">
            <Link href="/sign-in">Войти</Link>
          </Button>
        )}
      </div>
    </header>
  )
}
