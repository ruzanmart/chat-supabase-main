// app/api/chat/route.ts
// Минимальный стриминг ответа от OpenAI без cookies/auth/Supabase.

import { StreamingTextResponse } from 'ai'
import OpenAI from 'openai'

export const runtime = 'nodejs' // избегаем edge-ограничений с cookies/AsyncStorage

const defaultClient = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
})

export async function POST(req: Request) {
  // Из тела запроса берём сообщения и, при желании, временный токен
  const { messages = [], previewToken } = await req.json().catch(() => ({
    messages: [],
    previewToken: undefined,
  }))

  const client = previewToken
    ? new OpenAI({ apiKey: previewToken })
    : defaultClient

  // Системный промпт (AI Ментор)
  const systemPrompt = {
    role: 'system' as const,
    content: `Ты AI Ментор - мудрый советчик и коуч по развитию карьеры, личности и бизнеса.

Твоя роль:
- Помогай людям развиваться профессионально и личностно
- Отвечай мудро, конкретно и вдохновляюще
- Давай практические советы и пошаговые планы
- Мотивируй и поддерживай в сложных ситуациях

Стиль общения:
- Дружелюбный, но профессиональный
- Структурированные ответы с четкими пунктами
- Примеры и аналогии для лучшего понимания
- Вопросы для размышления в конце ответа

Отвечай на русском языке, будь практичным и полезным.`,
  }

  const messagesWithSystem = [systemPrompt, ...messages]

  // Стримим из OpenAI Chat Completions
  const completion = await client.chat.completions.create({
    model: 'gpt-4o-mini', // можно поменять на нужную модель
    messages: messagesWithSystem as any,
    stream: true,
  })

  // Оборачиваем в ReadableStream и отдаём клиенту
  const encoder = new TextEncoder()
  const readable = new ReadableStream({
    async start(controller) {
      try {
        for await (const chunk of completion) {
          const delta = chunk.choices?.[0]?.delta?.content
          if (delta) controller.enqueue(encoder.encode(delta))
        }
        controller.close()
      } catch (err) {
        controller.error(err)
      }
    },
  })

  return new StreamingTextResponse(readable)
}
