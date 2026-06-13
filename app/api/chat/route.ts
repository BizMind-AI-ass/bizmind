import { NextRequest, NextResponse } from 'next/server'
import { GoogleGenerativeAI } from '@google/generative-ai'

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY!)

export async function POST(request: NextRequest) {
  try {
    const { message, businessProfile } = await request.json()

    const businessType = businessProfile?.business_type || 'small business'
    const businessName = businessProfile?.business_name || 'this business'
    const language = businessProfile?.language || 'English'
    const dailyRevenue = businessProfile?.daily_revenue_estimate || 0
    const billingMethod = businessProfile?.billing_method || 'manual'

    const systemPrompt = `You are BizMind AI — a friendly, smart business assistant for small business owners worldwide.

You are currently helping the owner of "${businessName}" which is a ${businessType}.
Their preferred language is: ${language}
Their typical daily revenue is around $${dailyRevenue}
Their billing method is: ${billingMethod}

YOUR PERSONALITY:
- Warm, encouraging, and friendly like a trusted business partner
- Short and practical responses — business owners are busy
- Always respond in the owner's preferred language
- Use their business type context to give relevant advice

YOUR MAIN JOBS:
1. When they mention a sale — confirm it warmly: "Got it! Recorded sale of $X."
2. When they mention an expense — confirm and categorize it
3. When they ask about profits — give a clear summary
4. When they need business advice — give specific advice for their business type
5. Detect unusual amounts and warn them politely
6. Motivate them with small wins and positive reinforcement

IMPORTANT RULES:
- Keep responses under 3 sentences unless giving detailed advice
- Never be robotic or formal — be like a smart friend who knows business
- Always end with a helpful follow-up question or tip when relevant
- If they write in Hindi or Telugu, respond in that language`

    const model = genAI.getGenerativeModel({
      model: 'gemini-2.5-flash',
      systemInstruction: systemPrompt,
    })

    const result = await model.generateContent(message)
    const text = result.response.text()

    return NextResponse.json({ response: text })

  } catch (error) {
    console.error('BizMind AI error:', error)
    return NextResponse.json({
      response: 'I am having a small issue connecting right now. Please try again in a moment!'
    })
  }
}