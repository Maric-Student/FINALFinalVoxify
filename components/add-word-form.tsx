"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { ChevronDown } from "lucide-react"

interface Category {
  id: number
  name: string
}

interface Word {
  id: number
  text: string
  imageUrl: string
  categoryId: number
}

interface AddWordFormProps {
  onAddWord?: (word: Word) => void
  categories: Category[]
  language: "english" | "tagalog"
}

/**
 * AddWordForm component
 *
 * Form for adding new words to the application.
 * Supports selecting categories.
 */
export default function AddWordForm({ onAddWord, categories, language }: AddWordFormProps) {
  // Form state
  const [text, setText] = useState("")
  const [categoryId, setCategoryId] = useState("")
  const [error, setError] = useState<string | null>(null)

  // Set default category
  useEffect(() => {
    if (categories.length > 0 && !categoryId) {
      setCategoryId(categories[0].id.toString())
    }
  }, [categories, categoryId])

  /**
   * Handle form submission
   * Creates a new word and calls the onAddWord callback
   */
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!text.trim() || !categoryId) {
      setError("Please enter word text and select a category")
      return
    }

    // Mock adding a new word
    const newWord = {
      id: Math.floor(Math.random() * 1000),
      text,
      imageUrl: `/placeholder.svg?height=100&width=100&text=${encodeURIComponent(text)}`,
      categoryId: Number.parseInt(categoryId),
    }

    // Notify parent component
    if (onAddWord) {
      onAddWord(newWord)
    }

    // Clear form
    setText("")
  }

  // Get translations based on language
  const translations = {
    english: {
      wordPhrase: "Word/Phrase",
      enterWord: "Enter word or phrase",
      category: "Category",
      selectCategory: "Select a category",
      addWord: "Add Word",
      error: {
        fillFields: "Please enter word text and select a category",
      },
    },
    tagalog: {
      wordPhrase: "Salita/Parirala",
      enterWord: "Ilagay ang salita o parirala",
      category: "Kategorya",
      selectCategory: "Pumili ng kategorya",
      addWord: "Idagdag ang Salita",
      error: {
        fillFields: "Mangyaring maglagay ng teksto ng salita at pumili ng kategorya",
      },
    },
  }

  // Get current translations
  const t = translations[language]

  return (
    <div>
      {!error ? null : <div className="auth-error">{error}</div>}

      <form onSubmit={handleSubmit} className="auth-form">
        <div>
          <label htmlFor="word-text" className="block mb-1 font-medium text-gray-700 dark:text-gray-300">
            {t.wordPhrase}
          </label>
          <input
            id="word-text"
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder={t.enterWord}
            className="app-input"
            required
          />
        </div>

        <div>
          <label htmlFor="category-select" className="block mb-1 font-medium text-gray-700 dark:text-gray-300">
            {t.category}
          </label>
          <div className="relative">
            <select
              id="category-select"
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              className="app-select"
              required
            >
              <option value="">{t.selectCategory}</option>
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
        </div>

        <button type="submit" className="app-button-primary w-full">
          {t.addWord}
        </button>
      </form>
    </div>
  )
}
