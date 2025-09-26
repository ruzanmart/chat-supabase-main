// auth.ts
import { cookies } from 'next/headers'

// cookieStore делаем опциональным, чтобы вызов auth() без аргументов не падал
export const auth = async (
  opts: { cookieStore?: ReturnType<typeof cookies> } = {}
) => {
  const cookieStore = opts.cookieStore ?? cookies()

  // TODO: здесь позже подключим реальную авторизацию (GitHub/Supabase/и т.д.)
  // Временно возвращаем "пустую" сессию, чтобы приложение не падало.
  return { user: null } as any
}

export type Session = Awaited<ReturnType<typeof auth>>

