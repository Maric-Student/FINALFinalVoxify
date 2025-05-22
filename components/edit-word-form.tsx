"use client"

import type React from "react"

import { useState } from "react"
import { ChevronDown } from "lucide-react"

interface Category {
  id: number
  name: string
}

interface Word {
  id: number | string
  text: string
  imageUrl: string
  categoryId: number
}

interface EditWordFormProps {
  word: Word
  onSaveWord: (word: Word) => void
  categories: Category[]
  language: "english" | "tagalog"
}

/**
 * EditWordForm component
 *
 * Form for editing existing words in the application.
 * Supports updating word data.
 */
export default function EditWordForm({ word, onSaveWord, categories, language }: EditWordFormProps) {
  // Form state
  const [text, setText] = useState(word.text)
  const [categoryId, setCategoryId] = useState(word.categoryId.toString())
  const [selectedImage, setSelectedImage] = useState(word.imageUrl)
  const [error, setError] = useState<string | null>(null)

  /**
   * Handle form submission
   * Updates the word and calls the onSaveWord callback
   */
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!text.trim() || !categoryId) {
      setError("Please enter word text and select a category")
      return
    }

    // Create updated word object
    const updatedWord = {
      id: word.id,
      text,
      imageUrl:
        text !== word.text ? `/placeholder.svg?height=100&width=100&text=${encodeURIComponent(text)}` : selectedImage,
      categoryId: Number.parseInt(categoryId),
    }

    // Notify parent component
    onSaveWord(updatedWord)
  }

  // Get translations based on language
  const translations = {
    english: {
      wordPhrase: "Word/Phrase",
      enterWord: "Enter word or phrase",
      category: "Category",
      selectCategory: "Select a category",
      saveWord: "Save Changes",
      currentImage: "Current Image",
      error: {
        fillFields: "Please enter word text and select a category",
      },
    },
    tagalog: {
      wordPhrase: "Salita/Parirala",
      enterWord: "Ilagay ang salita o parirala",
      category: "Kategorya",
      selectCategory: "Pumili ng kategorya",
      saveWord: "I-save ang mga Pagbabago",
      currentImage: "Kasalukuyang Larawan",
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

        <div className="mb-4">
          <p className="block mb-1 font-medium text-gray-700 dark:text-gray-300">{t.currentImage}</p>
          <div className="flex justify-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <img src={selectedImage || "/placeholder.svg"} alt={text} className="h-24 w-24 object-contain" />
          </div>
        </div>

        <button type="submit" className="app-button-primary w-full">
          {t.saveWord}
        </button>
      </form>
    </div>
  )
}
