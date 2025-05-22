"use client"

import { useState, useEffect } from "react"

const AddWordForm = ({ onAddWord }) => {
  const [text, setText] = useState("")
  const [categoryId, setCategoryId] = useState("")
  const [categories, setCategories] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const [pictograms, setPictograms] = useState([])
  const [selectedImage, setSelectedImage] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

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
            setCategoryId(data.data[0].id.toString())
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

  const searchPictograms = async () => {
    if (!searchTerm.trim()) return

    setLoading(true)
    setError(null)

    try {
      const response = await fetch(`/api/arasaac?query=${encodeURIComponent(searchTerm)}`)
      const data = await response.json()

      if (data.success) {
        setPictograms(data.data.slice(0, 9)) // Limit to 9 results for UI simplicity
      } else {
        setError("Failed to load pictograms")
      }
    } catch (err) {
      console.error("Error searching pictograms:", err)
      setError("Failed to load pictograms")
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!text.trim() || !categoryId) {
      setError("Please enter word text and select a category")
      return
    }

    try {
      const response = await fetch("/api/words", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text,
          categoryId,
          imageUrl: selectedImage || "/placeholder.svg?height=100&width=100",
        }),
      })

      const data = await response.json()

      if (data.success) {
        // Clear form
        setText("")
        setSearchTerm("")
        setPictograms([])
        setSelectedImage("")

        // Notify parent component
        if (onAddWord) {
          onAddWord(data.data)
        }
      } else {
        setError(data.message || "Failed to add word")
      }
    } catch (err) {
      console.error("Error adding word:", err)
      setError("Failed to add word")
    }
  }

  return (
    <div className="add-word-form">
      <h2>Add New Word</h2>

      {error && <p className="error">{error}</p>}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="word-text">Word/Phrase:</label>
          <input
            id="word-text"
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Enter word or phrase"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="category-select">Category:</label>
          <select id="category-select" value={categoryId} onChange={(e) => setCategoryId(e.target.value)} required>
            <option value="">Select a category</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="image-search">Search for Image:</label>
          <div className="search-container">
            <input
              id="image-search"
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search Arasaac pictograms"
            />
            <button type="button" onClick={searchPictograms} disabled={loading}>
              {loading ? "Searching..." : "Search"}
            </button>
          </div>
        </div>

        {pictograms.length > 0 && (
          <div className="pictogram-results">
            <h3>Select an Image:</h3>
            <div className="pictogram-grid">
              {pictograms.map((pictogram) => {
                const imageUrl = `https://static.arasaac.org/pictograms/${pictogram._id}/${pictogram._id}_300.png`
                return (
                  <div
                    key={pictogram._id}
                    className={`pictogram-item ${selectedImage === imageUrl ? "selected" : ""}`}
                    onClick={() => setSelectedImage(imageUrl)}
                  >
                    <img src={imageUrl || "/placeholder.svg"} alt={pictogram.keywords[0].keyword} />
                  </div>
                )
              })}
            </div>
          </div>
        )}

        <button type="submit" className="submit-button">
          Add Word
        </button>
      </form>
    </div>
  )
}

export default AddWordForm
