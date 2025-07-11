import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const maskKey = (key: string = '') => {
  if (key) {
    if (key.length < 8) return 'invalid_key';
    return `${key.slice(0, 4)}...${key.slice(-4)}`;
  } else return '';
};

console.log('=== Environment Check ===');
console.log('OPENAI_API_KEY:', maskKey(process.env.OPENAI_API_KEY));
console.log('OPENAI_ORG_ID:', maskKey(process.env.OPENAI_ORG_ID));
console.log('All ENV keys:', Object.keys(process.env));

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  organization: process.env.OPENAI_ORG_ID || "",
});

export async function GET(request: NextRequest) {
  console.log('=== Request Started ===');
  console.log('Request headers:', Object.fromEntries(request.headers));
  console.log('Request URL:', request.url);

  try {
    console.log('=== OpenAI Config ===');
    console.log('OpenAI instance:', {
      apiKey: maskKey(openai.apiKey as string),
      organization: maskKey(openai.organization as string),
      baseURL: openai.baseURL      
    });

    console.log('=== Making OpenAI Request ===');
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: "Say hello and a funny joke." }],
      max_tokens: 100,
    });

    console.log('=== OpenAI Response ===');
    console.log('Response:', completion);

    return NextResponse.json({ message: completion.choices[0].message.content });
  } catch (error: any) {
    console.error('=== Error Details ===');
    console.error('Error type:', typeof error);
    console.error('Error message:', error.message);
    console.error('Error stack:', error.stack);
    console.error('Response details:', error.response?.data);
    console.error('Status code:', error.response?.status);
    console.error('Headers:', error.response?.headers);
    
    return NextResponse.json({ 
      error: 'OpenAI test failed',
      details: error.message
    }, { status: 500 });
  }
} 