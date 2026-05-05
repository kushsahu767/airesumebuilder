import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

export async function POST(request: NextRequest) {
  try {
    const { type, content, context } = await request.json();

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: "OpenAI API key not configured" },
        { status: 503 }
      );
    }

    const client = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    let prompt = "";

    switch (type) {
      case "summary":
        prompt = `You are a professional resume writer. Rewrite and improve the following professional summary to be compelling, concise (2-4 sentences), and tailored for a ${context?.jobTitle || "professional"} role. Use strong action words and quantify achievements where possible. Return only the improved text, no extra commentary.

Summary: ${content}`;
        break;

      case "experience":
        prompt = `You are a professional resume writer. Rewrite and improve the following work experience description using strong action verbs, specific achievements, and quantifiable results where possible. Format as bullet points (each starting with •). Return only the improved bullet points, no extra commentary.

Position: ${context?.position || ""} at ${context?.company || ""}
Description: ${content}`;
        break;

      case "skills":
        prompt = `You are a professional resume writer. Expand and improve the following skills list for a resume. Keep the existing skills and suggest additional relevant skills. Return a comma-separated list of skills only, no extra commentary.

Current skills: ${content}
Category: ${context?.category || "General"}`;
        break;

      default:
        return NextResponse.json({ error: "Invalid enhancement type" }, { status: 400 });
    }

    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 500,
      temperature: 0.7,
    });

    const enhanced = completion.choices[0]?.message?.content?.trim() || content;

    return NextResponse.json({ enhanced });
  } catch (error) {
    console.error("AI enhancement error:", error);
    return NextResponse.json(
      { error: "Failed to enhance content" },
      { status: 500 }
    );
  }
}
