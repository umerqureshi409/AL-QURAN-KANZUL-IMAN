// // src/app/api/ai/route.ts
// import { NextResponse } from 'next/server';
// import OpenAI from 'openai';

// // Initialize OpenAI client
// const openai = new OpenAI({
//   apiKey: process.env.OPENAI_API_KEY,
// });

// export async function POST(req: Request) {
//   try {
//     const body = await req.json();
//     const { prompt } = body;

//     if (!prompt) {
//       return NextResponse.json(
//         { error: 'Prompt is required' },
//         { status: 400 }
//       );
//     }

//     const completion = await openai.chat.completions.create({
//       model: "gpt-4o",
//       messages: [
//         {
//           "role": "system",
//           "content": "You are a knowledgeable assistant specializing in Quranic studies and Islamic knowledge. Provide accurate, respectful, and well-referenced answers."
//         },
//         {
//           "role": "user",
//           "content": prompt
//         }
//       ],
//       temperature: 0.7,
//       max_tokens: 500,
//     });

//     return NextResponse.json({
//       content: completion.choices[0].message.content,
//     });
//   } catch (error) {
//     console.error('AI API Error:', error);
//     return NextResponse.json(
//       { error: 'Internal server error' },
//       { status: 500 }
//     );
//   }
// }
// src/app/api/ai/route.ts
import { NextResponse } from 'next/server';

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent";

export async function POST(request: Request) {
  try {
    const { prompt } = await request.json();

    if (!prompt) {
      return NextResponse.json(
        { error: 'Prompt is required' },
        { status: 400 }
      );
    }

    if (!GEMINI_API_KEY) {
      return NextResponse.json(
        { error: 'API key is not configured' },
        { status: 500 }
      );
    }

    const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: prompt
          }]
        }]
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch from Gemini API');
    }

    const data = await response.json();
    
    // Extract the text from the Gemini response
    const content = data.candidates?.[0]?.content?.parts?.[0]?.text || 'No response generated';

    return NextResponse.json({ content });
  } catch (error) {
    console.error('AI API Error:', error);
    return NextResponse.json(
      { error: 'Failed to process the request' },
      { status: 500 }
    );
  }
}