import { useAuth } from '@/lib/auth-context'
import { 
  updateFlashcardProgress, 
  updateShortAnswerProgress, 
  updateEssayProgress, 
  updateStudyStreak, 
  addStudyTime 
} from '@/lib/services/progress-service'

export function useProgressTracker() {
  const { user } = useAuth()

  const trackFlashcard = async (textName: string, isCorrect: boolean, completionTime: number) => {
    if (!user?.id) return
    await updateFlashcardProgress(user.id, textName, isCorrect, completionTime)
  }

  const trackFlashcardAttempt = async (textName: string, accuracy: number, completionTime: number) => {
    if (!user?.id) return
    // Convert accuracy percentage to individual attempts for compatibility
    const isCorrect = accuracy >= 70 // Consider 70%+ as successful
    await updateFlashcardProgress(user.id, textName, isCorrect, completionTime)
  }

  const trackShortAnswer = async (score: number, completionTime: number, attempts: number = 1) => {
    if (!user?.id) return
    await updateShortAnswerProgress(user.id, score, completionTime, attempts)
  }

  const trackEssay = async (score: number, wordCount: number, quoteCount: number) => {
    if (!user?.id) return
    await updateEssayProgress(user.id, score, wordCount, quoteCount)
  }

  const trackEssayCompletion = async (score: number, wordCount: number, quoteCount: number) => {
    if (!user?.id) return
    await updateEssayProgress(user.id, score, wordCount, quoteCount)
  }

  const trackStudySession = async (timeMinutes: number) => {
    if (!user?.id) return
    await addStudyTime(user.id, timeMinutes)
    await updateStudyStreak(user.id)
  }

  return {
    trackFlashcard,
    trackFlashcardAttempt,
    trackShortAnswer,
    trackEssay,
    trackEssayCompletion,
    trackStudySession,
  }
} 