"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useSpeech } from "@/hooks/use-speech"
import { ChevronDown } from "lucide-react"

interface Word {
  id: number
  text: string
  imageUrl: string
  categoryId: number
}

interface Category {
  id: number
  name: string
}

export default function WordBank({ onAddWord }: { onAddWord?: (word: Word) => void }) {
  const [words, setWords] = useState<Word[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string>("")
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)
  const { speak } = useSpeech()

  // For preview purposes, we'll use mock data
  useEffect(() => {
    // Mock categories data
    const mockCategories = [
      { id: 1, name: "Common" },
      { id: 2, name: "Actions" },
      { id: 3, name: "Feelings" },
      { id: 4, name: "Food" },
      { id: 5, name: "Places" },
    ]

    setCategories(mockCategories)
    setSelectedCategory("1")
  }, [])

  useEffect(() => {
    if (!selectedCategory) return

    setLoading(true)

    // Mock words data based on selected category
    setTimeout(() => {
      const categoryId = Number.parseInt(selectedCategory)
      let mockWords: Word[] = []

      if (categoryId === 1) {
        mockWords = [
          { id: 1, text: "Hello", imageUrl: "/placeholder.svg?height=100&width=100", categoryId: 1 },
          { id: 2, text: "Yes", imageUrl: "/placeholder.svg?height=100&width=100", categoryId: 1 },
          { id: 3, text: "No", imageUrl: "/placeholder.svg?height=100&width=100", categoryId: 1 },
          { id: 4, text: "Thank you", imageUrl: "/placeholder.svg?height=100&width=100", categoryId: 1 },
          { id: 5, text: "Please", imageUrl: "/placeholder.svg?height=100&width=100", categoryId: 1 },
        ]
      } else if (categoryId === 2) {
        mockWords = [
          { id: 6, text: "Eat", imageUrl: "/placeholder.svg?height=100&width=100", categoryId: 2 },
          { id: 7, text: "Drink", imageUrl: "/placeholder.svg?height=100&width=100", categoryId: 2 },
          { id: 8, text: "Walk", imageUrl: "/placeholder.svg?height=100&width=100", categoryId: 2 },
          { id: 9, text: "Run", imageUrl: "/placeholder.svg?height=100&width=100", categoryId: 2 },
          { id: 10, text: "Sleep", imageUrl: "/placeholder.svg?height=100&width=100", categoryId: 2 },
        ]
      } else if (categoryId === 3) {
        mockWords = [
          { id: 11, text: "Happy", imageUrl: "/placeholder.svg?height=100&width=100", categoryId: 3 },
          { id: 12, text: "Sad", imageUrl: "/placeholder.svg?height=100&width=100", categoryId: 3 },
          { id: 13, text: "Angry", imageUrl: "/placeholder.svg?height=100&width=100", categoryId: 3 },
          { id: 14, text: "Tired", imageUrl: "/placeholder.svg?height=100&width=100", categoryId: 3 },
          { id: 15, text: "Excited", imageUrl: "/placeholder.svg?height=100&width=100", categoryId: 3 },
        ]
      }

      setWords(mockWords)
      setLoading(false)
    }, 500)
  }, [selectedCategory])

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCategory(e.target.value)
  }

  const handleWordClick = (word: Word) => {
    speak(word.text)
    if (onAddWord) {
      onAddWord(word)
    }
  }

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Word Bank</h2>

      <div className="mb-4 relative">
        <select id="category-select" value={selectedCategory} onChange={handleCategoryChange} className="app-select">
          {categories.length === 0 && <option value="">Loading categories...</option>}
          {categories.map((category) => (
            <option key={category.id} value={category.id.toString()}>
              {category.name}
            </option>
          ))}
        </select>
        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
          <ChevronDown className="h-4 w-4 text-gray-500" />
        </div>
      </div>

      {loading && (
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        </div>
      )}

      {error && <div className="bg-red-50 dark:bg-red-900/20 text-red-500 p-3 rounded-xl mb-4">{error}</div>}

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
        {words.length === 0 && !loading && !error ? (
          <p className="col-span-full text-center text-gray-500 dark:text-gray-400 py-8">
            No words found in this category
          </p>
        ) : (
          words.map((word) => (
            <div key={word.id} className="word-item" onClick={() => handleWordClick(word)}>
              <img src={word.imageUrl || "/placeholder.svg"} alt={word.text} className="word-image" />
              <p className="text-center text-sm font-medium">{word.text}</p>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
