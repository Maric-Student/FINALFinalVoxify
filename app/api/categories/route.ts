import { NextResponse } from "next/server"

// Mock data for categories
const categories = [
  { id: 1, name: "Common" },
  { id: 2, name: "Actions" },
  { id: 3, name: "Feelings" },
  { id: 4, name: "Food" },
  { id: 5, name: "Places" },
]

export async function GET() {
  try {
    return NextResponse.json({
      success: true,
      data: categories,
    })
  } catch (error) {
    console.error("Error fetching categories:", error)
    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch categories",
      },
      { status: 500 },
    )
  }
}
