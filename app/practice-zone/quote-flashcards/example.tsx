"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { ChevronLeft, ChevronRight, RotateCcw, CheckCircle, XCircle, Eye } from "lucide-react"

export default function QuoteFlashcardsExample() {
  // This is a simplified example to show the feature in action
  const [showAnswers, setShowAnswers] = useState(false)

  // Example of a quote with randomly selected words hidden
  const passage = {
    id: "1984-example",
    text: "It was a bright cold day in April, and the clocks were striking thirteen. Winston Smith, his chin nuzzled into his breast in an effort to escape the vile wind, slipped quickly through the glass doors of Victory Mansions, though not quickly enough to prevent a swirl of gritty dust from entering along with him.",
    source: "1984, George Orwell - Opening paragraph",
    clozeWords: [
      { word: "bright", startIndex: 9, endIndex: 15, isHidden: true },
      { word: "cold", startIndex: 16, endIndex: 20, isHidden: true },
      { word: "April", startIndex: 28, endIndex: 33, isHidden: true },
      { word: "clocks", startIndex: 44, endIndex: 50, isHidden: true },
      { word: "thirteen", startIndex: 69, endIndex: 78, isHidden: true },
      { word: "Winston", startIndex: 80, endIndex: 87, isHidden: true },
      { word: "Smith", startIndex: 88, endIndex: 93, isHidden: true },
      { word: "chin", startIndex: 100, endIndex: 104, isHidden: true },
      { word: "breast", startIndex: 123, endIndex: 129, isHidden: true },
      { word: "vile", startIndex: 156, endIndex: 160, isHidden: true },
      { word: "wind", startIndex: 161, endIndex: 165, isHidden: true },
      { word: "Victory", startIndex: 213, endIndex: 220, isHidden: true },
      { word: "Mansions", startIndex: 221, endIndex: 229, isHidden: true },
      { word: "gritty", startIndex: 280, endIndex: 286, isHidden: true },
      { word: "dust", startIndex: 287, endIndex: 291, isHidden: true },
    ],
  }

  // Simulate user inputs with some correct, some incorrect, and some empty
  const userInputs = {
    "1984-example-0": "bright", // correct
    "1984-example-1": "cool", // incorrect
    "1984-example-2": "April", // correct
    "1984-example-3": "clocks", // correct
    "1984-example-4": "thirteen", // correct
    "1984-example-5": "Winston", // correct
    "1984-example-6": "", // empty
    "1984-example-7": "", // empty
    "1984-example-8": "chest", // incorrect
    "1984-example-9": "cold", // incorrect
    "1984-example-10": "wind", // correct
    "1984-example-11": "Victory", // correct
    "1984-example-12": "", // empty
    "1984-example-13": "gritty", // correct
    "1984-example-14": "dirt", // incorrect
  }

  // Simulate results based on user inputs
  const results = {
    "1984-example-0": true,
    "1984-example-1": false,
    "1984-example-2": true,
    "1984-example-3": true,
    "1984-example-4": true,
    "1984-example-5": true,
    "1984-example-6": false, // empty counts as incorrect for this example
    "1984-example-7": false, // empty counts as incorrect for this example
    "1984-example-8": false,
    "1984-example-9": false,
    "1984-example-10": true,
    "1984-example-11": true,
    "1984-example-12": false, // empty counts as incorrect for this example
    "1984-example-13": true,
    "1984-example-14": false,
  }

  const renderClozePassage = () => {
    let lastIndex = 0
    const elements = []

    passage.clozeWords.forEach((clozeWord, wordIndex) => {
      // Add text before the cloze word
      if (clozeWord.startIndex > lastIndex) {
        elements.push(<span key={`text-${lastIndex}`}>{passage.text.substring(lastIndex, clozeWord.startIndex)}</span>)
      }

      // Add the cloze word (either as input or revealed text)
      const inputKey = `${passage.id}-${wordIndex}`

      if (clozeWord.isHidden) {
        if (showAnswers) {
          elements.push(
            <span
              key={inputKey}
              className="px-1 py-0.5 rounded font-medium bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200"
            >
              {clozeWord.word}
            </span>,
          )
        } else {
          const result = results[inputKey]
          const inputClasses =
            userInputs[inputKey] === ""
              ? "border-b-2 border-gray-300 dark:border-gray-600 focus:border-primary dark:focus:border-primary bg-transparent w-24 px-1 mx-0.5 text-center"
              : result
                ? "border-b-2 border-green-500 bg-green-50 dark:bg-green-900/20 dark:border-green-700 w-24 px-1 mx-0.5 text-center"
                : "border-b-2 border-red-500 bg-red-50 dark:bg-red-900/20 dark:border-red-700 w-24 px-1 mx-0.5 text-center"

          elements.push(
            <Input
              key={inputKey}
              type="text"
              value={userInputs[inputKey] || ""}
              readOnly
              className={inputClasses}
              placeholder="Type here"
            />,
          )
        }
      } else {
        elements.push(<span key={inputKey}>{clozeWord.word}</span>)
      }

      lastIndex = clozeWord.endIndex + 1
    })

    // Add any remaining text
    if (lastIndex < passage.text.length) {
      elements.push(<span key={`text-end`}>{passage.text.substring(lastIndex)}</span>)
    }

    return (
      <div className="space-y-4">
        <div className="text-lg leading-relaxed">{elements}</div>
        <div className="text-sm text-muted-foreground italic">— {passage.source}</div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Quote Memorisation Example</h1>
        <p className="text-muted-foreground mt-1">1984 quote with randomly missing words</p>
      </div>

      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <Button variant="outline" disabled>
            <ChevronLeft className="h-4 w-4 mr-2" />
            Previous Quote
          </Button>
          <div className="flex items-center space-x-2">
            <Badge variant="outline">Example Quote</Badge>
          </div>
        </div>

        <Card className="border-2">
          <CardHeader>
            <CardTitle>1984 Key Quotes</CardTitle>
            <CardDescription>Fill in the blanks to complete the passage</CardDescription>
          </CardHeader>
          <CardContent>{renderClozePassage()}</CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <div className="flex justify-between w-full">
              <div className="space-x-2">
                <Button variant="outline" disabled>
                  <ChevronLeft className="h-4 w-4 mr-1" />
                  Previous
                </Button>
                <Button variant="outline" disabled>
                  Next
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </div>
              <div className="space-x-2">
                <Button variant="outline" disabled>
                  <RotateCcw className="h-4 w-4 mr-1" />
                  Reset
                </Button>
                {!showAnswers ? (
                  <Button variant="secondary" onClick={() => setShowAnswers(true)}>
                    <Eye className="h-4 w-4 mr-1" />
                    Reveal Answers
                  </Button>
                ) : (
                  <Button variant="secondary" onClick={() => setShowAnswers(false)}>
                    Hide Answers
                  </Button>
                )}
              </div>
            </div>

            <div className="w-full pt-2 border-t">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">
                  {Object.values(results).filter(Boolean).length} of {Object.values(results).length} correct
                </span>
                <div className="flex items-center space-x-1">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span className="text-sm text-green-500 font-medium">
                    {Object.values(results).filter(Boolean).length}
                  </span>
                  <span className="text-sm text-muted-foreground mx-1">/</span>
                  <XCircle className="h-4 w-4 text-red-500" />
                  <span className="text-sm text-red-500 font-medium">
                    {Object.values(results).filter((result) => !result).length}
                  </span>
                </div>
              </div>
              <Progress
                value={(Object.values(results).filter(Boolean).length / Object.values(results).length) * 100}
                className="h-2 mt-2"
              />
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
