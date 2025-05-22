"use client"

import { useState, useEffect } from "react"
import { useSpeech } from "../hooks/use-speech"

const WordBank = ({ onAddWord }) => {
  const [words, setWords] = useState([])
  const [categories, setCategories] = useState([])
  const [selectedCategory, setSelectedCategory] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const { speak } = useSpeech()

  // Fetch categories on component mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch("/api/categories")
        const data = await response.json()

        if (data.success) {
          setCategories(data.data)
          // Set the first category as selected by default if available
          if (data.data.length > 0) {
            setSelectedCategory(data.data[0].id.toString())
          }
        } else {
          setError("Failed to load categories")
        }
      } catch (err) {
        console.error("Error fetching categories:", err)
        setError("Failed to load categories")
      }
    }

    fetchCategories()
  }, [])

  // Fetch words when selected category changes
  useEffect(() => {
    if (!selectedCategory) return

    const fetchWords = async () => {
      setLoading(true)
      setError(null)

      try {
        const response = await fetch(`/api/words?categoryId=${selectedCategory}`)
        const data = await response.json()

        if (data.success) {
          setWords(data.data)
        } else {
          setError("Failed to load words")
        }
      } catch (err) {
        console.error("Error fetching words:", err)
        setError("Failed to load words")
      } finally {
        setLoading(false)
      }
    }

    fetchWords()
  }, [selectedCategory])

  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value)
  }

  const handleWordClick = (word) => {
    speak(word.text)
    if (onAddWord) {
      onAddWord(word)
    }
  }

  return (
    <div className="word-bank">
      <h2>Word Bank</h2>

      <div className="category-selector">
        <label htmlFor="category-select">Category:</label>
        <select id="category-select" value={selectedCategory} onChange={handleCategoryChange}>
          {categories.length === 0 && <option value="">Loading categories...</option>}
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
      </div>

      {loading && <p>Loading words...</p>}
      {error && <p className="error">{error}</p>}

      <div className="words-container">
        {words.length === 0 && !loading && !error ? (
          <p>No words found in this category</p>
        ) : (
          words.map((word) => (
            <div key={word.id} className="word-item" onClick={() => handleWordClick(word)}>
              <img src={word.imageUrl || "/placeholder.svg"} alt={word.text} className="word-image" />
              <p className="word-text">{word.text}</p>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default WordBank
