import { createClient } from '@/lib/supabase/client'
import { BookData } from '@/lib/data/book-data'

const supabase = createClient()

// Types for the Supabase data
interface DetailedContext {
  id: string
  book_id: string
  context_type: string
  title: string
  sections: Array<{
    title?: string
    content: string[]
  }>
}

interface RubricConnection {
  id: string
  book_id: string
  rubric_type: string
  title: string
  subsections: Array<{
    title: string
    content: string[]
  }>
}

interface PlotSummary {
  id: string
  book_id: string
  parts: Array<{
    title: string
    description?: string
    chapters: Array<{
      title: string
      summary: string
      significance: string
    }>
  }>
}

interface ContemporaryConnections {
  id: string
  book_id: string
  sections: Array<{
    title: string
    subsections: Array<{
      title: string
      content: string[]
    }>
  }>
}

interface EssayGuide {
  id: string
  book_id: string
  structure: {
    title: string
    parts: Array<{
      title: string
      wordCount?: string
      content: string[]
      example?: string
    }>
  }
  techniques: {
    title: string
    categories: Array<{
      title: string
      techniques: Array<{
        name: string
        description: string
      }>
    }>
  }
  mistakes: {
    title: string
    dontDo: string[]
    doInstead: string[]
  }
  sample_question: {
    title: string
    question: string
    approach: string[]
  }
  tips: {
    title: string
    phases: Array<{
      title: string
      tips: string[]
    }>
  }
}

interface BookQuote {
  id: string
  book_id: string
  quote_id: string
  text: string
  reference: string
  technique: string
  themes: string[]
  explanation: string
  rubric_connection: string
  chapter: string
  character: string
  significance: 'high' | 'medium' | 'low'
}

interface BookTechnique {
  id: string
  book_id: string
  name: string
  definition: string
  example: string | null
}

class DetailedBookService {
  // Get comprehensive book data with all detailed content
  async getBookData(textId: string): Promise<BookData | null> {
    try {
      // Get basic book info
      const { data: book, error: bookError } = await supabase
        .from('books')
        .select('*')
        .eq('id', textId)
        .single()

      if (bookError || !book) {
        console.error('Error fetching book:', bookError)
        return null
      }

      // Get all detailed content in parallel
      const [
        contextsResult,
        rubricResult,
        plotResult,
        contemporaryResult,
        essayResult,
        quotesResult,
        techniquesResult
      ] = await Promise.all([
        this.getDetailedContexts(textId),
        this.getRubricConnections(textId),
        this.getPlotSummary(textId),
        this.getContemporaryConnections(textId),
        this.getEssayGuide(textId),
        this.getBookQuotes(textId),
        this.getBookTechniques(textId)
      ])

      // Transform the data to match the BookData interface
      const bookData: BookData = {
        id: book.id,
        title: book.title,
        author: book.author,
        publicationYear: book.year,
        genre: book.category,
        coverImage: book.image || '',
        introduction: book.description,
        themes: book.themes.map((theme: string, index: number) => ({
          id: `theme${index + 1}`,
          title: theme,
          icon: 'book',
          summary: '',
          color: 'bg-blue-100 border-blue-300',
          examples: []
        })),
        quotes: quotesResult,
        techniques: techniquesResult,
        
        // Detailed content
        detailedContexts: contextsResult,
        detailedRubricConnections: rubricResult,
        plotSummary: plotResult,
        detailedContemporaryConnections: contemporaryResult,
        essayGuide: essayResult,
        
        // Legacy fields (keep empty for backward compatibility)
        rubricConnections: [],
        contexts: {
          historical: { title: 'Historical Context', content: '', keyPoints: [] },
          cultural: { title: 'Cultural Context', content: '', keyPoints: [] },
          biographical: { title: 'Biographical Context', content: '', keyPoints: [] },
          philosophical: { title: 'Philosophical Context', content: '', keyPoints: [] }
        },
        timelineEvents: [],
        contemporaryConnections: [],
        additionalResources: []
      }

      return bookData
    } catch (error) {
      console.error('Error in getBookData:', error)
      return null
    }
  }

  // Get detailed contexts for a book
  async getDetailedContexts(bookId: string) {
    const { data, error } = await supabase
      .from('book_detailed_contexts')
      .select('*')
      .eq('book_id', bookId)
      .order('created_at', { ascending: true })

    if (error) {
      console.error('Error fetching detailed contexts:', error)
      return []
    }

    // Return all contexts as an array instead of grouping by type
    return data?.map((context: DetailedContext) => ({
      id: context.id,
      contextType: context.context_type,
      title: context.title,
      sections: context.sections
    })) || []
  }

  // Get rubric connections for a book
  async getRubricConnections(bookId: string) {
    const { data, error } = await supabase
      .from('book_rubric_connections')
      .select('*')
      .eq('book_id', bookId)

    if (error) {
      console.error('Error fetching rubric connections:', error)
      return {
        anomaliesAndParadoxes: { title: 'Anomalies and Paradoxes', subsections: [] },
        emotionalExperiences: { title: 'Emotional Experiences', subsections: [] },
        relationships: { title: 'Relationships', subsections: [] },
        humanCapacityForUnderstanding: { title: 'Human Capacity for Understanding', subsections: [] }
      }
    }

    const rubrics: any = {
      anomaliesAndParadoxes: { title: 'Anomalies and Paradoxes', subsections: [] },
      emotionalExperiences: { title: 'Emotional Experiences', subsections: [] },
      relationships: { title: 'Relationships', subsections: [] },
      humanCapacityForUnderstanding: { title: 'Human Capacity for Understanding', subsections: [] }
    }

    data?.forEach((rubric: RubricConnection) => {
      rubrics[rubric.rubric_type] = {
        title: rubric.title,
        subsections: rubric.subsections
      }
    })

    return rubrics
  }

  // Get plot summary for a book
  async getPlotSummary(bookId: string) {
    const { data, error } = await supabase
      .from('book_plot_summaries')
      .select('*')
      .eq('book_id', bookId)
      .single()

    if (error || !data) {
      console.error('Error fetching plot summary:', error)
      return { parts: [] }
    }

    return { parts: data.parts }
  }

  // Get contemporary connections for a book
  async getContemporaryConnections(bookId: string) {
    const { data, error } = await supabase
      .from('book_contemporary_connections')
      .select('*')
      .eq('book_id', bookId)
      .single()

    if (error || !data) {
      console.error('Error fetching contemporary connections:', error)
      return { sections: [] }
    }

    return { sections: data.sections }
  }

  // Get essay guide for a book
  async getEssayGuide(bookId: string) {
    const { data, error } = await supabase
      .from('book_essay_guides')
      .select('*')
      .eq('book_id', bookId)
      .single()

    if (error || !data) {
      console.error('Error fetching essay guide:', error)
      return {
        structure: { title: 'Essay Structure', parts: [] },
        techniques: { title: 'Essential Techniques for Analysis', categories: [] },
        mistakes: { title: 'Common Mistakes to Avoid', dontDo: [], doInstead: [] },
        sampleQuestion: { title: 'Sample HSC Question', question: '', approach: [] },
        tips: { title: 'Writing Tips', phases: [] }
      }
    }

    return {
      structure: data.structure,
      techniques: data.techniques,
      mistakes: data.mistakes,
      sampleQuestion: data.sample_question,
      tips: data.tips
    }
  }

  // Get quotes for a book
  async getBookQuotes(bookId: string) {
    const { data, error } = await supabase
      .from('book_quotes')
      .select('*')
      .eq('book_id', bookId)
      .order('quote_id')

    if (error) {
      console.error('Error fetching book quotes:', error)
      return []
    }

    return data?.map((quote: BookQuote) => ({
      id: quote.quote_id,
      text: quote.text,
      reference: quote.reference,
      technique: quote.technique,
      themes: quote.themes,
      explanation: quote.explanation,
      rubricConnection: quote.rubric_connection,
      chapter: quote.chapter,
      character: quote.character,
      significance: quote.significance
    })) || []
  }

  // Get techniques for a book
  async getBookTechniques(bookId: string) {
    const { data, error } = await supabase
      .from('book_techniques')
      .select('*')
      .eq('book_id', bookId)
      .order('name')

    if (error) {
      console.error('Error fetching book techniques:', error)
      return []
    }

    return data?.map((technique: BookTechnique) => ({
      name: technique.name,
      definition: technique.definition,
      example: technique.example
    })) || []
  }

  // Admin methods for updating content
  async updateDetailedContext(bookId: string, contextType: string, title: string, sections: any[], contextId?: string) {
    if (contextId) {
      // Update existing context
      const { error } = await supabase
        .from('book_detailed_contexts')
        .update({
          context_type: contextType,
          title: title,
          sections: sections,
          updated_at: new Date().toISOString()
        })
        .eq('id', contextId)

      if (error) {
        console.error('Error updating detailed context:', error)
        throw error
      }
    } else {
      // Create new context
      const { error } = await supabase
        .from('book_detailed_contexts')
        .insert({
          book_id: bookId,
          context_type: contextType,
          title: title,
          sections: sections
        })

      if (error) {
        console.error('Error creating detailed context:', error)
        throw error
      }
    }
  }

  async deleteDetailedContext(contextId: string) {
    const { error } = await supabase
      .from('book_detailed_contexts')
      .delete()
      .eq('id', contextId)

    if (error) {
      console.error('Error deleting detailed context:', error)
      throw error
    }
  }

  async updateRubricConnection(bookId: string, rubricType: string, title: string, subsections: any[]) {
    const { error } = await supabase
      .from('book_rubric_connections')
      .upsert({
        book_id: bookId,
        rubric_type: rubricType,
        title: title,
        subsections: subsections
      }, {
        onConflict: 'book_id,rubric_type'
      })

    if (error) {
      console.error('Error updating rubric connection:', error)
      throw error
    }
  }

  async updatePlotSummary(bookId: string, parts: any[]) {
    const { error } = await supabase
      .from('book_plot_summaries')
      .upsert({
        book_id: bookId,
        parts: parts
      }, {
        onConflict: 'book_id'
      })

    if (error) {
      console.error('Error updating plot summary:', error)
      throw error
    }
  }

  async updateContemporaryConnections(bookId: string, sections: any[]) {
    const { error } = await supabase
      .from('book_contemporary_connections')
      .upsert({
        book_id: bookId,
        sections: sections
      }, {
        onConflict: 'book_id'
      })

    if (error) {
      console.error('Error updating contemporary connections:', error)
      throw error
    }
  }

  async updateEssayGuide(bookId: string, guide: any) {
    const { error } = await supabase
      .from('book_essay_guides')
      .upsert({
        book_id: bookId,
        structure: guide.structure,
        techniques: guide.techniques,
        mistakes: guide.mistakes,
        sample_question: guide.sampleQuestion,
        tips: guide.tips
      }, {
        onConflict: 'book_id'
      })

    if (error) {
      console.error('Error updating essay guide:', error)
      throw error
    }
  }

  async updateBookQuote(bookId: string, quote: any) {
    const { error } = await supabase
      .from('book_quotes')
      .upsert({
        book_id: bookId,
        quote_id: quote.id,
        text: quote.text,
        reference: quote.reference,
        technique: quote.technique,
        themes: quote.themes,
        explanation: quote.explanation,
        rubric_connection: quote.rubricConnection,
        chapter: quote.chapter,
        character: quote.character,
        significance: quote.significance
      }, {
        onConflict: 'book_id,quote_id'
      })

    if (error) {
      console.error('Error updating book quote:', error)
      throw error
    }
  }

  async deleteBookQuote(bookId: string, quoteId: string) {
    const { error } = await supabase
      .from('book_quotes')
      .delete()
      .eq('book_id', bookId)
      .eq('quote_id', quoteId)

    if (error) {
      console.error('Error deleting book quote:', error)
      throw error
    }
  }

  async updateBookTechnique(bookId: string, technique: any) {
    const { error } = await supabase
      .from('book_techniques')
      .upsert({
        book_id: bookId,
        name: technique.name,
        definition: technique.definition,
        example: technique.example
      })

    if (error) {
      console.error('Error updating book technique:', error)
      throw error
    }
  }

  async deleteBookTechnique(id: string) {
    const { error } = await supabase
      .from('book_techniques')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Error deleting book technique:', error)
      throw error
    }
  }
}

export const detailedBookService = new DetailedBookService() 