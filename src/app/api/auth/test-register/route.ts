import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password, name } = body
    
    if (!email || !password || !name) {
      return NextResponse.json(
        { error: "Email, password, and name are required" },
        { status: 400 }
      )
    }
    
    // Use Better-Auth to create a user
    try {
      const result = await auth.api.signUpEmail({
        body: {
          email,
          password,
          name,
        },
        asResponse: false,
      })
      
      return NextResponse.json({
        success: true,
        user: result.user,
        session: result.token,
      })
    } catch (signupError: unknown) {
      return NextResponse.json(
        { error: signupError instanceof Error ? signupError.message : "Registration failed" },
        { status: 400 }
      )
    }
  } catch (error: unknown) {
    console.error("Registration error:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Registration failed" },
      { status: 500 }
    )
  }
}

// Test endpoint to verify auth is working
export async function GET() {
  return NextResponse.json({
    message: "Use POST to register a test user",
    example: {
      email: "test@example.com",
      password: "password123",
      name: "Test User"
    }
  })
}