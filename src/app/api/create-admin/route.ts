import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { user } from "@/lib/schema"
import { eq } from "drizzle-orm"

export async function GET() {
  try {
    // ONLY FOR DEVELOPMENT - Remove this in production!
    
    // First check if admin already exists
    const existingAdmin = await db
      .select()
      .from(user)
      .where(eq(user.email, "admin@careservice.es"))
      .limit(1)
    
    if (existingAdmin.length > 0) {
      // Delete existing admin
      await db
        .delete(user)
        .where(eq(user.email, "admin@careservice.es"))
    }
    
    // Create new admin user using Better Auth
    const result = await auth.api.signUpEmail({
      body: {
        email: "admin@careservice.es",
        password: "Admin123!",
        name: "CareService Admin",
      },
      asResponse: false,
    })
    
    // Update the user role to admin
    await db
      .update(user)
      .set({ 
        role: "admin",
        is_verified: true,
        is_active: true,
        updatedAt: new Date()
      })
      .where(eq(user.email, "admin@careservice.es"))
    
    return NextResponse.json({ 
      message: "Admin user created successfully",
      email: "admin@careservice.es",
      password: "Admin123!",
      warning: "REMOVE THIS ENDPOINT IN PRODUCTION!"
    })
  } catch (error: any) {
    console.error("Admin creation error:", error)
    return NextResponse.json({ 
      error: error.message || "Failed to create admin user" 
    }, { status: 500 })
  }
}