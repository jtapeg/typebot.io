import { chatRouter } from '@/features/chat/api'
import { router } from '../../trpc'

export const appRouter = router({
  chat: chatRouter,
})

export type AppRouter = typeof appRouter
