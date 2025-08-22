import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import { user } from "@/lib/schema"
import { eq } from "drizzle-orm"
import { auth } from "@/lib/auth"

export async function GET() {
  try {
    // ONLY FOR DEVELOPMENT - Remove this in production!
    const newPassword = "Admin123!"
    
    // Use Better Auth's password hashing method
    const { hash } = await auth.api.getHashAndSalt({ password: newPassword })
    
    // Update admin password
    const result = await db
      .update(user)
      .set({ 
        password: hash,
        updatedAt: new Date()
      })
      .where(eq(user.email, "admin@careservice.es"))
      .returning()

    if (result.length === 0) {
      return NextResponse.json({ 
        error: "Admin user not found" 
      }, { status: 404 })
    }

    return NextResponse.json({ 
      message: "Admin password reset successful",
      email: "admin@careservice.es",
      newPassword: "Admin123!",
      warning: "REMOVE THIS ENDPOINT IN PRODUCTION!"
    })
  } catch (error) {
    console.error("Password reset error:", error)
    return NextResponse.json({ 
      error: "Failed to reset password" 
    }, { status: 500 })
  }
}