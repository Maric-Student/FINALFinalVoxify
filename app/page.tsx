"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Settings, Home, Trash2, Volume2, X, Plus, MinusCircle, LogIn, LogOut, AlertCircle } from "lucide-react"
import SettingsSidebar from "@/components/settings-sidebar"
import AddWordForm from "@/components/add-word-form"
import { AuthProvider, useAuth } from "@/components/auth/auth-context"
import AuthModal from "@/components/auth/auth-modal"
import EditWordForm from "@/components/edit-word-form"

/**
 * AppContent component
 *
 * This is the main application content, wrapped with AuthProvider.
 * It contains all the app functionality and UI.
 */
function AppContent() {
  // State for UI components
  const [selectedWords, setSelectedWords] = useState<any[]>([])
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)
  const [isAddWordOpen, setIsAddWordOpen] = useState(false)
  const [isAuthOpen, setIsAuthOpen] = useState(false)
  const [authView, setAuthView] = useState<"login" | "signup">("login")
  const [selectedCategory, setSelectedCategory] = useState<number>(1)
  const [words, setWords] = useState<any[]>([])
  const [sentence, setSentence] = useState<string>("")
  const [availableVoices, setAvailableVoices] = useState<SpeechSynthesisVoice[]>([])
  const [customWords, setCustomWords] = useState<any[]>([])
  const [showLoginPrompt, setShowLoginPrompt] = useState(false)

  // After other state declarations
  const [directInput, setDirectInput] = useState<string>("")
  const [isEditWordOpen, setIsEditWordOpen] = useState(false)
  const [wordToEdit, setWordToEdit] = useState<any>(null)

  // State for settings
  const [language, setLanguage] = useState<"english" | "tagalog">("english")
  const [colorblindMode, setColorblindMode] = useState<string>("none")

  // Get auth context
  const { user, isAuthenticated, logout } = useAuth()

  // Word data with actual words
  const wordData = {
    english: {
      categories: [
        { id: 1, name: "Common" },
        { id: 2, name: "Actions" },
        { id: 3, name: "Feelings" },
        { id: 4, name: "Food" },
        { id: 5, name: "Places" },
        { id: 6, name: "People" },
        { id: 7, name: "Time" },
        { id: 8, name: "Colors" },
      ],
      words: {
        1: [
          { id: 1, text: "I, me, my", imageUrl: "/placeholder.svg?height=100&width=100", categoryId: 1 },
          { id: 2, text: "you", imageUrl: "/placeholder.svg?height=100&width=100", categoryId: 1 },
          { id: 3, text: "yes", imageUrl: "/placeholder.svg?height=100&width=100", categoryId: 1 },
          { id: 4, text: "no", imageUrl: "/placeholder.svg?height=100&width=100", categoryId: 1 },
          { id: 5, text: "please", imageUrl: "/placeholder.svg?height=100&width=100", categoryId: 1 },
          { id: 6, text: "thank you", imageUrl: "/placeholder.svg?height=100&width=100", categoryId: 1 },
          { id: 7, text: "hello", imageUrl: "/placeholder.svg?height=100&width=100", categoryId: 1 },
          { id: 8, text: "goodbye", imageUrl: "/placeholder.svg?height=100&width=100", categoryId: 1 },
          { id: 9, text: "help", imageUrl: "/placeholder.svg?height=100&width=100", categoryId: 1 },
          { id: 10, text: "more", imageUrl: "/placeholder.svg?height=100&width=100", categoryId: 1 },
        ],
        2: [
          { id: 11, text: "go", imageUrl: "/placeholder.svg?height=100&width=100", categoryId: 2 },
          { id: 12, text: "stop", imageUrl: "/placeholder.svg?height=100&width=100", categoryId: 2 },
          { id: 13, text: "eat", imageUrl: "/placeholder.svg?height=100&width=100", categoryId: 2 },
          { id: 14, text: "drink", imageUrl: "/placeholder.svg?height=100&width=100", categoryId: 2 },
          { id: 15, text: "play", imageUrl: "/placeholder.svg?height=100&width=100", categoryId: 2 },
          { id: 16, text: "sleep", imageUrl: "/placeholder.svg?height=100&width=100", categoryId: 2 },
          { id: 17, text: "want", imageUrl: "/placeholder.svg?height=100&width=100", categoryId: 2 },
          { id: 18, text: "give", imageUrl: "/placeholder.svg?height=100&width=100", categoryId: 2 },
          { id: 19, text: "get", imageUrl: "/placeholder.svg?height=100&width=100", categoryId: 2 },
          { id: 20, text: "make", imageUrl: "/placeholder.svg?height=100&width=100", categoryId: 2 },
        ],
        3: [
          { id: 21, text: "happy", imageUrl: "/placeholder.svg?height=100&width=100", categoryId: 3 },
          { id: 22, text: "sad", imageUrl: "/placeholder.svg?height=100&width=100", categoryId: 3 },
          { id: 23, text: "angry", imageUrl: "/placeholder.svg?height=100&width=100", categoryId: 3 },
          { id: 24, text: "scared", imageUrl: "/placeholder.svg?height=100&width=100", categoryId: 3 },
          { id: 25, text: "tired", imageUrl: "/placeholder.svg?height=100&width=100", categoryId: 3 },
          { id: 26, text: "sick", imageUrl: "/placeholder.svg?height=100&width=100", categoryId: 3 },
          { id: 27, text: "hurt", imageUrl: "/placeholder.svg?height=100&width=100", categoryId: 3 },
          { id: 28, text: "love", imageUrl: "/placeholder.svg?height=100&width=100", categoryId: 3 },
          { id: 29, text: "like", imageUrl: "/placeholder.svg?height=100&width=100", categoryId: 3 },
          { id: 30, text: "don't like", imageUrl: "/placeholder.svg?height=100&width=100", categoryId: 3 },
        ],
        4: [
          { id: 31, text: "water", imageUrl: "/placeholder.svg?height=100&width=100", categoryId: 4 },
          { id: 32, text: "milk", imageUrl: "/placeholder.svg?height=100&width=100", categoryId: 4 },
          { id: 33, text: "juice", imageUrl: "/placeholder.svg?height=100&width=100", categoryId: 4 },
          { id: 34, text: "apple", imageUrl: "/placeholder.svg?height=100&width=100", categoryId: 4 },
          { id: 35, text: "banana", imageUrl: "/placeholder.svg?height=100&width=100", categoryId: 4 },
          { id: 36, text: "bread", imageUrl: "/placeholder.svg?height=100&width=100", categoryId: 4 },
          { id: 37, text: "cookie", imageUrl: "/placeholder.svg?height=100&width=100", categoryId: 4 },
          { id: 38, text: "pizza", imageUrl: "/placeholder.svg?height=100&width=100", categoryId: 4 },
          { id: 39, text: "chicken", imageUrl: "/placeholder.svg?height=100&width=100", categoryId: 4 },
          { id: 40, text: "ice cream", imageUrl: "/placeholder.svg?height=100&width=100", categoryId: 4 },
        ],
        5: [
          { id: 41, text: "home", imageUrl: "/placeholder.svg?height=100&width=100", categoryId: 5 },
          { id: 42, text: "school", imageUrl: "/placeholder.svg?height=100&width=100", categoryId: 5 },
          { id: 43, text: "park", imageUrl: "/placeholder.svg?height=100&width=100", categoryId: 5 },
          { id: 44, text: "store", imageUrl: "/placeholder.svg?height=100&width=100", categoryId: 5 },
          { id: 45, text: "bathroom", imageUrl: "/placeholder.svg?height=100&width=100", categoryId: 5 },
          { id: 46, text: "bedroom", imageUrl: "/placeholder.svg?height=100&width=100", categoryId: 5 },
          { id: 47, text: "kitchen", imageUrl: "/placeholder.svg?height=100&width=100", categoryId: 5 },
          { id: 48, text: "outside", imageUrl: "/placeholder.svg?height=100&width=100", categoryId: 5 },
          { id: 49, text: "inside", imageUrl: "/placeholder.svg?height=100&width=100", categoryId: 5 },
          { id: 50, text: "car", imageUrl: "/placeholder.svg?height=100&width=100", categoryId: 5 },
        ],
        6: [
          { id: 601, text: "family", imageUrl: "/placeholder.svg?height=100&width=100", categoryId: 6 },
          { id: 602, text: "friend", imageUrl: "/placeholder.svg?height=100&width=100", categoryId: 6 },
          { id: 603, text: "teacher", imageUrl: "/placeholder.svg?height=100&width=100", categoryId: 6 },
          { id: 604, text: "doctor", imageUrl: "/placeholder.svg?height=100&width=100", categoryId: 6 },
          { id: 605, text: "mom", imageUrl: "/placeholder.svg?height=100&width=100", categoryId: 6 },
          { id: 606, text: "dad", imageUrl: "/placeholder.svg?height=100&width=100", categoryId: 6 },
          { id: 607, text: "sister", imageUrl: "/placeholder.svg?height=100&width=100", categoryId: 6 },
          { id: 608, text: "brother", imageUrl: "/placeholder.svg?height=100&width=100", categoryId: 6 },
          { id: 609, text: "grandma", imageUrl: "/placeholder.svg?height=100&width=100", categoryId: 6 },
          { id: 610, text: "grandpa", imageUrl: "/placeholder.svg?height=100&width=100", categoryId: 6 },
        ],
        7: [
          { id: 701, text: "now", imageUrl: "/placeholder.svg?height=100&width=100", categoryId: 7 },
          { id: 702, text: "later", imageUrl: "/placeholder.svg?height=100&width=100", categoryId: 7 },
          { id: 703, text: "today", imageUrl: "/placeholder.svg?height=100&width=100", categoryId: 7 },
          { id: 704, text: "tomorrow", imageUrl: "/placeholder.svg?height=100&width=100", categoryId: 7 },
          { id: 705, text: "yesterday", imageUrl: "/placeholder.svg?height=100&width=100", categoryId: 7 },
          { id: 706, text: "morning", imageUrl: "/placeholder.svg?height=100&width=100", categoryId: 7 },
          { id: 707, text: "afternoon", imageUrl: "/placeholder.svg?height=100&width=100", categoryId: 7 },
          { id: 708, text: "night", imageUrl: "/placeholder.svg?height=100&width=100", categoryId: 7 },
          { id: 709, text: "soon", imageUrl: "/placeholder.svg?height=100&width=100", categoryId: 7 },
          { id: 710, text: "wait", imageUrl: "/placeholder.svg?height=100&width=100", categoryId: 7 },
        ],
        8: [
          { id: 801, text: "red", imageUrl: "/placeholder.svg?height=100&width=100", categoryId: 8 },
          { id: 802, text: "blue", imageUrl: "/placeholder.svg?height=100&width=100", categoryId: 8 },
          { id: 803, text: "green", imageUrl: "/placeholder.svg?height=100&width=100", categoryId: 8 },
          { id: 804, text: "yellow", imageUrl: "/placeholder.svg?height=100&width=100", categoryId: 8 },
          { id: 805, text: "orange", imageUrl: "/placeholder.svg?height=100&width=100", categoryId: 8 },
          { id: 806, text: "purple", imageUrl: "/placeholder.svg?height=100&width=100", categoryId: 8 },
          { id: 807, text: "pink", imageUrl: "/placeholder.svg?height=100&width=100", categoryId: 8 },
          { id: 808, text: "brown", imageUrl: "/placeholder.svg?height=100&width=100", categoryId: 8 },
          { id: 809, text: "black", imageUrl: "/placeholder.svg?height=100&width=100", categoryId: 8 },
          { id: 810, text: "white", imageUrl: "/placeholder.svg?height=100&width=100", categoryId: 8 },
        ],
      },
    },
    tagalog: {
      categories: [
        { id: 1, name: "Karaniwan" },
        { id: 2, name: "Mga Aksyon" },
        { id: 3, name: "Mga Damdamin" },
        { id: 4, name: "Pagkain" },
        { id: 5, name: "Mga Lugar" },
        { id: 6, name: "Mga Tao" },
        { id: 7, name: "Oras" },
        { id: 8, name: "Mga Kulay" },
      ],
      words: {
        1: [
          { id: 1, text: "Ako, akin", imageUrl: "/placeholder.svg?height=100&width=100", categoryId: 1 },
          { id: 2, text: "ikaw", imageUrl: "/placeholder.svg?height=100&width=100", categoryId: 1 },
          { id: 3, text: "oo", imageUrl: "/placeholder.svg?height=100&width=100", categoryId: 1 },
          { id: 4, text: "hindi", imageUrl: "/placeholder.svg?height=100&width=100", categoryId: 1 },
          { id: 5, text: "pakiusap", imageUrl: "/placeholder.svg?height=100&width=100", categoryId: 1 },
          { id: 6, text: "salamat", imageUrl: "/placeholder.svg?height=100&width=100", categoryId: 1 },
          { id: 7, text: "kumusta", imageUrl: "/placeholder.svg?height=100&width=100", categoryId: 1 },
          { id: 8, text: "paalam", imageUrl: "/placeholder.svg?height=100&width=100", categoryId: 1 },
          { id: 9, text: "tulong", imageUrl: "/placeholder.svg?height=100&width=100", categoryId: 1 },
          { id: 10, text: "pa", imageUrl: "/placeholder.svg?height=100&width=100", categoryId: 1 },
        ],
        2: [
          { id: 11, text: "punta", imageUrl: "/placeholder.svg?height=100&width=100", categoryId: 2 },
          { id: 12, text: "hinto", imageUrl: "/placeholder.svg?height=100&width=100", categoryId: 2 },
          { id: 13, text: "kain", imageUrl: "/placeholder.svg?height=100&width=100", categoryId: 2 },
          { id: 14, text: "inom", imageUrl: "/placeholder.svg?height=100&width=100", categoryId: 2 },
          { id: 15, text: "laro", imageUrl: "/placeholder.svg?height=100&width=100", categoryId: 2 },
          { id: 16, text: "tulog", imageUrl: "/placeholder.svg?height=100&width=100", categoryId: 2 },
          { id: 17, text: "gusto", imageUrl: "/placeholder.svg?height=100&width=100", categoryId: 2 },
          { id: 18, text: "bigay", imageUrl: "/placeholder.svg?height=100&width=100", categoryId: 2 },
          { id: 19, text: "kuha", imageUrl: "/placeholder.svg?height=100&width=100", categoryId: 2 },
          { id: 20, text: "gawa", imageUrl: "/placeholder.svg?height=100&width=100", categoryId: 2 },
        ],
        3: [
          { id: 21, text: "masaya", imageUrl: "/placeholder.svg?height=100&width=100", categoryId: 3 },
          { id: 22, text: "malungkot", imageUrl: "/placeholder.svg?height=100&width=100", categoryId: 3 },
          { id: 23, text: "galit", imageUrl: "/placeholder.svg?height=100&width=100", categoryId: 3 },
          { id: 24, text: "takot", imageUrl: "/placeholder.svg?height=100&width=100", categoryId: 3 },
          { id: 25, text: "pagod", imageUrl: "/placeholder.svg?height=100&width=100", categoryId: 3 },
          { id: 26, text: "may sakit", imageUrl: "/placeholder.svg?height=100&width=100", categoryId: 3 },
          { id: 27, text: "masakit", imageUrl: "/placeholder.svg?height=100&width=100", categoryId: 3 },
          { id: 28, text: "mahal", imageUrl: "/placeholder.svg?height=100&width=100", categoryId: 3 },
          { id: 29, text: "gusto", imageUrl: "/placeholder.svg?height=100&width=100", categoryId: 3 },
          { id: 30, text: "ayaw", imageUrl: "/placeholder.svg?height=100&width=100", categoryId: 3 },
        ],
        4: [
          { id: 31, text: "tubig", imageUrl: "/placeholder.svg?height=100&width=100", categoryId: 4 },
          { id: 32, text: "gatas", imageUrl: "/placeholder.svg?height=100&width=100", categoryId: 4 },
          { id: 33, text: "juice", imageUrl: "/placeholder.svg?height=100&width=100", categoryId: 4 },
          { id: 34, text: "mansanas", imageUrl: "/placeholder.svg?height=100&width=100", categoryId: 4 },
          { id: 35, text: "saging", imageUrl: "/placeholder.svg?height=100&width=100", categoryId: 4 },
          { id: 36, text: "tinapay", imageUrl: "/placeholder.svg?height=100&width=100", categoryId: 4 },
          { id: 37, text: "biskwit", imageUrl: "/placeholder.svg?height=100&width=100", categoryId: 4 },
          { id: 38, text: "pizza", imageUrl: "/placeholder.svg?height=100&width=100", categoryId: 4 },
          { id: 39, text: "manok", imageUrl: "/placeholder.svg?height=100&width=100", categoryId: 4 },
          { id: 40, text: "ice cream", imageUrl: "/placeholder.svg?height=100&width=100", categoryId: 4 },
        ],
        5: [
          { id: 41, text: "bahay", imageUrl: "/placeholder.svg?height=100&width=100", categoryId: 5 },
          { id: 42, text: "paaralan", imageUrl: "/placeholder.svg?height=100&width=100", categoryId: 5 },
          { id: 43, text: "parke", imageUrl: "/placeholder.svg?height=100&width=100", categoryId: 5 },
          { id: 44, text: "tindahan", imageUrl: "/placeholder.svg?height=100&width=100", categoryId: 5 },
          { id: 45, text: "banyo", imageUrl: "/placeholder.svg?height=100&width=100", categoryId: 5 },
          { id: 46, text: "kwarto", imageUrl: "/placeholder.svg?height=100&width=100", categoryId: 5 },
          { id: 47, text: "kusina", imageUrl: "/placeholder.svg?height=100&width=100", categoryId: 5 },
          { id: 48, text: "labas", imageUrl: "/placeholder.svg?height=100&width=100", categoryId: 5 },
          { id: 49, text: "loob", imageUrl: "/placeholder.svg?height=100&width=100", categoryId: 5 },
          { id: 50, text: "kotse", imageUrl: "/placeholder.svg?height=100&width=100", categoryId: 5 },
        ],
        6: [
          { id: 601, text: "pamilya", imageUrl: "/placeholder.svg?height=100&width=100", categoryId: 6 },
          { id: 602, text: "kaibigan", imageUrl: "/placeholder.svg?height=100&width=100", categoryId: 6 },
          { id: 603, text: "guro", imageUrl: "/placeholder.svg?height=100&width=100", categoryId: 6 },
          { id: 604, text: "doktor", imageUrl: "/placeholder.svg?height=100&width=100", categoryId: 6 },
          { id: 605, text: "nanay", imageUrl: "/placeholder.svg?height=100&width=100", categoryId: 6 },
          { id: 606, text: "tatay", imageUrl: "/placeholder.svg?height=100&width=100", categoryId: 6 },
          { id: 607, text: "ate/kapatid na babae", imageUrl: "/placeholder.svg?height=100&width=100", categoryId: 6 },
          { id: 608, text: "kuya/kapatid na lalaki", imageUrl: "/placeholder.svg?height=100&width=100", categoryId: 6 },
          { id: 609, text: "lola", imageUrl: "/placeholder.svg?height=100&width=100", categoryId: 6 },
          { id: 610, text: "lolo", imageUrl: "/placeholder.svg?height=100&width=100", categoryId: 6 },
        ],
        7: [
          { id: 701, text: "ngayon", imageUrl: "/placeholder.svg?height=100&width=100", categoryId: 7 },
          { id: 702, text: "mamaya", imageUrl: "/placeholder.svg?height=100&width=100", categoryId: 7 },
          { id: 703, text: "ngayong araw", imageUrl: "/placeholder.svg?height=100&width=100", categoryId: 7 },
          { id: 704, text: "bukas", imageUrl: "/placeholder.svg?height=100&width=100", categoryId: 7 },
          { id: 705, text: "kahapon", imageUrl: "/placeholder.svg?height=100&width=100", categoryId: 7 },
          { id: 706, text: "umaga", imageUrl: "/placeholder.svg?height=100&width=100", categoryId: 7 },
          { id: 707, text: "hapon", imageUrl: "/placeholder.svg?height=100&width=100", categoryId: 7 },
          { id: 708, text: "gabi", imageUrl: "/placeholder.svg?height=100&width=100", categoryId: 7 },
          { id: 709, text: "malapit na", imageUrl: "/placeholder.svg?height=100&width=100", categoryId: 7 },
          { id: 710, text: "hintay", imageUrl: "/placeholder.svg?height=100&width=100", categoryId: 7 },
        ],
        8: [
          { id: 801, text: "pula", imageUrl: "/placeholder.svg?height=100&width=100", categoryId: 8 },
          { id: 802, text: "asul", imageUrl: "/placeholder.svg?height=100&width=100", categoryId: 8 },
          { id: 803, text: "berde", imageUrl: "/placeholder.svg?height=100&width=100", categoryId: 8 },
          { id: 804, text: "dilaw", imageUrl: "/placeholder.svg?height=100&width=100", categoryId: 8 },
          { id: 805, text: "kahel", imageUrl: "/placeholder.svg?height=100&width=100", categoryId: 8 },
          { id: 806, text: "lila", imageUrl: "/placeholder.svg?height=100&width=100", categoryId: 8 },
          { id: 807, text: "rosas", imageUrl: "/placeholder.svg?height=100&width=100", categoryId: 8 },
          { id: 808, text: "kayumanggi", imageUrl: "/placeholder.svg?height=100&width=100", categoryId: 8 },
          { id: 809, text: "itim", imageUrl: "/placeholder.svg?height=100&width=100", categoryId: 8 },
          { id: 810, text: "puti", imageUrl: "/placeholder.svg?height=100&width=100", categoryId: 8 },
        ],
      },
    },
  }

  // Translations for UI elements
  const translations = {
    english: {
      appTitle: "Voxify AAC",
      selectWords: "Select words to build a sentence",
      speak: "Speak",
      clear: "Clear",
      remove: "Remove last word",
      addWord: "Add Word",
      login: "Log In",
      signup: "Sign Up",
      logout: "Log Out",
      profile: "Profile",
      loginPrompt: "Create an account to save your words across devices",
      createAccount: "Create Account",
      notSaved: "Words added will be saved on this device only",
      typeHere: "Type here...",
      editWord: "Edit Word",
    },
    tagalog: {
      appTitle: "Voxify AAC",
      selectWords: "Pumili ng mga salita para bumuo ng pangungusap",
      speak: "Magsalita",
      clear: "Burahin",
      remove: "Alisin ang huling salita",
      addWord: "Magdagdag ng Salita",
      login: "Mag-login",
      signup: "Mag-sign up",
      logout: "Mag-logout",
      profile: "Profile",
      loginPrompt: "Gumawa ng account para i-save ang iyong mga salita sa lahat ng device",
      createAccount: "Gumawa ng Account",
      notSaved: "Ang mga salitang idinagdag ay mase-save lamang sa device na ito",
      typeHere: "Mag-type dito...",
      editWord: "I-edit ang Salita",
    },
  }

  // Load available voices
  useEffect(() => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      const loadVoices = () => {
        const voices = window.speechSynthesis.getVoices()
        setAvailableVoices(voices)
      }

      loadVoices()

      // Chrome loads voices asynchronously
      if (window.speechSynthesis.onvoiceschanged !== undefined) {
        window.speechSynthesis.onvoiceschanged = loadVoices
      }
    }
  }, [])

  // Load custom words from localStorage
  useEffect(() => {
    // If user is authenticated, load from user data
    if (isAuthenticated && user) {
      const userDataKey = `voxify-user-data-${user.id}`
      const userDataJson = localStorage.getItem(userDataKey)

      if (userDataJson) {
        try {
          const userData = JSON.parse(userDataJson)
          if (userData.words && Array.isArray(userData.words)) {
            setCustomWords(userData.words)
          }
        } catch (error) {
          console.error("Failed to parse user data:", error)
        }
      }
    } else {
      // If not authenticated, load from guest storage
      const guestWordsJson = localStorage.getItem("voxify-guest-words")
      if (guestWordsJson) {
        try {
          const guestWords = JSON.parse(guestWordsJson)
          setCustomWords(guestWords)
        } catch (error) {
          console.error("Failed to parse guest words:", error)
        }
      }
    }
  }, [isAuthenticated, user])

  /**
   * Handle editing a word
   * Opens the edit modal with the selected word data
   */
  const handleEditWord = (word: any) => {
    setWordToEdit(word)
    setIsEditWordOpen(true)
  }

  /**
   * Update an edited word
   * Updates the word in localStorage and state
   */
  const updateEditedWord = (updatedWord: any) => {
    // Update state
    setCustomWords((prev) => prev.map((word) => (word.id === updatedWord.id ? updatedWord : word)))

    // If user is authenticated, update in user data
    if (isAuthenticated && user) {
      const userDataKey = `voxify-user-data-${user.id}`
      const userDataJson = localStorage.getItem(userDataKey)
      const userData = userDataJson ? JSON.parse(userDataJson) : { settings: {}, words: [] }

      userData.words = userData.words.map((word: any) => (word.id === updatedWord.id ? updatedWord : word))

      localStorage.setItem(userDataKey, JSON.stringify(userData))
    } else {
      // If not authenticated, update in guest storage
      const guestWordsJson = localStorage.getItem("voxify-guest-words")
      let guestWords = guestWordsJson ? JSON.parse(guestWordsJson) : []

      guestWords = guestWords.map((word: any) => (word.id === updatedWord.id ? updatedWord : word))

      localStorage.setItem("voxify-guest-words", JSON.stringify(guestWords))
    }
  }

  /**
   * Handle direct text input
   * Adds the typed text to the selected words
   */
  const handleDirectInputSubmit = (e?: React.FormEvent) => {
    if (e) {
      e.preventDefault()
    }

    if (directInput.trim()) {
      // Create a temporary word from the direct input
      const tempWord = {
        id: `temp_${Date.now()}`,
        text: directInput.trim(),
        imageUrl: "/placeholder.svg?height=100&width=100",
        categoryId: 1, // Default to common category
        isTemporary: true, // Flag to identify direct input words
      }

      setSelectedWords((prev) => [...prev, tempWord])
      setDirectInput("")
    }
  }

  // Update words when category, language, or custom words change
  useEffect(() => {
    // Get base words for the selected category
    const baseWords = wordData[language].words[selectedCategory] || []

    // Filter custom words for the selected category
    const categoryCustomWords = customWords.filter((word) => word.categoryId === selectedCategory)

    // Combine base words with custom words
    setWords([...baseWords, ...categoryCustomWords])
  }, [selectedCategory, language, customWords])

  // Update sentence when selected words change
  useEffect(() => {
    setSentence(selectedWords.map((word) => word.text).join(" "))
  }, [selectedWords])

  // Load settings from localStorage on mount
  useEffect(() => {
    // Load font size
    const savedFontSize = localStorage.getItem("app-font-size")
    if (savedFontSize) {
      document.documentElement.style.setProperty("--app-font-scale", `${Number(savedFontSize) / 100}`)
    }

    // Load language
    const savedLanguage = localStorage.getItem("app-language")
    if (savedLanguage && (savedLanguage === "english" || savedLanguage === "tagalog")) {
      setLanguage(savedLanguage)
    }

    // Load colorblind mode
    const savedColorblindMode = localStorage.getItem("app-colorblind-mode")
    if (savedColorblindMode) {
      setColorblindMode(savedColorblindMode)

      // Apply colorblind mode
      document.documentElement.classList.remove("protanopia", "deuteranopia", "tritanopia")
      if (savedColorblindMode !== "none") {
        document.documentElement.classList.add(savedColorblindMode)
      }
    }

    // If user is authenticated, load user settings
    if (isAuthenticated && user) {
      loadUserSettings()
    }
  }, [isAuthenticated, user])

  /**
   * Load user settings from localStorage
   * This is called when a user logs in
   */
  const loadUserSettings = () => {
    if (!user) return

    const userDataKey = `voxify-user-data-${user.id}`
    const userDataJson = localStorage.getItem(userDataKey)

    if (userDataJson) {
      try {
        const userData = JSON.parse(userDataJson)

        if (userData.settings) {
          // Apply settings
          if (userData.settings.language) {
            setLanguage(userData.settings.language)
          }

          if (userData.settings.colorblindMode) {
            setColorblindMode(userData.settings.colorblindMode)

            // Apply colorblind mode
            document.documentElement.classList.remove("protanopia", "deuteranopia", "tritanopia")
            if (userData.settings.colorblindMode !== "none") {
              document.documentElement.classList.add(userData.settings.colorblindMode)
            }
          }

          if (userData.settings.fontSize) {
            document.documentElement.style.setProperty("--app-font-scale", `${userData.settings.fontSize / 100}`)
          }
        }
      } catch (error) {
        console.error("Failed to parse user data:", error)
      }
    }
  }

  /**
   * Handle adding a word to the message
   */
  const handleAddWord = (word: any) => {
    setSelectedWords((prev) => [...prev, word])
  }

  /**
   * Handle removing a specific word from the message
   */
  const handleRemoveWord = (index: number) => {
    setSelectedWords((prev) => prev.filter((_, i) => i !== index))
  }

  /**
   * Handle removing the last word from the message
   * If no words are selected, remove the last word from direct input
   */
  const handleRemoveLastWord = () => {
    if (selectedWords.length > 0) {
      setSelectedWords((prev) => prev.slice(0, -1))
    } else if (directInput.trim()) {
      // If there are no selected words but there is text in the input,
      // remove the last word from the direct input
      const words = directInput.trim().split(/\s+/)
      if (words.length > 1) {
        // Remove the last word
        setDirectInput(words.slice(0, -1).join(" ") + " ")
      } else {
        // Clear the input if there's only one word
        setDirectInput("")
      }
    }
  }

  /**
   * Handle clearing all words from the message and direct input
   */
  const handleClearWords = () => {
    setSelectedWords([])
    setDirectInput("")
  }

  /**
   * Handle speaking the current sentence
   */
  const handleSpeak = () => {
    // Build the text to speak (include both selected words and direct input)
    const textToSpeak = [...selectedWords.map((word) => word.text), directInput.trim()].filter(Boolean).join(" ")

    if (textToSpeak && typeof window !== "undefined" && "speechSynthesis" in window) {
      // Cancel any ongoing speech
      window.speechSynthesis.cancel()

      const utterance = new SpeechSynthesisUtterance(textToSpeak)

      // Get voice settings from localStorage
      const savedVoice = localStorage.getItem("app-voice")
      const savedSpeechRate = localStorage.getItem("app-speech-rate")
      const savedPitch = localStorage.getItem("app-pitch")

      // Apply voice settings
      if (savedVoice && availableVoices.length > 0) {
        const selectedVoice = availableVoices.find((v) => v.name === savedVoice)
        if (selectedVoice) {
          utterance.voice = selectedVoice
        }
      }

      if (savedSpeechRate) {
        utterance.rate = Number(savedSpeechRate)
      }

      if (savedPitch) {
        utterance.pitch = Number(savedPitch)
      }

      window.speechSynthesis.speak(utterance)
    }
  }

  /**
   * Handle clicking on a word in the word grid
   * This speaks the word and adds it to the message
   */
  const handleWordClick = (word: any) => {
    // Speak the individual word
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      // Cancel any ongoing speech
      window.speechSynthesis.cancel()

      const utterance = new SpeechSynthesisUtterance(word.text)

      // Get voice settings from localStorage
      const savedVoice = localStorage.getItem("app-voice")
      const savedSpeechRate = localStorage.getItem("app-speech-rate")
      const savedPitch = localStorage.getItem("app-pitch")

      // Apply voice settings
      if (savedVoice && availableVoices.length > 0) {
        const selectedVoice = availableVoices.find((v) => v.name === savedVoice)
        if (selectedVoice) {
          utterance.voice = selectedVoice
        }
      }

      if (savedSpeechRate) {
        utterance.rate = Number(savedSpeechRate)
      }

      if (savedPitch) {
        utterance.pitch = Number(savedPitch)
      }

      window.speechSynthesis.speak(utterance)
    }

    // Add the word to the message
    handleAddWord(word)
  }

  /**
   * Handle language change
   * Updates the language and saves it to localStorage
   */
  const handleLanguageChange = (newLanguage: "english" | "tagalog") => {
    setLanguage(newLanguage)
    localStorage.setItem("app-language", newLanguage)

    // If user is authenticated, save to user settings
    if (isAuthenticated && user) {
      const userDataKey = `voxify-user-data-${user.id}`
      const userDataJson = localStorage.getItem(userDataKey)
      const userData = userDataJson ? JSON.parse(userDataJson) : { settings: {}, words: [] }

      userData.settings.language = newLanguage

      localStorage.setItem(userDataKey, JSON.stringify(userData))
    }
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

    // Update state
    setColorblindMode(mode)

    // Save to localStorage
    localStorage.setItem("app-colorblind-mode", mode)

    // If user is authenticated, save to user settings
    if (isAuthenticated && user) {
      const userDataKey = `voxify-user-data-${user.id}`
      const userDataJson = localStorage.getItem(userDataKey)
      const userData = userDataJson ? JSON.parse(userDataJson) : { settings: {}, words: [] }

      userData.settings.colorblindMode = mode

      localStorage.setItem(userDataKey, JSON.stringify(userData))
    }
  }

  /**
   * Save a custom word
   * Saves to user data if authenticated, or to guest storage if not
   */
  const saveCustomWord = (word: any) => {
    // Add a unique ID to the word
    const wordWithId = {
      ...word,
      id: Date.now(), // Use timestamp as a simple unique ID
    }

    // Update state
    setCustomWords((prev) => [...prev, wordWithId])

    // If user is authenticated, save to user data
    if (isAuthenticated && user) {
      const userDataKey = `voxify-user-data-${user.id}`
      const userDataJson = localStorage.getItem(userDataKey)
      const userData = userDataJson ? JSON.parse(userDataJson) : { settings: {}, words: [] }

      userData.words = [...(userData.words || []), wordWithId]

      localStorage.setItem(userDataKey, JSON.stringify(userData))
    } else {
      // If not authenticated, save to guest storage
      const guestWordsJson = localStorage.getItem("voxify-guest-words")
      const guestWords = guestWordsJson ? JSON.parse(guestWordsJson) : []

      guestWords.push(wordWithId)

      localStorage.setItem("voxify-guest-words", JSON.stringify(guestWords))

      // Show login prompt after adding a word as a guest
      setShowLoginPrompt(true)

      // Hide the prompt after 5 seconds
      setTimeout(() => {
        setShowLoginPrompt(false)
      }, 5000)
    }
  }

  // Get translations for the current language
  const t = translations[language]

  // Get categories for the current language
  const categories = wordData[language].categories

  return (
    <div className="app-container">
      <header className="app-header">
        <div className="flex items-center">
          <Home className="h-6 w-6 mr-2" />
          <h1 className="text-xl font-bold font-scalable-xl">{t.appTitle}</h1>
        </div>
        <div className="flex items-center space-x-2">
          {/* Add Word button is always visible */}
          <button
            onClick={() => setIsAddWordOpen(true)}
            className="p-2 rounded-full bg-green-500 text-white"
            aria-label={t.addWord}
            title={t.addWord}
          >
            <Plus className="h-5 w-5" />
          </button>

          {isAuthenticated ? (
            <button
              onClick={logout}
              className="p-2 rounded-full bg-red-500 text-white"
              aria-label={t.logout}
              title={t.logout}
            >
              <LogOut className="h-5 w-5" />
            </button>
          ) : (
            <button
              onClick={() => {
                setAuthView("login")
                setIsAuthOpen(true)
              }}
              className="p-2 rounded-full bg-blue-500 text-white"
              aria-label={t.login}
              title={t.login}
            >
              <LogIn className="h-5 w-5" />
            </button>
          )}
          <button
            onClick={() => setIsSettingsOpen(true)}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
            aria-label="Open Settings"
            title="Open Settings"
          >
            <Settings className="h-5 w-5" />
          </button>
        </div>
      </header>

      <main className="app-content">
        {/* Login Prompt for Guest Users */}
        {!isAuthenticated && showLoginPrompt && (
          <div className="bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-300 p-3 rounded-xl mb-4 flex items-center justify-between">
            <div className="flex items-center">
              <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0" />
              <p className="text-sm">{t.loginPrompt}</p>
            </div>
            <button
              onClick={() => {
                setAuthView("signup")
                setIsAuthOpen(true)
              }}
              className="bg-blue-500 text-white px-3 py-1 rounded-md text-sm whitespace-nowrap ml-2"
            >
              {t.createAccount}
            </button>
          </div>
        )}

        {/* Guest User Notice */}
        {!isAuthenticated && (
          <div className="text-xs text-gray-500 dark:text-gray-400 mb-2 flex items-center">
            <AlertCircle className="h-3 w-3 mr-1 flex-shrink-0" />
            {t.notSaved}
          </div>
        )}

        {/* Message Bar */}
        <div className="mb-4">
          <div className="message-bar mb-2">
            {selectedWords.length > 0 ? (
              <div className="flex-1 flex flex-wrap">
                {selectedWords.map((word, index) => (
                  <div
                    key={`${word.id}-${index}`}
                    className={`message-item ${word.isTemporary ? "temporary-word" : `category-${word.categoryId}`}`}
                  >
                    <div
                      className="message-item-remove"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleRemoveWord(index)
                      }}
                    >
                      <X className="h-3 w-3" />
                    </div>
                    <img src={word.imageUrl || "/placeholder.svg"} alt={word.text} className="message-image" />
                    <span className="message-text">{word.text}</span>
                  </div>
                ))}
                <form onSubmit={handleDirectInputSubmit} className="flex-grow min-w-[100px] flex items-center ml-2">
                  <input
                    type="text"
                    value={directInput}
                    onChange={(e) => setDirectInput(e.target.value)}
                    placeholder={t.typeHere}
                    className="direct-input"
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        handleDirectInputSubmit()
                        e.preventDefault()
                      }
                    }}
                  />
                </form>
              </div>
            ) : (
              <form onSubmit={handleDirectInputSubmit} className="flex-1 flex">
                <input
                  type="text"
                  value={directInput}
                  onChange={(e) => setDirectInput(e.target.value)}
                  placeholder={t.typeHere}
                  className="direct-input w-full"
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      handleDirectInputSubmit()
                      e.preventDefault()
                    }
                  }}
                />
              </form>
            )}
          </div>

          {/* Action Buttons - Now larger and below the text box */}
          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={handleSpeak}
              disabled={!selectedWords.length && !directInput.trim()}
              className="accessibility-button accessibility-button-speak"
              aria-label={t.speak}
            >
              <Volume2 className="h-6 w-6 mr-2" />
              <span>{t.speak}</span>
            </button>
            <button
              onClick={handleRemoveLastWord}
              disabled={!selectedWords.length && !directInput.trim()}
              className="accessibility-button accessibility-button-remove"
              aria-label={t.remove}
            >
              <MinusCircle className="h-6 w-6 mr-2" />
              <span>{t.remove}</span>
            </button>
            <button
              onClick={handleClearWords}
              disabled={!selectedWords.length && !directInput.trim()}
              className="accessibility-button accessibility-button-clear"
              aria-label={t.clear}
            >
              <Trash2 className="h-6 w-6 mr-2" />
              <span>{t.clear}</span>
            </button>
          </div>
        </div>

        {/* Categories */}
        <div className="category-grid">
          {categories.map((category) => (
            <div
              key={category.id}
              className={`category-button category-${category.id} ${selectedCategory === category.id ? "active" : ""}`}
              onClick={() => setSelectedCategory(category.id)}
            >
              {category.name}
            </div>
          ))}
        </div>

        {/* Word Grid */}
        <div className="word-grid">
          {words.map((word) => {
            // Check if this is a custom word (added by the user)
            const isCustomWord = customWords.some((customWord) => customWord.id === word.id)

            return (
              <div
                key={word.id}
                className={`word-tile category-${word.categoryId} ${isCustomWord ? "custom-word group" : ""}`}
              >
                <div className="word-tile-content" onClick={() => handleWordClick(word)}>
                  <img src={word.imageUrl || "/placeholder.svg"} alt={word.text} className="word-image" />
                  <span className="word-text">{word.text}</span>
                </div>
                {isCustomWord && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      handleEditWord(word)
                    }}
                    className="word-edit-button"
                    aria-label={`Edit ${word.text}`}
                  >
                    <span className="sr-only">Edit</span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="h-3 w-3"
                    >
                      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                    </svg>
                  </button>
                )}
              </div>
            )
          })}
        </div>
      </main>

      {/* Add Word Modal */}
      {isAddWordOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg w-full max-w-md overflow-y-auto max-h-[90vh] animate-slide-in">
            <div className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-bold">{t.addWord}</h2>
              <button
                onClick={() => setIsAddWordOpen(false)}
                className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="p-4">
              <AddWordForm
                onAddWord={(word) => {
                  // Add the word to the current message
                  handleAddWord(word)

                  // Save the custom word (either to user account or guest storage)
                  saveCustomWord(word)

                  // Close the modal
                  setIsAddWordOpen(false)
                }}
                categories={categories}
                language={language}
              />
            </div>
          </div>
        </div>
      )}

      {/* Authentication Modal */}
      <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} initialView={authView} />

      {/* Settings Sidebar */}
      <SettingsSidebar
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        language={language}
        onLanguageChange={handleLanguageChange}
        colorblindMode={colorblindMode}
        onColorblindModeChange={handleColorblindModeChange}
      />

      {/* Edit Word Modal */}
      {isEditWordOpen && wordToEdit && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg w-full max-w-md overflow-y-auto max-h-[90vh] animate-slide-in">
            <div className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-bold">{t.editWord}</h2>
              <button
                onClick={() => setIsEditWordOpen(false)}
                className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="p-4">
              <EditWordForm
                word={wordToEdit}
                onSaveWord={(updatedWord) => {
                  updateEditedWord(updatedWord)
                  setIsEditWordOpen(false)
                }}
                categories={categories}
                language={language}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

/**
 * HomePage component
 *
 * This is the main page component that wraps the app content with the AuthProvider.
 */
export default function HomePage() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  )
}
