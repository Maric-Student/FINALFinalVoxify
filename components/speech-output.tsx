"use client"

import { useState, useEffect } from "react"
import { useSpeech } from "@/hooks/use-speech"
import { Volume2, Trash2 } from "lucide-react"

interface Word {
  id: number
  text: string
  imageUrl: string
  categoryId: number
}

export default function SpeechOutput({
  words,
  onClear,
}: {
  words: Word[]
  onClear: () => void
}) {
  const [sentence, setSentence] = useState<string>("")
  const { speak } = useSpeech()

  useEffect(() => {
    // Update sentence when words change
    setSentence(words.map((word) => word.text).join(" "))
  }, [words])

  const handleSpeak = () => {
    if (sentence) {
      speak(sentence)
    }
  }

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Speech Output</h2>

      <div className="min-h-16 p-3 rounded-xl bg-gray-50 dark:bg-gray-800 mb-4 border border-gray-200 dark:border-gray-700">
        <div className="flex flex-wrap gap-2">
          {words.length > 0 ? (
            words.map((word, index) => (
              <div
                key={`${word.id}-${index}`}
                className="flex items-center rounded-lg p-2 bg-white dark:bg-gray-700 shadow-sm"
              >
                <img
                  src={word.imageUrl || "/placeholder.svg"}
                  alt={word.text}
                  className="w-8 h-8 object-contain mr-2"
                />
                <span className="font-medium">{word.text}</span>
              </div>
            ))
          ) : (
            <p className="text-gray-500 dark:text-gray-400 w-full text-center py-2">
              Select words from the Word Bank to build a sentence
            </p>
          )}
        </div>
      </div>

      <div className="flex gap-2">
        <button
          onClick={handleSpeak}
          disabled={!sentence}
          className="app-button-primary flex-1 flex items-center justify-center"
        >
          <Volume2 className="h-4 w-4 mr-2" />
          Speak
        </button>

        <button
          onClick={onClear}
          disabled={!words.length}
          className="app-button-secondary flex items-center justify-center"
          aria-label="Clear"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>
    </div>
  )
}
