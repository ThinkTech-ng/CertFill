import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { code } = await request.json();

    if (!code) {
      return NextResponse.json(
        { success: false, error: "Authorization code is required" },
        { status: 400 }
      );
    }

    // Exchange the code for tokens with Google
    const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        code,
        client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!,
        client_secret: process.env.GOOGLE_CLIENT_SECRET!, // Kept secure on server
        redirect_uri: process.env.NEXT_PUBLIC_GOOGLE_REDIRECT_URI!,
        grant_type: "authorization_code",
      }),
    });

    if (!tokenResponse.ok) {
      const errorData = await tokenResponse.json();
      console.error("Google token exchange error:", errorData);
      return NextResponse.json(
        { success: false, error: "Failed to exchange Google token" },
        { status: 500 }
      );
    }

    const tokens = await tokenResponse.json();

    // Return only what the client needs (the idToken)
    return NextResponse.json({
      success: true,
      idToken: tokens.id_token,
    });
  } catch (error) {
    console.error("Server error during Google authentication:", error);
    return NextResponse.json(
      { success: false, error: "Authentication failed" },
      { status: 500 }
    );
  }
}
