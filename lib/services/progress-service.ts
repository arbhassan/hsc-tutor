import { createClient } from "@/lib/supabase/client"
import type { 
  UserProgress, 
  FlashcardProgress, 
  ShortAnswerProgress, 
  EssayProgress, 
  WeeklyReport 
} from "@/lib/types/database"

export async function getUserProgress(userId: string): Promise<UserProgress | null> {
  const supabase = createClient()
  
  const { data, error } = await supabase
    .from('user_progress')
    .select('*')
    .eq('user_id', userId)
    .maybeSingle()

  if (error) {
    console.error('Error fetching user progress:', error)
    return null
  }

  return data
}

export async function getFlashcardProgress(userId: string): Promise<FlashcardProgress[]> {
  const supabase = createClient()
  
  const { data, error } = await supabase
    .from('flashcard_progress')
    .select('*')
    .eq('user_id', userId)

  if (error) {
    console.error('Error fetching flashcard progress:', error)
    return []
  }

  return data || []
}

export async function getShortAnswerProgress(userId: string): Promise<ShortAnswerProgress | null> {
  const supabase = createClient()
  
  const { data, error } = await supabase
    .from('short_answer_progress')
    .select('*')
    .eq('user_id', userId)
    .maybeSingle()

  if (error) {
    console.error('Error fetching short answer progress:', error)
    return null
  }

  return data
}

export async function getEssayProgress(userId: string): Promise<EssayProgress | null> {
  const supabase = createClient()
  
  const { data, error } = await supabase
    .from('essay_progress')
    .select('*')
    .eq('user_id', userId)
    .maybeSingle()

  if (error) {
    console.error('Error fetching essay progress:', error)
    return null
  }

  return data
}

export async function getWeeklyReport(userId: string): Promise<WeeklyReport | null> {
  const supabase = createClient()
  
  // Get the most recent weekly report
  const { data, error } = await supabase
    .from('weekly_reports')
    .select('*')
    .eq('user_id', userId)
    .order('week_start', { ascending: false })
    .limit(1)
    .maybeSingle()

  if (error) {
    console.error('Error fetching weekly report:', error)
    return null
  }

  return data
}

// Initialize user progress data when a new user signs up
export async function initializeUserProgress(userId: string): Promise<void> {
  const supabase = createClient()

  try {
    // Create initial user progress record with sample data
    const { error: progressError } = await supabase
      .from('user_progress')
      .insert({
        user_id: userId,
        study_streak: Math.floor(Math.random() * 5) + 1, // 1-6 days
        total_study_time: Math.floor(Math.random() * 15) + 5, // 5-20 hours
        completion_rate: Math.floor(Math.random() * 30) + 60, // 60-90%
        overall_mastery: Math.floor(Math.random() * 25) + 50 // 50-75%
      })

    if (progressError) {
      console.error('Error initializing user progress:', progressError)
    }

    // Create initial short answer progress record with sample data
    const { error: shortAnswerError } = await supabase
      .from('short_answer_progress')
      .insert({
        user_id: userId,
        total_questions: Math.floor(Math.random() * 15) + 5, // 5-20 questions
        average_score: Math.floor(Math.random() * 30) + 50, // 50-80%
        average_completion_time: 3 + Math.random() * 3, // 3-6 minutes
        multiple_attempts_rate: Math.floor(Math.random() * 30) + 10 // 10-40%
      })

    if (shortAnswerError) {
      console.error('Error initializing short answer progress:', shortAnswerError)
    }

    // Create initial essay progress record with sample data
    const { error: essayError } = await supabase
      .from('essay_progress')
      .insert({
        user_id: userId,
        total_essays: Math.floor(Math.random() * 5) + 2, // 2-7 essays
        average_score: Math.floor(Math.random() * 25) + 55, // 55-80%
        average_word_count: Math.floor(Math.random() * 400) + 800, // 800-1200 words
        average_quote_usage: 2 + Math.random() * 3 // 2-5 quotes per essay
      })

    if (essayError) {
      console.error('Error initializing essay progress:', essayError)
    }

    // Create initial flashcard progress records for different texts with sample data
    const texts = ['Hamlet', '1984', 'The Great Gatsby', 'Frankenstein', 'Pride & Prejudice', 'Macbeth']
    const flashcardInserts = texts.map((text, index) => {
      const totalCards = Math.floor(Math.random() * 30) + 25
      const masteredCards = Math.floor(totalCards * (0.3 + Math.random() * 0.4)) // 30-70% mastered
      const accuracy = Math.floor((masteredCards / totalCards) * 100)
      
      return {
        user_id: userId,
        text_name: text,
        total_flashcards: totalCards,
        mastered_flashcards: masteredCards,
        average_accuracy: accuracy,
        completion_time: 1.5 + Math.random() * 2 // 1.5-3.5 seconds
      }
    })

    const { error: flashcardError } = await supabase
      .from('flashcard_progress')
      .insert(flashcardInserts)

    if (flashcardError) {
      console.error('Error initializing flashcard progress:', flashcardError)
    }

  } catch (error) {
    console.error('Error in initializeUserProgress:', error)
  }
}

// Progress update functions
export async function updateFlashcardProgress(
  userId: string, 
  textName: string, 
  isCorrect: boolean, 
  completionTime: number
): Promise<void> {
  const supabase = createClient()

  try {
    // Get current progress for this text
    const { data: currentProgress } = await supabase
      .from('flashcard_progress')
      .select('*')
      .eq('user_id', userId)
      .eq('text_name', textName)
      .maybeSingle()

    if (currentProgress) {
      // Calculate new averages
      const totalAttempts = (currentProgress.total_flashcards || 0) + 1
      const correctAttempts = (currentProgress.mastered_flashcards || 0) + (isCorrect ? 1 : 0)
      const newAccuracy = Math.round((correctAttempts / totalAttempts) * 100)
      
      // Update existing record
      const { error } = await supabase
        .from('flashcard_progress')
        .update({
          total_flashcards: totalAttempts,
          mastered_flashcards: correctAttempts,
          average_accuracy: newAccuracy,
          completion_time: completionTime,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', userId)
        .eq('text_name', textName)

      if (error) {
        console.error('Error updating flashcard progress:', error)
      }
    }

    // Update overall user progress
    await updateOverallProgress(userId)
  } catch (error) {
    console.error('Error in updateFlashcardProgress:', error)
  }
}

export async function updateShortAnswerProgress(
  userId: string,
  score: number,
  completionTime: number,
  attempts: number
): Promise<void> {
  const supabase = createClient()

  try {
    // Get current progress
    const { data: currentProgress } = await supabase
      .from('short_answer_progress')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle()

    if (currentProgress) {
      const totalQuestions = (currentProgress.total_questions || 0) + 1
      const currentTotalScore = (currentProgress.average_score || 0) * (currentProgress.total_questions || 0)
      const newAverageScore = Math.round((currentTotalScore + score) / totalQuestions)
      const multipleAttempts = attempts > 1 ? 1 : 0
      const currentMultipleAttempts = (currentProgress.multiple_attempts_rate || 0) * (currentProgress.total_questions || 0) / 100
      const newMultipleAttemptsRate = Math.round(((currentMultipleAttempts + multipleAttempts) / totalQuestions) * 100)

      const { error } = await supabase
        .from('short_answer_progress')
        .update({
          total_questions: totalQuestions,
          average_score: newAverageScore,
          average_completion_time: completionTime,
          multiple_attempts_rate: newMultipleAttemptsRate,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', userId)

      if (error) {
        console.error('Error updating short answer progress:', error)
      }
    }

    // Update overall user progress
    await updateOverallProgress(userId)
  } catch (error) {
    console.error('Error in updateShortAnswerProgress:', error)
  }
}

export async function updateEssayProgress(
  userId: string,
  score: number,
  wordCount: number,
  quoteCount: number
): Promise<void> {
  const supabase = createClient()

  try {
    // Get current progress
    const { data: currentProgress } = await supabase
      .from('essay_progress')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle()

    if (currentProgress) {
      const totalEssays = (currentProgress.total_essays || 0) + 1
      const currentTotalScore = (currentProgress.average_score || 0) * (currentProgress.total_essays || 0)
      const newAverageScore = Math.round((currentTotalScore + score) / totalEssays)
      const currentTotalWords = (currentProgress.average_word_count || 0) * (currentProgress.total_essays || 0)
      const newAverageWordCount = Math.round((currentTotalWords + wordCount) / totalEssays)
      const currentTotalQuotes = (currentProgress.average_quote_usage || 0) * (currentProgress.total_essays || 0)
      const newAverageQuoteUsage = (currentTotalQuotes + quoteCount) / totalEssays

      const { error } = await supabase
        .from('essay_progress')
        .update({
          total_essays: totalEssays,
          average_score: newAverageScore,
          average_word_count: newAverageWordCount,
          average_quote_usage: newAverageQuoteUsage,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', userId)

      if (error) {
        console.error('Error updating essay progress:', error)
      }
    }

    // Update overall user progress
    await updateOverallProgress(userId)
  } catch (error) {
    console.error('Error in updateEssayProgress:', error)
  }
}

export async function updateStudyStreak(userId: string): Promise<void> {
  const supabase = createClient()

  try {
    const { data: currentProgress } = await supabase
      .from('user_progress')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle()

    if (currentProgress) {
      const { error } = await supabase
        .from('user_progress')
        .update({
          study_streak: (currentProgress.study_streak || 0) + 1,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', userId)

      if (error) {
        console.error('Error updating study streak:', error)
      }
    }
  } catch (error) {
    console.error('Error in updateStudyStreak:', error)
  }
}

export async function addStudyTime(userId: string, timeMinutes: number): Promise<void> {
  const supabase = createClient()

  try {
    const { data: currentProgress } = await supabase
      .from('user_progress')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle()

    if (currentProgress) {
      const { error } = await supabase
        .from('user_progress')
        .update({
          total_study_time: (currentProgress.total_study_time || 0) + (timeMinutes / 60), // Convert to hours
          updated_at: new Date().toISOString()
        })
        .eq('user_id', userId)

      if (error) {
        console.error('Error adding study time:', error)
      }
    }
  } catch (error) {
    console.error('Error in addStudyTime:', error)
  }
}

async function updateOverallProgress(userId: string): Promise<void> {
  const supabase = createClient()

  try {
    // Get all progress data
    const [flashcardData, shortAnswerData, essayData] = await Promise.all([
      getFlashcardProgress(userId),
      getShortAnswerProgress(userId),
      getEssayProgress(userId)
    ])

    // Calculate overall mastery (weighted average)
    let totalWeight = 0
    let weightedSum = 0

    if (flashcardData.length > 0) {
      const avgFlashcardAccuracy = flashcardData.reduce((sum, item) => sum + item.average_accuracy, 0) / flashcardData.length
      weightedSum += avgFlashcardAccuracy * 0.3
      totalWeight += 0.3
    }

    if (shortAnswerData) {
      weightedSum += (shortAnswerData.average_score || 0) * 0.35
      totalWeight += 0.35
    }

    if (essayData) {
      weightedSum += (essayData.average_score || 0) * 0.35
      totalWeight += 0.35
    }

    const overallMastery = totalWeight > 0 ? Math.round(weightedSum / totalWeight) : 0

    // Calculate completion rate (this would be based on assigned tasks in a real app)
    const completionRate = Math.min(100, overallMastery) // Simplified for now

    // Update overall progress
    const { error } = await supabase
      .from('user_progress')
      .update({
        overall_mastery: overallMastery,
        completion_rate: completionRate,
        updated_at: new Date().toISOString()
      })
      .eq('user_id', userId)

    if (error) {
      console.error('Error updating overall progress:', error)
    }
  } catch (error) {
    console.error('Error in updateOverallProgress:', error)
  }
} 