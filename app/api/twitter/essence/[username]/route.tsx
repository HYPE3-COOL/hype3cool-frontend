import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { zodResponseFormat } from "openai/helpers/zod";
import { z } from 'zod';

const xai = new OpenAI({
  apiKey: process.env.xai_api_key,
  baseURL: "https://api.x.ai/v1",
});

// const MODEL = 'grok-2-latest'; //grok-beta
// const MODEL = 'grok-beta'; //
const MODEL = 'grok-vision-beta'; //

// Visual identity components broken down in detail
const VisualIdentitySchema = z.object({
  // Color scheme analysis
  colors: z.object({
    primary: z.string().describe('Main color that defines their profile'),
    secondary: z.array(z.string()).describe('Supporting colors in their visual identity'),
    palette: z.string().describe('Overall color mood/theme (e.g., "cyberpunk neon", "earthy tones", "monochrome")')
  }).describe('Color analysis of the profile\'s visual identity'),

  // Key physical/visual elements that make them recognizable
  iconicElements: z.array(z.object({
    element: z.string().describe('Specific visual element (e.g., "sunglasses", "afro", "cap")'),
    description: z.string().describe('Detailed description of how this element appears'),
    significance: z.number().min(1).max(100)
      .describe('A number from 1-100 indicating importance. How central this element is to their identity (e.g., 95 for defining trademark, 70 for notable feature)'),
  })).describe('Distinctive visual elements that make the profile instantly recognizable'),

  // Overall style characteristics
  styleAttributes: z.array(z.object({
    attribute: z.string().describe('Style descriptor (e.g., "grunge", "minimalist", "anime-inspired")'),
    description: z.string().describe('How this style manifests in their profile')
  })).describe('Overall style characteristics and how they\'re expressed'),

  // Profile image specifics
  profileImage: z.object({
    composition: z.string().describe('How the profile image is composed, including layout and focal points'),
    distinctiveFeatures: z.array(z.string()).describe('Standout visual features that make the profile image memorable'),
    artStyle: z.string().optional().describe('If applicable, the art style used (e.g., pixel art, illustration, photography)')
  }).describe('Analysis of the profile image and its distinctive characteristics')
}).describe('Complete analysis of the profile\'s visual identity components');

const ProfileEssenceSchema = z.object({
  visualIdentity: VisualIdentitySchema.describe('Analysis of all visual components that make the profile distinctive'),
  
  contentIdentity: z.object({
    writingStyle: z.string().describe('Characteristic way of writing and expressing thoughts'),
    signaturePhrases: z.array(z.string()).describe('Recurring phrases or expressions unique to this profile'),
    contentStructure: z.string().describe('How they typically organize and present their content'),
    formattingPatterns: z.array(z.string()).describe('Distinctive ways they format their posts'),
    recurringThemes: z.array(z.string()).describe('Common topics and themes in their content')
  }).describe('Analysis of the profile\'s content and writing characteristics'),
  
  personalityMarkers: z.object({
    traits: z.array(z.string()).describe('Distinctive personality characteristics'),
    interactionPatterns: z.array(z.string()).describe('How they typically interact with others'),
    uniqueBehaviors: z.array(z.string()).describe('Behavioral patterns that make them recognizable')
  }).describe('Analysis of personality traits and behavioral patterns')
}).describe('Complete profile essence extraction including visual, content, and personality elements');

export async function GET(request: NextRequest, { params }: { params: { username: string } }) {
  try {
    const essence = await xai.beta.chat.completions.parse({
      model: MODEL,
      messages: [
        { 
          role: "system", 
          content: `Analyze Twitter profile focusing heavily on visual elements that make them instantly recognizable.
                   Pay special attention to profile picture elements, color schemes, and distinctive visual traits.
                   Return analysis in the specified schema format.`
        },
        { 
          role: "user", 
          content: `Analyze @${params.username}'s profile and extract their visual essence. Focus on:
          
                   1. COLOR SCHEME:
                   - What colors define their profile?
                   - Is there a distinctive color palette or theme?
                   
                   2. ICONIC ELEMENTS:
                   - What specific visual elements make them recognizable? (e.g., sunglasses, hairstyle, accessories)
                   - How are these elements styled or presented?
                   - Rate significance from 1-100 (e.g., 95 for defining trademark, 70 for notable feature)
                   
                   3. STYLE ATTRIBUTES:
                   - What's their overall visual style? (e.g., pixel cartoon, minimalist, grunge, artistic)
                   - How does this style show up in their profile?
                   
                   4. PROFILE IMAGE:
                   - What makes their profile image distinctive?
                   - How is it composed?
                   - What art style is used (if applicable)?
                   
                   Be specific about visual elements that, if replicated, would make people instantly recognize the inspiration.`
        }
      ],
      // response_format: zodResponseFormat(ProfileEssenceSchema, "profile_essence")
    });

    return NextResponse.json({
      username: params.username,
      essence: essence,
      timestamp: new Date().toISOString()
    });

  } catch (error: any) {
    console.error('Error:', error);
    return NextResponse.json({ 
      error: 'Essence extraction failed',
      details: error.message,
      timestamp: new Date().toISOString(),
      requestId: crypto.randomUUID()
    }, { status: 500 });
  }
}