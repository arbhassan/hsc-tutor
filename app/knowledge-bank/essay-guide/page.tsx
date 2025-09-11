"use client"

import Link from "next/link"
import {
  BookOpen,
  Award,
  CheckCircle,
  ChevronRight,
  HelpCircle,
  Mail,
  LayoutPanelLeftIcon as LayoutParagraphLeft,
} from "lucide-react"
import { SlideNavigation, SlideData } from "@/components/ui/slide-navigation"
import { Badge } from "@/components/ui/badge"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

export default function EssayGuidePage() {
  const slides: SlideData[] = [
    {
      id: 'overview',
      title: 'Master Essay Structure',
      badge: 'Overview',
      content: (
        <div className="space-y-8">
          <div className="text-center">
            <Badge className="mb-4">Complete Learning Path</Badge>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
              Our comprehensive guide breaks down the complex art of essay writing into three essential components, each
              designed to help you develop the skills needed for Band 6 success.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Introductions */}
            <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <BookOpen className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-center mb-3">Introductions</h3>
              <p className="text-gray-600 text-center mb-4">
                Learn to craft compelling introductions with strong thesis statements and clear points.
              </p>
              <div className="space-y-2">
                <div className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2 shrink-0" />
                  <span className="text-sm">Thesis statement development</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2 shrink-0" />
                  <span className="text-sm">Contextual framing techniques</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2 shrink-0" />
                  <span className="text-sm">Point preview strategies</span>
                </div>
              </div>
            </div>

            {/* Body Paragraphs */}
            <div className="bg-purple-50 p-6 rounded-lg border border-purple-200">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <LayoutParagraphLeft className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-center mb-3">Body Paragraphs</h3>
              <p className="text-gray-600 text-center mb-4">
                Master the PETAL framework and sophisticated arguments to create compelling analysis.
              </p>
              <div className="space-y-2">
                <div className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2 shrink-0" />
                  <span className="text-sm">PETAL paragraph structure</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2 shrink-0" />
                  <span className="text-sm">Sophisticated argument techniques</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2 shrink-0" />
                  <span className="text-sm">Effective textual evidence integration</span>
                </div>
              </div>
            </div>

            {/* Conclusions */}
            <div className="bg-green-50 p-6 rounded-lg border border-green-200">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-center mb-3">Conclusions</h3>
              <p className="text-gray-600 text-center mb-4">
                Craft conclusions that synthesize arguments and leave a lasting impression.
              </p>
              <div className="space-y-2">
                <div className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2 shrink-0" />
                  <span className="text-sm">Thesis restatement techniques</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2 shrink-0" />
                  <span className="text-sm">Argument synthesis strategies</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2 shrink-0" />
                  <span className="text-sm">Impactful closing statements</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'introductions',
      title: 'Introductions',
      badge: 'Component 1',
      content: (
        <div className="space-y-6">
          <div className="bg-blue-50 p-6 rounded-lg border-l-4 border-blue-400">
            <h3 className="text-xl font-semibold mb-3 text-blue-700">Key Elements of Strong Introductions</h3>
            <p className="text-blue-800 leading-relaxed">
              Your introduction sets the foundation for your entire essay. It should establish context, present your thesis, 
              and preview your main arguments in a compelling and sophisticated manner.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h4 className="font-semibold text-lg text-gray-900">Essential Components:</h4>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-semibold mt-0.5">1</div>
                  <div>
                    <h5 className="font-medium">Thesis Statement</h5>
                    <p className="text-sm text-gray-600">A clear, arguable claim that answers the question directly</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-semibold mt-0.5">2</div>
                  <div>
                    <h5 className="font-medium">Contextual Framing</h5>
                    <p className="text-sm text-gray-600">Background information relevant to your argument</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-semibold mt-0.5">3</div>
                  <div>
                    <h5 className="font-medium">Point Preview</h5>
                    <p className="text-sm text-gray-600">Brief overview of your main supporting arguments</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-semibold text-lg text-gray-900">Writing Tips:</h4>
              <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                <p className="text-sm text-gray-700">• Start with a hook that connects to your thesis</p>
                <p className="text-sm text-gray-700">• Keep it concise - aim for 150-200 words</p>
                <p className="text-sm text-gray-700">• Use sophisticated vocabulary and varied sentence structure</p>
                <p className="text-sm text-gray-700">• Avoid broad generalizations or obvious statements</p>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-semibold mb-2 text-gray-900">Quick Access:</h4>
            <Link href="/knowledge-bank/essay-guide/introductions" className="text-blue-600 hover:text-blue-800 flex items-center gap-2">
              View detailed introduction guide <ChevronRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      )
    },
    {
      id: 'body-paragraphs',
      title: 'Body Paragraphs',
      badge: 'Component 2',
      content: (
        <div className="space-y-6">
          <div className="bg-purple-50 p-6 rounded-lg border-l-4 border-purple-400">
            <h3 className="text-xl font-semibold mb-3 text-purple-700">PETAL Framework</h3>
            <p className="text-purple-800 leading-relaxed">
              The PETAL structure provides a systematic approach to building strong analytical paragraphs that demonstrate 
              sophisticated understanding and support your thesis effectively.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4">
            <div className="border-l-4 border-purple-400 pl-4">
              <h4 className="font-semibold text-purple-700 mb-2">P - Point</h4>
              <p className="text-gray-700">Start with a clear topic sentence that links to your thesis</p>
            </div>
            <div className="border-l-4 border-purple-400 pl-4">
              <h4 className="font-semibold text-purple-700 mb-2">E - Evidence</h4>
              <p className="text-gray-700">Provide relevant quotes or examples from the text</p>
            </div>
            <div className="border-l-4 border-purple-400 pl-4">
              <h4 className="font-semibold text-purple-700 mb-2">T - Technique</h4>
              <p className="text-gray-700">Identify and analyze the literary techniques used</p>
            </div>
            <div className="border-l-4 border-purple-400 pl-4">
              <h4 className="font-semibold text-purple-700 mb-2">A - Analysis</h4>
              <p className="text-gray-700">Explain how the evidence supports your point and thesis</p>
            </div>
            <div className="border-l-4 border-purple-400 pl-4">
              <h4 className="font-semibold text-purple-700 mb-2">L - Link</h4>
              <p className="text-gray-700">Connect back to your thesis and transition to the next idea</p>
            </div>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-semibold mb-2 text-gray-900">Quick Access:</h4>
            <Link href="/knowledge-bank/essay-guide/body-paragraphs" className="text-purple-600 hover:text-purple-800 flex items-center gap-2">
              View detailed body paragraph guide <ChevronRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      )
    },
    {
      id: 'conclusions',
      title: 'Conclusions',
      badge: 'Component 3',
      content: (
        <div className="space-y-6">
          <div className="bg-green-50 p-6 rounded-lg border-l-4 border-green-400">
            <h3 className="text-xl font-semibold mb-3 text-green-700">Powerful Conclusions</h3>
            <p className="text-green-800 leading-relaxed">
              Your conclusion should synthesize your arguments, reinforce your thesis, and leave a lasting impression 
              on your reader. It's your final opportunity to demonstrate sophisticated understanding.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h4 className="font-semibold text-lg text-gray-900">What to Include:</h4>
              <div className="space-y-3">
                <div className="bg-green-50 p-3 rounded-lg">
                  <h5 className="font-medium text-green-700">Thesis Restatement</h5>
                  <p className="text-sm text-green-600">Rephrase your thesis in new words</p>
                </div>
                <div className="bg-green-50 p-3 rounded-lg">
                  <h5 className="font-medium text-green-700">Argument Synthesis</h5>
                  <p className="text-sm text-green-600">Connect your main points together</p>
                </div>
                <div className="bg-green-50 p-3 rounded-lg">
                  <h5 className="font-medium text-green-700">Broader Implications</h5>
                  <p className="text-sm text-green-600">Consider wider significance or relevance</p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-semibold text-lg text-gray-900">What to Avoid:</h4>
              <div className="space-y-2">
                <div className="bg-red-50 p-3 rounded-lg border-l-4 border-red-400">
                  <p className="text-sm text-red-700">❌ Introducing new evidence or arguments</p>
                </div>
                <div className="bg-red-50 p-3 rounded-lg border-l-4 border-red-400">
                  <p className="text-sm text-red-700">❌ Simply repeating your introduction</p>
                </div>
                <div className="bg-red-50 p-3 rounded-lg border-l-4 border-red-400">
                  <p className="text-sm text-red-700">❌ Apologizing for your argument</p>
                </div>
                <div className="bg-red-50 p-3 rounded-lg border-l-4 border-red-400">
                  <p className="text-sm text-red-700">❌ Ending with rhetorical questions</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-semibold mb-2 text-gray-900">Quick Access:</h4>
            <Link href="/knowledge-bank/essay-guide/conclusions" className="text-green-600 hover:text-green-800 flex items-center gap-2">
              View detailed conclusion guide <ChevronRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      )
    },
    {
      id: 'faq',
      title: 'Frequently Asked Questions',
      badge: 'FAQ',
      content: (
        <div className="space-y-6">
          <div className="bg-gray-50 p-6 rounded-lg">
            <p className="text-gray-700 leading-relaxed">
              Here are some common questions students ask about essay writing, along with practical answers 
              to help you improve your writing skills.
            </p>
          </div>

          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1" className="border rounded-lg px-4 mb-2">
              <AccordionTrigger className="text-left hover:no-underline">
                How long should my essay introduction be?
              </AccordionTrigger>
              <AccordionContent className="text-gray-700 pt-2">
                For HSC English essays, aim for an introduction that's approximately 150-200 words. This gives you
                enough space to establish context, present your thesis, and outline your key points without being
                overly lengthy. Remember, your introduction should be roughly 10-15% of your total essay length.
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="item-2" className="border rounded-lg px-4 mb-2">
              <AccordionTrigger className="text-left hover:no-underline">
                How many quotes should I use per paragraph?
              </AccordionTrigger>
              <AccordionContent className="text-gray-700 pt-2">
                Quality over quantity is key. Typically, 1-2 well-analyzed quotes per paragraph is ideal. Focus on
                selecting evidence that directly supports your point and analyzing it thoroughly. It's better to have
                one quote that you analyze deeply than three quotes you mention superficially.
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="item-3" className="border rounded-lg px-4 mb-2">
              <AccordionTrigger className="text-left hover:no-underline">
                How can I improve my analysis?
              </AccordionTrigger>
              <AccordionContent className="text-gray-700 pt-2">
                Focus on explaining the "why" and "how" rather than just the "what." Consider multiple
                interpretations, connect to broader themes, and analyze how specific techniques create meaning and
                impact. Always link your analysis back to your thesis and consider the author's purpose.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-4" className="border rounded-lg px-4 mb-2">
              <AccordionTrigger className="text-left hover:no-underline">
                What's the difference between analysis and summary?
              </AccordionTrigger>
              <AccordionContent className="text-gray-700 pt-2">
                Summary tells what happens in the text, while analysis explains why it's significant and how it creates
                meaning. Instead of saying "The character dies," analyze "The character's death symbolizes the futility
                of their struggle and reinforces the text's exploration of human powerlessness."
              </AccordionContent>
            </AccordionItem>
          </Accordion>

          <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-400">
            <h4 className="font-semibold mb-2 text-blue-700">Need More Help?</h4>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="#" className="text-blue-600 hover:text-blue-800 flex items-center gap-2">
                <Mail className="h-4 w-4" /> Contact Us
              </Link>
              <Link href="#" className="text-blue-600 hover:text-blue-800 flex items-center gap-2">
                <HelpCircle className="h-4 w-4" /> Support
              </Link>
            </div>
          </div>
        </div>
      )
    }
  ]

  return (
    <SlideNavigation
      slides={slides}
      title="Essay Writing Guide"
      subtitle="Master the Art of HSC English Essays"
      headerColor="purple"
      backLink={{
        href: "/knowledge-bank",
        text: "Back to Knowledge Bank"
      }}
    />
  )
}
