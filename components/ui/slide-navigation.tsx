"use client"

import React, { useState, ReactNode } from "react"
import { ChevronLeft, ChevronRight, Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

export interface SlideData {
  id: string
  title: string
  content: ReactNode
  badge?: string
}

interface SlideNavigationProps {
  slides: SlideData[]
  title: string
  subtitle?: string
  headerColor?: string
  backLink?: {
    href: string
    text: string
  }
}

export function SlideNavigation({ 
  slides, 
  title, 
  subtitle, 
  headerColor = "blue",
  backLink 
}: SlideNavigationProps) {
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  const goToSlide = (index: number) => {
    setCurrentSlideIndex(index)
    setIsSidebarOpen(false)
  }

  const nextSlide = () => {
    if (currentSlideIndex < slides.length - 1) {
      setCurrentSlideIndex(currentSlideIndex + 1)
    }
  }

  const prevSlide = () => {
    if (currentSlideIndex > 0) {
      setCurrentSlideIndex(currentSlideIndex - 1)
    }
  }

  const currentSlide = slides[currentSlideIndex]

  return (
    <div className="min-h-screen bg-white flex">
      {/* Mobile Menu Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={cn(
        "fixed lg:static inset-y-0 left-0 z-50 w-80 bg-gray-50 border-r border-gray-200 transform transition-transform duration-300 ease-in-out lg:translate-x-0",
        isSidebarOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="flex flex-col h-full">
          {/* Sidebar Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
              {subtitle && (
                <p className="text-sm text-gray-600">{subtitle}</p>
              )}
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => setIsSidebarOpen(false)}
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Slide Navigation */}
          <div className="flex-1 overflow-y-auto">
            <div className="p-4 space-y-2">
              {slides.map((slide, index) => (
                <button
                  key={slide.id}
                  onClick={() => goToSlide(index)}
                  className={cn(
                    "w-full text-left p-3 rounded-lg transition-colors duration-200",
                    "hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500",
                    index === currentSlideIndex
                      ? "bg-blue-50 border border-blue-200 text-blue-700"
                      : "text-gray-700"
                  )}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">
                          {index + 1}. {slide.title}
                        </span>
                        {slide.badge && (
                          <Badge variant="secondary" className="text-xs">
                            {slide.badge}
                          </Badge>
                        )}
                      </div>
                    </div>
                    {index === currentSlideIndex && (
                      <ChevronRight className="h-4 w-4 text-blue-500" />
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Progress Indicator */}
          <div className="p-4 border-t border-gray-200">
            <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
              <span>Progress</span>
              <span>{currentSlideIndex + 1} of {slides.length}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${((currentSlideIndex + 1) / slides.length) * 100}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
          <div className="px-4 lg:px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Button
                  variant="ghost"
                  size="icon"
                  className="lg:hidden"
                  onClick={() => setIsSidebarOpen(true)}
                >
                  <Menu className="h-5 w-5" />
                </Button>
                
                {backLink && (
                  <a
                    href={backLink.href}
                    className="text-blue-600 hover:text-blue-800 flex items-center gap-2 text-sm"
                  >
                    <ChevronLeft className="h-4 w-4" />
                    {backLink.text}
                  </a>
                )}
              </div>

              <div className="flex items-center gap-4">
                <div className="text-sm text-gray-600 hidden sm:block">
                  {currentSlideIndex + 1} of {slides.length}
                </div>
                
                <div className="flex items-center gap-1">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={prevSlide}
                    disabled={currentSlideIndex === 0}
                  >
                    <ChevronLeft className="h-4 w-4" />
                    <span className="hidden sm:inline ml-1">Previous</span>
                  </Button>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={nextSlide}
                    disabled={currentSlideIndex === slides.length - 1}
                  >
                    <span className="hidden sm:inline mr-1">Next</span>
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 overflow-y-auto">
          <div className="p-4 lg:p-8 max-w-4xl mx-auto">
            {/* Slide Header */}
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-4">
                <div className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-semibold",
                  headerColor === "blue" && "bg-blue-600",
                  headerColor === "green" && "bg-green-600", 
                  headerColor === "orange" && "bg-orange-600",
                  headerColor === "teal" && "bg-teal-600",
                  headerColor === "purple" && "bg-purple-600"
                )}>
                  {currentSlideIndex + 1}
                </div>
                <h1 className="text-3xl lg:text-4xl font-bold text-gray-900">
                  {currentSlide.title}
                </h1>
                {currentSlide.badge && (
                  <Badge variant="secondary">
                    {currentSlide.badge}
                  </Badge>
                )}
              </div>
            </div>

            {/* Slide Content */}
            <div className="prose prose-lg max-w-none">
              {currentSlide.content}
            </div>

            {/* Navigation Footer */}
            <div className="mt-12 pt-8 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <Button
                  variant="outline"
                  onClick={prevSlide}
                  disabled={currentSlideIndex === 0}
                  className="flex items-center gap-2"
                >
                  <ChevronLeft className="h-4 w-4" />
                  Previous
                </Button>

                <div className="flex items-center gap-2">
                  {slides.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => goToSlide(index)}
                      className={cn(
                        "w-3 h-3 rounded-full transition-colors",
                        index === currentSlideIndex
                          ? "bg-blue-600"
                          : "bg-gray-300 hover:bg-gray-400"
                      )}
                      aria-label={`Go to slide ${index + 1}`}
                    />
                  ))}
                </div>

                <Button
                  variant="default"
                  onClick={nextSlide}
                  disabled={currentSlideIndex === slides.length - 1}
                  className="flex items-center gap-2"
                >
                  Next
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
