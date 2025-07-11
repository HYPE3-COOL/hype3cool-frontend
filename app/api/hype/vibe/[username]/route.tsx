import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const maskKey = (key: string = '') => {
  if (key) {
    if (key.length < 8) return 'invalid_key';
    return `${key.slice(0, 4)}...${key.slice(-4)}`;
  } else return '';
};

const xai = new OpenAI({
  apiKey: process.env.XAI_API_KEY,
  baseURL: "https://api.x.ai/v1",
});

export async function GET(request: NextRequest, { params }: { params: { username: string } }) {
  console.log('=== Request Started ===');
  console.log('Analyzing username:', params.username);
  console.log('Request URL:', request.url);

  try {
    console.log('=== XAI Config ===');
    console.log('XAI instance:', {
      apiKey: maskKey(xai.apiKey as string),
      baseURL: xai.baseURL
    });

    console.log('=== Making Grok Request ===');
    const completion = await xai.chat.completions.create({
      model: "grok-1",
      messages: [
        { 
          role: "system", 
          content: "You are an AI trained to analyze Twitter profiles and find compatible accounts. Focus on engagement patterns, interests, and communication style."
        },
        { 
          role: "user", 
          content: `Analyze Twitter user @${params.username} and suggest compatible accounts they might enjoy following. Consider:
            1. Content themes and interests
            2. Interaction style
            3. Professional vs casual tone
            4. Posting frequency
            5. Community involvement
            
            Provide specific reasons for each recommendation.`
        }
      ],
      max_tokens: 2000,
    });

    console.log('=== Grok Response ===');
    console.log('Response:', completion);

    return NextResponse.json({ 
      username: params.username,
      analysis: completion.choices[0].message.content,
      timestamp: new Date().toISOString()
    });

  } catch (error: any) {
    console.error('=== Error Details ===');
    console.error('Error type:', typeof error);
    console.error('Error message:', error.message);
    console.error('Error stack:', error.stack);
    console.error('Response details:', error.response?.data);
    console.error('Status code:', error.response?.status);
    
    return NextResponse.json({ 
      error: 'Profile analysis failed',
      username: params.username,
      details: error.message,
      timestamp: new Date().toISOString(),
      requestId: crypto.randomUUID()
    }, { status: 500 });
  }
}