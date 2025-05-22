"use client"

import { useState, useEffect, useCallback } from "react"

export function useSpeech() {
  const [speaking, setSpeaking] = useState(false)
  const [supported, setSupported] = useState(true)
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([])

  useEffect(() => {
    // Check if speech synthesis is supported
    if (typeof window !== "undefined") {
      setSupported("speechSynthesis" in window)

      // Get available voices
      const loadVoices = () => {
        const availableVoices = window.speechSynthesis.getVoices()
        if (availableVoices.length > 0) {
          setVoices(availableVoices)
        }
      }

      loadVoices()

      // Chrome loads voices asynchronously
      if (window.speechSynthesis.onvoiceschanged !== undefined) {
        window.speechSynthesis.onvoiceschanged = loadVoices
      }
    }
  }, [])

  const speak = useCallback(
    (text: string, options?: { rate?: number; pitch?: number; voice?: string }) => {
      if (!supported || !text) return

      // Cancel any ongoing speech
      window.speechSynthesis.cancel()

      // Create a new utterance
      const utterance = new SpeechSynthesisUtterance(text)

      // Get voice settings from localStorage if not provided in options
      const savedVoice = localStorage.getItem("app-voice")
      const savedSpeechRate = localStorage.getItem("app-speech-rate")
      const savedPitch = localStorage.getItem("app-pitch")

      // Apply settings
      if (options?.rate) {
        utterance.rate = options.rate
      } else if (savedSpeechRate) {
        utterance.rate = Number(savedSpeechRate)
      }

      if (options?.pitch) {
        utterance.pitch = options.pitch
      } else if (savedPitch) {
        utterance.pitch = Number(savedPitch)
      }

      // Try to find the requested voice
      if (options?.voice && voices.length > 0) {
        const selectedVoice = voices.find((v) => v.name === options.voice)
        if (selectedVoice) {
          utterance.voice = selectedVoice
        }
      } else if (savedVoice && voices.length > 0) {
        const selectedVoice = voices.find((v) => v.name === savedVoice)
        if (selectedVoice) {
          utterance.voice = selectedVoice
        }
      }

      // Set speaking state
      setSpeaking(true)

      // Handle speech end
      utterance.onend = () => {
        setSpeaking(false)
      }

      // Speak the text
      window.speechSynthesis.speak(utterance)
    },
    [supported, voices],
  )

  const stop = useCallback(() => {
    if (!supported) return

    window.speechSynthesis.cancel()
    setSpeaking(false)
  }, [supported])

  return {
    speak,
    stop,
    speaking,
    supported,
    voices,
  }
}
