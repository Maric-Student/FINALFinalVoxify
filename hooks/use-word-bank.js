"use client"

import { useState, useEffect, useCallback } from "react"

export const useWordBank = () => {
  const [words, setWords] = useState([])
  const [categories, setCategories] = useState([])
  const [selectedCategory, setSelectedCategory] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  // Fetch categories
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

  // Add a new word
  const addWord = useCallback(
    async (wordData) => {
      try {
        const response = await fetch("/api/words", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(wordData),
        })

        const data = await response.json()

        if (data.success) {
          // If the new word belongs to the currently selected category, add it to the list
          if (data.data.categoryId.toString() === selectedCategory) {
            setWords((prevWords) => [...prevWords, data.data])
          }
          return { success: true, data: data.data }
        } else {
          setError(data.message || "Failed to add word")
          return { success: false, error: data.message }
        }
      } catch (err) {
        console.error("Error adding word:", err)
        setError("Failed to add word")
        return { success: false, error: "Failed to add word" }
      }
    },
    [selectedCategory],
  )

  return {
    words,
    categories,
    selectedCategory,
    setSelectedCategory,
    loading,
    error,
    addWord,
  }
}

export default useWordBank
