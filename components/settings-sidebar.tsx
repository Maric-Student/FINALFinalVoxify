"use client"

import { useState, useEffect } from "react"
import { X, Check, ChevronRight } from "lucide-react"
import { useAuth } from "./auth/auth-context"

interface SettingsSidebarProps {
  isOpen: boolean
  onClose: () => void
  language: "english" | "tagalog"
  onLanguageChange: (language: "english" | "tagalog") => void
  colorblindMode: string
  onColorblindModeChange: (mode: string) => void
}

/**
 * SettingsSidebar component
 *
 * A sidebar that contains all application settings including:
 * - Language settings
 * - Theme settings
 * - Colorblind mode settings
 * - Font size settings
 * - Speech settings
 *
 * Settings are saved to localStorage and/or user account if logged in.
 */
export default function SettingsSidebar({
  isOpen,
  onClose,
  language,
  onLanguageChange,
  colorblindMode,
  onColorblindModeChange,
}: SettingsSidebarProps) {
  // State for settings
  const [theme, setTheme] = useState<string>("light")
  const [fontSize, setFontSize] = useState<number>(100)
  const [voice, setVoice] = useState<string>("")
  const [speechRate, setSpeechRate] = useState<number>(1)
  const [pitch, setPitch] = useState<number>(1)
  const [availableVoices, setAvailableVoices] = useState<SpeechSynthesisVoice[]>([])

  // Get auth context
  const { user, isAuthenticated } = useAuth()

  // Load available voices
  useEffect(() => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      const loadVoices = () => {
        const voices = window.speechSynthesis.getVoices()
        setAvailableVoices(voices)

        // Set default voice if not already set
        if (!voice && voices.length > 0) {
          setVoice(voices[0].name)
        }
      }

      loadVoices()

      // Chrome loads voices asynchronously
      if (window.speechSynthesis.onvoiceschanged !== undefined) {
        window.speechSynthesis.onvoiceschanged = loadVoices
      }
    }
  }, [voice])

  // Apply font size to the document
  useEffect(() => {
    // Set the CSS variable for font scaling
    document.documentElement.style.setProperty("--app-font-scale", `${fontSize / 100}`)

    // Store the font size in localStorage for persistence
    localStorage.setItem("app-font-size", fontSize.toString())

    // If user is authenticated, save to user settings
    if (isAuthenticated && user) {
      saveUserSettings({ fontSize })
    }
  }, [fontSize, isAuthenticated, user])

  // Load saved font size on mount
  useEffect(() => {
    const savedFontSize = localStorage.getItem("app-font-size")
    if (savedFontSize) {
      setFontSize(Number(savedFontSize))
    }
  }, [])

  // Apply theme to the document
  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark")
    } else if (theme === "light") {
      document.documentElement.classList.remove("dark")
    } else if (theme === "system") {
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches
      if (prefersDark) {
        document.documentElement.classList.add("dark")
      } else {
        document.documentElement.classList.remove("dark")
      }
    }

    // Store the theme in localStorage for persistence
    localStorage.setItem("app-theme", theme)

    // If user is authenticated, save to user settings
    if (isAuthenticated && user) {
      saveUserSettings({ theme })
    }
  }, [theme, isAuthenticated, user])

  // Load saved theme on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem("app-theme")
    if (savedTheme) {
      setTheme(savedTheme)
    }
  }, [])

  // Store voice settings in localStorage
  useEffect(() => {
    if (voice) {
      localStorage.setItem("app-voice", voice)
    }
    localStorage.setItem("app-speech-rate", speechRate.toString())
    localStorage.setItem("app-pitch", pitch.toString())

    // If user is authenticated, save to user settings
    if (isAuthenticated && user) {
      saveUserSettings({
        voice,
        speechRate,
        pitch,
      })
    }
  }, [voice, speechRate, pitch, isAuthenticated, user])

  // Load saved voice settings on mount
  useEffect(() => {
    const savedVoice = localStorage.getItem("app-voice")
    const savedSpeechRate = localStorage.getItem("app-speech-rate")
    const savedPitch = localStorage.getItem("app-pitch")

    if (savedVoice) {
      setVoice(savedVoice)
    }
    if (savedSpeechRate) {
      setSpeechRate(Number(savedSpeechRate))
    }
    if (savedPitch) {
      setPitch(Number(savedPitch))
    }
  }, [])

  /**
   * Save user settings to localStorage
   * This function merges the new settings with existing settings
   */
  const saveUserSettings = (newSettings: any) => {
    if (!user) return

    const userDataKey = `voxify-user-data-${user.id}`
    const userDataJson = localStorage.getItem(userDataKey)
    const userData = userDataJson ? JSON.parse(userDataJson) : { settings: {} }

    // Update settings
    userData.settings = {
      ...userData.settings,
      ...newSettings,
    }

    // Save back to localStorage
    localStorage.setItem(userDataKey, JSON.stringify(userData))
  }

  /**
   * Test the current voice settings
   */
  const testVoice = () => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      // Cancel any ongoing speech
      window.speechSynthesis.cancel()

      const utterance = new SpeechSynthesisUtterance("This is a test of the speech settings")

      // Set the selected voice
      if (voice) {
        const selectedVoice = availableVoices.find((v) => v.name === voice)
        if (selectedVoice) {
          utterance.voice = selectedVoice
        }
      }

      utterance.rate = speechRate
      utterance.pitch = pitch
      window.speechSynthesis.speak(utterance)
    }
  }

  /**
   * Handle font size change
   * Ensures the font size stays within reasonable limits
   */
  const handleFontSizeChange = (newSize: number) => {
    const clampedSize = Math.max(50, Math.min(200, newSize))
    setFontSize(clampedSize)
  }

  /**
   * Handle colorblind mode change
   * Updates the colorblind mode and applies it to the document
   */
  const handleColorblindModeChange = (mode: string) => {
    // Remove existing colorblind classes
    document.documentElement.classList.remove("protanopia", "deuteranopia", "tritanopia")

    // Add new class if not "none"
    if (mode !== "none") {
      document.documentElement.classList.add(mode)
    }

    // Update state via callback
    onColorblindModeChange(mode)

    // Save to localStorage
    localStorage.setItem("app-colorblind-mode", mode)

    // If user is authenticated, save to user settings
    if (isAuthenticated && user) {
      saveUserSettings({ colorblindMode: mode })
    }
  }

  // If sidebar is not open, don't render anything
  if (!isOpen) return null

  // Get translations based on language
  const translations = {
    english: {
      settings: "Settings",
      language: "Language",
      displayLanguage: "Display Language",
      appearance: "Appearance",
      theme: "Theme",
      light: "Light",
      dark: "Dark",
      system: "System",
      colorblindMode: "Colorblind Mode",
      none: "None",
      protanopia: "Protanopia",
      deuteranopia: "Deuteranopia",
      tritanopia: "Tritanopia",
      size: "Size",
      reset: "Reset",
      speech: "Speech",
      voice: "Voice",
      speechRate: "Speech Rate",
      pitch: "Pitch",
      testVoice: "Test Voice",
    },
    tagalog: {
      settings: "Mga Setting",
      language: "Wika",
      displayLanguage: "Wika ng Display",
      appearance: "Hitsura",
      theme: "Tema",
      light: "Maliwanag",
      dark: "Madilim",
      system: "System",
      colorblindMode: "Mode para sa Colorblind",
      none: "Wala",
      protanopia: "Protanopia",
      deuteranopia: "Deuteranopia",
      tritanopia: "Tritanopia",
      size: "Laki",
      reset: "I-reset",
      speech: "Pagsasalita",
      voice: "Boses",
      speechRate: "Bilis ng Pagsasalita",
      pitch: "Tono",
      testVoice: "Subukan ang Boses",
    },
    bilingual: {
      settings: "Settings / Mga Setting",
      language: "Language / Wika",
      displayLanguage: "Display Language / Wika ng Display",
      appearance: "Appearance / Hitsura",
      theme: "Theme / Tema",
      light: "Light / Maliwanag",
      dark: "Dark / Madilim",
      system: "System / System",
      colorblindMode: "Colorblind Mode / Mode para sa Colorblind",
      none: "None / Wala",
      protanopia: "Protanopia",
      deuteranopia: "Deuteranopia",
      tritanopia: "Tritanopia",
      size: "Size / Laki",
      reset: "Reset / I-reset",
      speech: "Speech / Pagsasalita",
      voice: "Voice / Boses",
      speechRate: "Speech Rate / Bilis ng Pagsasalita",
      pitch: "Pitch / Tono",
      testVoice: "Test Voice / Subukan ang Boses",
    },
  }

  // Get current translations
  const t = translations[language]

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex justify-end" onClick={onClose}>
      <div
        className="w-full max-w-md h-full bg-white dark:bg-gray-900 shadow-lg overflow-y-auto animate-slide-in"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 z-10 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
          <div className="flex justify-between items-center p-4">
            <h2 className="text-2xl font-bold">{t.settings}</h2>
            <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800">
              <X className="h-6 w-6" />
            </button>
          </div>
        </div>

        <div className="p-4 space-y-6">
          {/* Language Section */}
          <section>
            <h3 className="text-lg font-bold mb-4 text-gray-900 dark:text-gray-100">{t.language}</h3>

            <div className="mb-4">
              <p className="mb-2 text-gray-700 dark:text-gray-300">{t.displayLanguage}</p>
              <div className="space-y-2">
                {[
                  { value: "english", label: "English" },
                  { value: "tagalog", label: "Tagalog" },
                ].map((option) => (
                  <label
                    key={option.value}
                    className="flex items-center justify-between p-3 rounded-xl border border-gray-200 dark:border-gray-700"
                  >
                    <span>{option.label}</span>
                    <div
                      className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                        language === option.value
                          ? "border-blue-500 bg-blue-500"
                          : "border-gray-300 dark:border-gray-600"
                      }`}
                    >
                      {language === option.value && <Check className="h-3 w-3 text-white" />}
                    </div>
                    <input
                      type="radio"
                      name="displayLanguage"
                      value={option.value}
                      checked={language === option.value}
                      onChange={() => onLanguageChange(option.value as "english" | "tagalog")}
                      className="sr-only"
                    />
                  </label>
                ))}
              </div>
            </div>
          </section>

          {/* Appearance Section */}
          <section>
            <h3 className="text-lg font-bold mb-4 text-gray-900 dark:text-gray-100">{t.appearance}</h3>

            <div className="mb-4">
              <p className="mb-2 text-gray-700 dark:text-gray-300">{t.theme}</p>
              <div className="space-y-2">
                {[
                  { value: "light", label: t.light },
                  { value: "dark", label: t.dark },
                  { value: "system", label: t.system },
                ].map((option) => (
                  <label
                    key={option.value}
                    className="flex items-center justify-between p-3 rounded-xl border border-gray-200 dark:border-gray-700"
                  >
                    <span>{option.label}</span>
                    <div
                      className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                        theme === option.value ? "border-blue-500 bg-blue-500" : "border-gray-300 dark:border-gray-600"
                      }`}
                    >
                      {theme === option.value && <Check className="h-3 w-3 text-white" />}
                    </div>
                    <input
                      type="radio"
                      name="theme"
                      value={option.value}
                      checked={theme === option.value}
                      onChange={() => setTheme(option.value)}
                      className="sr-only"
                    />
                  </label>
                ))}
              </div>
            </div>

            <div className="mb-4">
              <p className="mb-2 text-gray-700 dark:text-gray-300">{t.colorblindMode}</p>
              <div className="space-y-2">
                {[
                  { value: "none", label: t.none },
                  { value: "protanopia", label: t.protanopia },
                  { value: "deuteranopia", label: t.deuteranopia },
                  { value: "tritanopia", label: t.tritanopia },
                ].map((option) => (
                  <label
                    key={option.value}
                    className="flex items-center justify-between p-3 rounded-xl border border-gray-200 dark:border-gray-700"
                  >
                    <span>{option.label}</span>
                    <div
                      className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                        colorblindMode === option.value
                          ? "border-blue-500 bg-blue-500"
                          : "border-gray-300 dark:border-gray-600"
                      }`}
                    >
                      {colorblindMode === option.value && <Check className="h-3 w-3 text-white" />}
                    </div>
                    <input
                      type="radio"
                      name="colorblindMode"
                      value={option.value}
                      checked={colorblindMode === option.value}
                      onChange={() => handleColorblindModeChange(option.value)}
                      className="sr-only"
                    />
                  </label>
                ))}
              </div>
            </div>

            <div className="mb-4">
              <div className="flex justify-between mb-2">
                <p className="text-gray-700 dark:text-gray-300">{t.size}</p>
                <p className="font-medium">{fontSize}%</p>
              </div>
              <input
                type="range"
                min="50"
                max="200"
                step="10"
                value={fontSize}
                onChange={(e) => handleFontSizeChange(Number(e.target.value))}
                className="app-slider"
              />
              <div className="flex justify-between mt-2">
                <button
                  onClick={() => handleFontSizeChange(fontSize - 10)}
                  className="px-3 py-1 bg-gray-200 dark:bg-gray-700 rounded-md"
                >
                  A-
                </button>
                <button
                  onClick={() => handleFontSizeChange(100)}
                  className="px-3 py-1 bg-gray-200 dark:bg-gray-700 rounded-md"
                >
                  {t.reset}
                </button>
                <button
                  onClick={() => handleFontSizeChange(fontSize + 10)}
                  className="px-3 py-1 bg-gray-200 dark:bg-gray-700 rounded-md"
                >
                  A+
                </button>
              </div>
            </div>
          </section>

          {/* Speech Section */}
          <section>
            <h3 className="text-lg font-bold mb-4 text-gray-900 dark:text-gray-100">{t.speech}</h3>

            <div className="mb-4">
              <p className="mb-2 text-gray-700 dark:text-gray-300">{t.voice}</p>
              <div className="relative">
                <select value={voice} onChange={(e) => setVoice(e.target.value)} className="app-select">
                  {availableVoices.length === 0 ? (
                    <option value="">Loading voices...</option>
                  ) : (
                    availableVoices.map((v) => (
                      <option key={v.name} value={v.name}>
                        {v.name} ({v.lang})
                      </option>
                    ))
                  )}
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <ChevronRight className="h-4 w-4 transform rotate-90 text-gray-500" />
                </div>
              </div>
            </div>

            <div className="mb-4">
              <div className="flex justify-between mb-2">
                <p className="text-gray-700 dark:text-gray-300">{t.speechRate}</p>
                <p className="font-medium">{speechRate.toFixed(1)}</p>
              </div>
              <input
                type="range"
                min="0.1"
                max="2"
                step="0.1"
                value={speechRate}
                onChange={(e) => setSpeechRate(Number(e.target.value))}
                className="app-slider"
              />
            </div>

            <div className="mb-4">
              <div className="flex justify-between mb-2">
                <p className="text-gray-700 dark:text-gray-300">{t.pitch}</p>
                <p className="font-medium">{pitch.toFixed(1)}</p>
              </div>
              <input
                type="range"
                min="0.1"
                max="2"
                step="0.1"
                value={pitch}
                onChange={(e) => setPitch(Number(e.target.value))}
                className="app-slider"
              />
            </div>

            <button
              onClick={testVoice}
              className="w-full flex items-center justify-center p-3 rounded-xl bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 font-medium"
            >
              <span className="mr-2">🔊</span> {t.testVoice}
            </button>
          </section>
        </div>
      </div>
    </div>
  )
}
