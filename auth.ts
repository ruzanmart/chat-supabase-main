// auth.ts
// Временная заглушка авторизации, без cookies()

export const auth = async () => {
  // Здесь потом подключим реальную авторизацию (GitHub/NextAuth/Supabase)
  return { user: null } as any
}

export type Session = Awaited<ReturnType<typeof auth>>

