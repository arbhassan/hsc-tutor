import Link from "next/link"
import Image from "next/image"
import {
  BookOpen,
  Award,
  ArrowRight,
  CheckCircle,
  ChevronRight,
  Star,
  Users,
  HelpCircle,
  Mail,
  LayoutPanelLeftIcon as LayoutParagraphLeft,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

export default function EssayGuidePage() {
  return (
    <main className="flex flex-col min-h-screen">
      {/* Hero Section */}
      {/* Overview Section */}
      <section className="py-16 bg-white">
        <div className="container px-4">
          <div className="text-center mb-12">
            <Badge className="mb-2">Complete Learning Path</Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Master Essay Structure</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Our comprehensive guide breaks down the complex art of essay writing into three essential components, each
              designed to help you develop the skills needed for Band 6 success.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
            {/* Module 1 */}
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader className="text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <BookOpen className="h-8 w-8 text-primary" />
                </div>
                <CardTitle className="text-2xl">Introductions</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-center">
                  Learn to craft compelling introductions with strong thesis statements, contextual framing, and clear
                  points that set the foundation for your entire essay.
                </p>
                <div className="mt-6 space-y-2">
                  <div className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2 shrink-0" />
                    <span className="text-sm">Thesis statement development</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2 shrink-0" />
                    <span className="text-sm">Contextual framing techniques</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2 shrink-0" />
                    <span className="text-sm">Point preview strategies</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2 shrink-0" />
                    <span className="text-sm">Answering the question effectively</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="pt-0 flex justify-center">
                <Link href="/knowledge-bank/essay-guide/introductions">
                  <Button variant="outline" className="w-full">
                    Explore <ChevronRight className="ml-1 h-4 w-4" />
                  </Button>
                </Link>
              </CardFooter>
            </Card>

            {/* Module 2 */}
            <Card className="hover:shadow-lg transition-shadow border-primary">
              <CardHeader className="text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <LayoutParagraphLeft className="h-8 w-8 text-primary" />
                </div>
                <CardTitle className="text-2xl">Body Paragraphs</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-center">
                  Master the PETAL framework, sophisticated arguments, and effective textual evidence to create
                  compelling analytical paragraphs.
                </p>
                <div className="mt-6 space-y-2">
                  <div className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2 shrink-0" />
                    <span className="text-sm">PETAL paragraph structure</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2 shrink-0" />
                    <span className="text-sm">Sophisticated argument techniques</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2 shrink-0" />
                    <span className="text-sm">Effective textual evidence integration</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2 shrink-0" />
                    <span className="text-sm">Analytical depth and clarity</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="pt-0 flex justify-center">
                <Link href="/knowledge-bank/essay-guide/body-paragraphs">
                  <Button className="w-full">
                    Explore <ChevronRight className="ml-1 h-4 w-4" />
                  </Button>
                </Link>
              </CardFooter>
            </Card>

            {/* Module 3 */}
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader className="text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Award className="h-8 w-8 text-primary" />
                </div>
                <CardTitle className="text-2xl">Conclusions</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-center">
                  Craft conclusions that synthesize your arguments, reinforce your thesis, and leave a lasting
                  impression on your reader.
                </p>
                <div className="mt-6 space-y-2">
                  <div className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2 shrink-0" />
                    <span className="text-sm">Thesis restatement techniques</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2 shrink-0" />
                    <span className="text-sm">Argument synthesis strategies</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2 shrink-0" />
                    <span className="text-sm">Impactful closing statements</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2 shrink-0" />
                    <span className="text-sm">Broader implications and insights</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="pt-0 flex justify-center">
                <Link href="/knowledge-bank/essay-guide/conclusions">
                  <Button variant="outline" className="w-full">
                    Explore <ChevronRight className="ml-1 h-4 w-4" />
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          </div>
        </div>
      </section>

           {/* Testimonials */}
      <section className="py-16 bg-white">
        <div className="container px-4">
          <div className="text-center mb-12">
            <Badge className="mb-2">Success Stories</Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">From Our Band 6 Students</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              See how our essay writing guide has helped students achieve excellence in their HSC English exams.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Testimonial 1 */}
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center mb-4">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                    ))}
                  </div>
                </div>
                <p className="text-sm text-muted-foreground mb-6">
                  "The PETAL framework completely transformed my essay writing. I went from Band 4 to Band 6 in my trial
                  exams after following this guide. The color-coded examples made it so easy to understand how to
                  structure my paragraphs."
                </p>
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center mr-3">
                    <Users className="h-5 w-5 text-gray-500" />
                  </div>
                  <div>
                    <p className="font-medium text-sm">Sarah T.</p>
                    <p className="text-xs text-muted-foreground">Band 6 in Advanced English</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Testimonial 2 */}
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center mb-4">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                    ))}
                  </div>
                </div>
                <p className="text-sm text-muted-foreground mb-6">
                  "I always struggled with introductions until I found this guide. The three-component approach made it
                  so clear how to start my essays effectively. My teacher was impressed with how much my writing
                  improved in just a few weeks!"
                </p>
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center mr-3">
                    <Users className="h-5 w-5 text-gray-500" />
                  </div>
                  <div>
                    <p className="font-medium text-sm">Michael L.</p>
                    <p className="text-xs text-muted-foreground">Band 6 in Extension 1</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Testimonial 3 */}
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center mb-4">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                    ))}
                  </div>
                </div>
                <p className="text-sm text-muted-foreground mb-6">
                  "The section on elevating analysis was a game-changer for me. I learned how to transform basic
                  observations into sophisticated arguments that impressed my markers. This guide helped me secure my
                  place at UNSW!"
                </p>
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center mr-3">
                    <Users className="h-5 w-5 text-gray-500" />
                  </div>
                  <div>
                    <p className="font-medium text-sm">Aisha K.</p>
                    <p className="text-xs text-muted-foreground">Band 6 in Advanced English</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Navigation */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="#" className="text-gray-300 hover:text-white text-sm">
                    Home
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-gray-300 hover:text-white text-sm">
                    All Modules
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-gray-300 hover:text-white text-sm">
                    Practice Essays
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-gray-300 hover:text-white text-sm">
                    Resources
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-gray-300 hover:text-white text-sm">
                    Success Stories
                  </Link>
                </li>
              </ul>
            </div>

            {/* Modules */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Essay Components</h3>
              <ul className="space-y-2">
                <li>
                  <Link
                    href="/knowledge-bank/essay-guide/introductions"
                    className="text-gray-300 hover:text-white text-sm"
                  >
                    Introductions
                  </Link>
                </li>
                <li>
                  <Link
                    href="/knowledge-bank/essay-guide/body-paragraphs"
                    className="text-gray-300 hover:text-white text-sm"
                  >
                    Body Paragraphs
                  </Link>
                </li>
                <li>
                  <Link
                    href="/knowledge-bank/essay-guide/body-paragraphs#petal"
                    className="text-gray-300 hover:text-white text-sm"
                  >
                    PETAL Structure
                  </Link>
                </li>
                <li>
                  <Link
                    href="/knowledge-bank/essay-guide/body-paragraphs#arguments"
                    className="text-gray-300 hover:text-white text-sm"
                  >
                    Sophisticated Arguments
                  </Link>
                </li>
                <li>
                  <Link
                    href="/knowledge-bank/essay-guide/conclusions"
                    className="text-gray-300 hover:text-white text-sm"
                  >
                    Conclusions
                  </Link>
                </li>
              </ul>
            </div>

            {/* FAQ */}
            <div className="md:col-span-2">
              <h3 className="text-lg font-semibold mb-4">Frequently Asked Questions</h3>
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="item-1">
                  <AccordionTrigger className="text-sm">How long should my essay introduction be?</AccordionTrigger>
                  <AccordionContent className="text-sm text-gray-300">
                    For HSC English essays, aim for an introduction that's approximately 150-200 words. This gives you
                    enough space to establish context, present your thesis, and outline your key points without being
                    overly lengthy.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-2">
                  <AccordionTrigger className="text-sm">How many quotes should I use per paragraph?</AccordionTrigger>
                  <AccordionContent className="text-sm text-gray-300">
                    Quality over quantity is key. Typically, 1-2 well-analyzed quotes per paragraph is ideal. Focus on
                    selecting evidence that directly supports your point and analyzing it thoroughly.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-3">
                  <AccordionTrigger className="text-sm">How can I improve my analysis?</AccordionTrigger>
                  <AccordionContent className="text-sm text-gray-300">
                    Focus on explaining the "why" and "how" rather than just the "what." Consider multiple
                    interpretations, connect to broader themes, and analyze how specific techniques create meaning and
                    impact.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          </div>

          <div className="mt-12 pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-gray-400 mb-4 md:mb-0">© 2025 HSC English Success. All rights reserved.</p>
            <div className="flex items-center space-x-4">
              <Link href="#" className="text-gray-300 hover:text-white flex items-center text-sm">
                <Mail className="h-4 w-4 mr-1" /> Contact Us
              </Link>
              <Link href="#" className="text-gray-300 hover:text-white flex items-center text-sm">
                <HelpCircle className="h-4 w-4 mr-1" /> Support
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </main>
  )
}
