import { createClient } from "@/lib/supabase/client"
import type { 
  UserProgress, 
  FlashcardProgress, 
  ShortAnswerProgress, 
  EssayProgress, 
  WeeklyReport,
  ShortAnswerProgressDetailed,
  EssayComponentProgress
} from "@/lib/types/database"

export async function getUserProgress(userId: string): Promise<UserProgress | null> {
  const supabase = createClient()
  
  const { data, error } = await supabase
    .from('user_progress')
    .select('*')
    .eq('user_id', userId)
    .order('updated_at', { ascending: false })
    .limit(1)

  if (error) {
    console.error('Error fetching user progress:', error)
    return null
  }

  return data && data.length > 0 ? data[0] : null
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
    .order('updated_at', { ascending: false })
    .limit(1)

  if (error) {
    console.error('Error fetching short answer progress:', error)
    return null
  }

  return data && data.length > 0 ? data[0] : null
}

export async function getEssayProgress(userId: string): Promise<EssayProgress | null> {
  const supabase = createClient()
  
  const { data, error } = await supabase
    .from('essay_progress')
    .select('*')
    .eq('user_id', userId)
    .order('updated_at', { ascending: false })
    .limit(1)

  if (error) {
    console.error('Error fetching essay progress:', error)
    return null
  }

  return data && data.length > 0 ? data[0] : null
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

export async function getShortAnswerProgressDetailed(userId: string): Promise<ShortAnswerProgressDetailed[]> {
  const supabase = createClient()
  
  const { data, error } = await supabase
    .from('short_answer_progress_detailed')
    .select('*')
    .eq('user_id', userId)

  if (error) {
    console.error('Error fetching detailed short answer progress:', error)
    return []
  }

  return data || []
}

export async function getEssayComponentProgress(userId: string): Promise<EssayComponentProgress[]> {
  const supabase = createClient()
  
  const { data, error } = await supabase
    .from('essay_component_progress')
    .select('*')
    .eq('user_id', userId)

  if (error) {
    console.error('Error fetching essay component progress:', error)
    return []
  }

  return data || []
}

// Initialize user progress data when a new user signs up
export async function initializeUserProgress(userId: string): Promise<void> {
  const supabase = createClient()

  try {
    // Create initial user progress record with real starting values
    const { error: progressError } = await supabase
      .from('user_progress')
      .insert({
        user_id: userId,
        study_streak: 0, // Start with 0 days
        total_study_time: 0.0, // Start with 0 hours
        completion_rate: 0, // Start with 0%
        overall_mastery: 0 // Start with 0%
      })

    if (progressError) {
      console.error('Error initializing user progress:', progressError)
    }

    // Create initial short answer progress record starting with real values
    const { error: shortAnswerError } = await supabase
      .from('short_answer_progress')
      .insert({
        user_id: userId,
        total_questions: 0, // Start with 0 questions
        average_score: 0, // Start with 0%
        average_completion_time: 0.0, // Start with 0 minutes
        multiple_attempts_rate: 0 // Start with 0%
      })

    if (shortAnswerError) {
      console.error('Error initializing short answer progress:', shortAnswerError)
    }

    // Create initial essay progress record starting with real values
    const { error: essayError } = await supabase
      .from('essay_progress')
      .insert({
        user_id: userId,
        total_essays: 0, // Start with 0 essays
        average_score: 0, // Start with 0%
        average_word_count: 0 // Start with 0 words
      })

    if (essayError) {
      console.error('Error initializing essay progress:', essayError)
    }

    // Don't create initial flashcard progress records - they will be created when user first uses flashcards
    // This prevents cluttering progress with books the user hasn't selected

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
    // Get current progress (using the same method as getShortAnswerProgress)
    const currentProgress = await getShortAnswerProgress(userId)

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
        .eq('id', currentProgress.id) // Update by ID instead of user_id to target specific record

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
    console.log('updateEssayProgress called with:', {
      userId,
      score,
      wordCount,
      quoteCount
    })

    // Get current progress (using the same method as getEssayProgress)
    const currentProgress = await getEssayProgress(userId)
    
    console.log('Current essay progress:', currentProgress)

    if (currentProgress) {
      const totalEssays = (currentProgress.total_essays || 0) + 1
      const currentTotalScore = (currentProgress.average_score || 0) * (currentProgress.total_essays || 0)
      const newAverageScore = Math.round((currentTotalScore + score) / totalEssays)
      const currentTotalWords = (currentProgress.average_word_count || 0) * (currentProgress.total_essays || 0)
      const newAverageWordCount = Math.round((currentTotalWords + wordCount) / totalEssays)

      console.log('Calculated update values:', {
        totalEssays,
        newAverageScore,
        newAverageWordCount,
        currentProgressId: currentProgress.id
      })

      const { error } = await supabase
        .from('essay_progress')
        .update({
          total_essays: totalEssays,
          average_score: newAverageScore,
          average_word_count: newAverageWordCount,
          updated_at: new Date().toISOString()
        })
        .eq('id', currentProgress.id) // Update by ID instead of user_id to target specific record

      if (error) {
        console.error('Error updating essay progress:', error)
      } else {
        console.log('Essay progress updated successfully')
      }
    } else {
      console.log('No current essay progress found - this might be the issue!')
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
    const currentProgress = await getUserProgress(userId)

    if (currentProgress) {
      const now = new Date()
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
      
      // Get the last study date from updated_at
      const lastStudyDate = new Date(currentProgress.updated_at)
      const lastStudyDay = new Date(lastStudyDate.getFullYear(), lastStudyDate.getMonth(), lastStudyDate.getDate())
      
      // Calculate the difference in days
      const daysDifference = Math.floor((today.getTime() - lastStudyDay.getTime()) / (1000 * 60 * 60 * 24))
      
      let newStreak = currentProgress.study_streak || 0
      
      if (daysDifference === 0) {
        // Same day - don't change streak, just update the timestamp
        newStreak = currentProgress.study_streak || 1
      } else if (daysDifference === 1) {
        // Yesterday - increment streak
        newStreak = (currentProgress.study_streak || 0) + 1
      } else if (daysDifference > 1 || currentProgress.study_streak === 0) {
        // More than 1 day gap or first time - reset to 1
        newStreak = 1
      }

      const { error } = await supabase
        .from('user_progress')
        .update({
          study_streak: newStreak,
          updated_at: new Date().toISOString()
        })
        .eq('id', currentProgress.id)

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
    const currentProgress = await getUserProgress(userId)

    if (currentProgress) {
      const { error } = await supabase
        .from('user_progress')
        .update({
          total_study_time: (currentProgress.total_study_time || 0) + (timeMinutes / 60), // Convert to hours
          updated_at: new Date().toISOString()
        })
        .eq('id', currentProgress.id)

      if (error) {
        console.error('Error adding study time:', error)
      }
    }
  } catch (error) {
    console.error('Error in addStudyTime:', error)
  }
}

export async function updateShortAnswerProgressDetailed(
  userId: string,
  markerType: number,
  score: number,
  maxScore: number,
  completionTime: number
): Promise<void> {
  const supabase = createClient()

  try {
    // Get or create detailed progress for this marker type
    const { data: currentProgress } = await supabase
      .from('short_answer_progress_detailed')
      .select('*')
      .eq('user_id', userId)
      .eq('marker_type', markerType)
      .maybeSingle()

    const isCorrect = score >= (maxScore * 0.7) // Consider 70%+ as correct
    const percentage = Math.round((score / maxScore) * 100)

    if (currentProgress) {
      // Update existing record
      const newTotalQuestions = currentProgress.total_questions + 1
      const newCorrectAnswers = currentProgress.correct_answers + (isCorrect ? 1 : 0)
      const newAverageScore = Math.round(
        ((currentProgress.average_score * currentProgress.total_questions) + percentage) / newTotalQuestions
      )

      const { error } = await supabase
        .from('short_answer_progress_detailed')
        .update({
          total_questions: newTotalQuestions,
          correct_answers: newCorrectAnswers,
          average_score: newAverageScore,
          average_completion_time: completionTime,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', userId)
        .eq('marker_type', markerType)

      if (error) {
        console.error('Error updating detailed short answer progress:', error)
      }
    } else {
      // Create new record
      const { error } = await supabase
        .from('short_answer_progress_detailed')
        .insert({
          user_id: userId,
          marker_type: markerType,
          total_questions: 1,
          correct_answers: isCorrect ? 1 : 0,
          average_score: percentage,
          average_completion_time: completionTime
        })

      if (error) {
        console.error('Error creating detailed short answer progress:', error)
      }
    }

    // Also update overall short answer progress
    await updateShortAnswerProgress(userId, score, completionTime, 1)
  } catch (error) {
    console.error('Error in updateShortAnswerProgressDetailed:', error)
  }
}

export async function updateEssayComponentProgress(
  userId: string,
  componentScores: {
    introduction?: number,
    body_paragraphs?: number,
    conclusion?: number,
    question_analysis?: number
  }
): Promise<void> {
  const supabase = createClient()

  try {
    for (const [componentType, score] of Object.entries(componentScores)) {
      if (score === undefined) continue

      // Get or create component progress
      const { data: currentProgress } = await supabase
        .from('essay_component_progress')
        .select('*')
        .eq('user_id', userId)
        .eq('component_type', componentType)
        .maybeSingle()

      if (currentProgress) {
        // Update existing record
        const newTotalAssessments = currentProgress.total_assessments + 1
        const newAverageScore = Math.round(
          ((currentProgress.average_score * currentProgress.total_assessments) + score) / newTotalAssessments
        )

        const { error } = await supabase
          .from('essay_component_progress')
          .update({
            total_assessments: newTotalAssessments,
            average_score: newAverageScore,
            updated_at: new Date().toISOString()
          })
          .eq('user_id', userId)
          .eq('component_type', componentType)

        if (error) {
          console.error(`Error updating essay component progress for ${componentType}:`, error)
        }
      } else {
        // Create new record
        const { error } = await supabase
          .from('essay_component_progress')
          .insert({
            user_id: userId,
            component_type: componentType,
            total_assessments: 1,
            average_score: score
          })

        if (error) {
          console.error(`Error creating essay component progress for ${componentType}:`, error)
        }
      }
    }
  } catch (error) {
    console.error('Error in updateEssayComponentProgress:', error)
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
    const currentProgress = await getUserProgress(userId)
    if (currentProgress) {
      const { error } = await supabase
        .from('user_progress')
        .update({
          overall_mastery: overallMastery,
          completion_rate: completionRate,
          updated_at: new Date().toISOString()
        })
        .eq('id', currentProgress.id)

      if (error) {
        console.error('Error updating overall progress:', error)
      }
    }
  } catch (error) {
    console.error('Error in updateOverallProgress:', error)
  }
} 