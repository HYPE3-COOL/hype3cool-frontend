// app/api/hype/generate/route.tsx
export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { generateText, Output } from 'ai';
import { openai } from '@ai-sdk/openai';
import { ProfileAnalysisSchema } from '@/schemas/agent';
import { HypeProfileSchema, HypeLevelEnum, HypeStatusEnum } from '@/schemas/hype';
import { z } from 'zod';

// Keep the core scoring functions
const getHypeLevel = (value: number): z.infer<typeof HypeLevelEnum> => {
  if (value <= 20) return "COLD";
  if (value <= 40) return "CHILL";
  if (value <= 60) return "WAVY";
  if (value <= 80) return "BASED";
  if (value <= 95) return "ICONIC";
  return "ULTRA";
};

const getHypeStatus = (totalScore: number): z.infer<typeof HypeStatusEnum> => {
  if (totalScore <= 20) return "FLATLINE";
  if (totalScore <= 40) return "AMBIENT";
  if (totalScore <= 60) return "ELEVATED";
  if (totalScore <= 80) return "MAXIMUM";
  return "ULTRAWAVE";
};

export async function POST(req: NextRequest) {
  try {
    console.info('Received profile analysis request');
    
    const body = await req.json();
    console.debug('Request body:', body);
    
    const analysis = ProfileAnalysisSchema.parse(body);
    console.info('Successfully parsed profile analysis request', {
      analysis // Assuming there's an ID field
      // Log other relevant non-sensitive fields
    });

    console.log('=== Generating hype profile ===');
    const { experimental_output } = await generateText({
      model: openai('chatgpt-4o-latest'),
      experimental_output: Output.object({
        schema: HypeProfileSchema
      }),
      prompt: `Transform this Twitter profile analysis into a hyperwave/synthwave-themed hype profile:

Personality: ${analysis.detailed_analysis.personality_summary}
Interests: ${analysis.primary_interests.join(', ')}
Expertise: ${analysis.expertise_areas.join(', ')}
Style: ${analysis.engagement_style.primary_style} | ${analysis.engagement_style.vibe}
Content: ${analysis.content_domains.join(', ')}

Create a hyper-stylized profile that:
1. Reflects their digital essence in synthwave/hyperwave aesthetic
2. Transforms their expertise into powerful abilities
3. Converts their engagement patterns into signature moves
4. Translates their interests into vapor/aesthetic tags
5. Maintains their authentic voice while amplifying their digital presence

Their stats should emerge naturally from:
- Presence: How they occupy digital space
- Influence: Their impact on conversations
- Virality: Their memetic potential
- Synthmind: Their digital consciousness level
- Wavelength: Their cultural resonance

Make it feel like a character from a neon-soaked digital metropolis while staying true to their analytical profile.`
    });

    console.log('=== Hype profile generated ===');
    return NextResponse.json({
      profile: experimental_output
      // rawScore: totalHypeScore
    });

  } catch (error: any) {
    console.error('\n=== DETAILED ERROR LOG ===');
    console.error('Error type:', typeof error);
    console.error('Error name:', error.name);
    console.error('Error message:', error.message);

    // Handle AI Type Validation Errors specifically
    if (error.cause?.name === 'AI_TypeValidationError') {
        console.error('\n=== SCHEMA VALIDATION FAILURE ===');
        const zodError = error.cause.cause;
        console.error('Validation Issues:', JSON.stringify(zodError.issues, null, 2));
        
        // Log the actual data that failed validation
        console.error('\nReceived Data:', JSON.stringify(error.cause.value, null, 2));
        
        return NextResponse.json({ 
            error: 'Schema validation failed',
            validationErrors: zodError.issues,
            receivedData: error.cause.value,
            timestamp: new Date().toISOString(),
            requestId: crypto.randomUUID()
        }, { status: 400 });
    }

    // Handle AI No Object Generated Error
    if (error.name === 'AI_NoObjectGeneratedError') {
        console.error('\n=== AI RESPONSE ERROR ===');
        console.error('Raw AI text response:', error.text);
        console.error('AI response metadata:', error.response);
        console.error('Token usage:', error.usage);
    }

    // Log any response details if available
    if (error.response) {
        console.error('\n=== RESPONSE DETAILS ===');
        console.error('Response status:', error.response.status);
        console.error('Response data:', error.response.data);
    }

    console.error('\nStack trace:', error.stack);

    return NextResponse.json({ 
        error: 'Profile generation failed',
        message: error.message,
        type: error.name,
        timestamp: new Date().toISOString(),
        requestId: crypto.randomUUID()
    }, { status: 500 });
  }}
  