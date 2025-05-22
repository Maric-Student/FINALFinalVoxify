import { NextResponse } from "next/server"

// Mock data for categories
const categories = [
  { id: 1, name: "Common" },
  { id: 2, name: "Actions" },
  { id: 3, name: "Feelings" },
  { id: 4, name: "Food" },
  { id: 5, name: "Places" },
]

// Mock data for words
const words = [
  { id: 1, text: "Hello", imageUrl: "/placeholder.svg?height=100&width=100", categoryId: 1 },
  { id: 2, text: "Yes", imageUrl: "/placeholder.svg?height=100&width=100", categoryId: 1 },
  { id: 3, text: "No", imageUrl: "/placeholder.svg?height=100&width=100", categoryId: 1 },
  { id: 4, text: "Thank you", imageUrl: "/placeholder.svg?height=100&width=100", categoryId: 1 },
  { id: 5, text: "Please", imageUrl: "/placeholder.svg?height=100&width=100", categoryId: 1 },
  { id: 6, text: "Eat", imageUrl: "/placeholder.svg?height=100&width=100", categoryId: 2 },
  { id: 7, text: "Drink", imageUrl: "/placeholder.svg?height=100&width=100", categoryId: 2 },
  { id: 8, text: "Walk", imageUrl: "/placeholder.svg?height=100&width=100", categoryId: 2 },
  { id: 9, text: "Happy", imageUrl: "/placeholder.svg?height=100&width=100", categoryId: 3 },
  { id: 10, text: "Sad", imageUrl: "/placeholder.svg?height=100&width=100", categoryId: 3 },
]

export async function GET(request: Request) {
  try {
    // Get the category ID from the query parameters
    const { searchParams } = new URL(request.url)
    const categoryId = searchParams.get("categoryId")

    // Filter words by category if categoryId is provided
    const filteredWords = categoryId ? words.filter((word) => word.categoryId === Number.parseInt(categoryId)) : words

    return NextResponse.json({
      success: true,
      data: filteredWords,
    })
  } catch (error) {
    console.error("Error fetching words:", error)
    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch words",
      },
      { status: 500 },
    )
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()

    // Validate the request body
    if (!body.text || !body.categoryId) {
      return NextResponse.json(
        {
          success: false,
          message: "Text and categoryId are required",
        },
        { status: 400 },
      )
    }

    // In a real app, you would save to a database here
    // For now, we'll just return success with the data
    const newWord = {
      id: words.length + 1,
      text: body.text,
      imageUrl: body.imageUrl || "/placeholder.svg?height=100&width=100",
      categoryId: Number.parseInt(body.categoryId),
    }

    return NextResponse.json({
      success: true,
      data: newWord,
    })
  } catch (error) {
    console.error("Error adding word:", error)
    return NextResponse.json(
      {
        success: false,
        message: "Failed to add word",
      },
      { status: 500 },
    )
  }
}
