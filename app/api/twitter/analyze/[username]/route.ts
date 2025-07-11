import { NextRequest, NextResponse } from 'next/server';
import { Scraper } from 'agent-twitter-client'; 
import { generateText, Output } from 'ai';
import { openai } from '@ai-sdk/openai';
import { ProfileAnalysisSchema } from '@/schemas/agent';

export async function GET(request: NextRequest, { params }: { params: { username: string } }) {
    try {
        const scraper = new Scraper();
        const profile = await scraper.getProfile(params.username);
        

        if (!profile) {
          console.error('Profile not found');
          return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
        }

        // console.log('=== Fetching tweets ===');    
        // Get recent tweets for better analysis
        // const recentTweets = await scraper.getUserTweets(params.username, 50);
        
        console.log('=== Generating analysis ===');
        // Recent Tweet Sample: ${JSON.stringify(recentTweets.tweets.slice(0, 5))}
        const { experimental_output } = await generateText({
            model: openai('chatgpt-4o-latest'),
            experimental_output: Output.object({
                schema: ProfileAnalysisSchema
            }),
            prompt: `Analyze this Twitter profile for meaningful recommendation patterns:
                Name: ${profile.name}
                Username: @${profile.username}
                Bio: ${profile.biography || 'No bio provided'}                
                
                Extract key patterns focusing on:
                1. Core interests and expertise areas
                2. Interaction and engagement style
                3. Content preferences and triggers
                4. Community fit and collaboration patterns
                5. Key signals for finding compatible accounts
                6. Comprehensive personality analysis and behavior patterns
                
                Provide a detailed analysis covering:
                - Their unique Twitter presence and communication style
                - Observable patterns in their content and interactions
                - Community role and relationship dynamics
                - Notable behavioral traits and tendencies
                - Potential compatibility factors for recommendations
                
                Goal: Create a comprehensive understanding of their Twitter persona and identify patterns that would help find accounts they'd genuinely enjoy following`
        });

        // Prepare data for Twitter API
        const recommendationRequest = {
            user_id: profile.userId,
            analysis: {
                interests: experimental_output.primary_interests,
                engagement_patterns: experimental_output.engagement_style,
                content_preferences: experimental_output.content_affinity,
                compatibility_signals: experimental_output.recommendation_signals
            }
        };

        // You'd implement the actual Twitter API call here
        // const recommendations = await fetch('https://api.twitter.com/2/users/${profile.id}/recommendations', {
        //     method: 'POST',
        //     headers: {
        //         'Authorization': `Bearer ${process.env.TWITTER_API_TOKEN}`,
        //         'Content-Type': 'application/json'
        //     },
        //     body: JSON.stringify(recommendationRequest)
        // });

        console.log('=== Analysis complete ===');
        return NextResponse.json({
            analysis: experimental_output,
            // recommendations: await recommendations.json()
        }, { status: 200 });

    } catch (error: any) {
      console.error('=== Detailed Error Log ===');
      console.error('Error type:', typeof error);
      console.error('Error name:', error.name);
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
      
      if (error.response) {
          console.error('Response status:', error.response.status);
          console.error('Response data:', error.response.data);
      }
  
      // Return a more specific error message
      return NextResponse.json({ 
          error: 'Analysis failed',
          details: error.message,
          type: typeof error
      }, { status: 500 });
  }
}