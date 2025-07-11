import { z } from "zod";

const InteractionStyleEnum = z.enum(["INFORMATIVE", "ENTERTAINING", "ENGAGING", "PROVOCATIVE", "SUPPORTIVE"]);
const ContentTypeEnum = z.enum(["TECHNICAL", "CREATIVE", "PROFESSIONAL", "CASUAL", "MIXED"]);
const VibeEnum = z.enum(["SERIOUS", "PLAYFUL", "INTELLECTUAL", "CHILL", "ENERGETIC"]);

export const ProfileAnalysisSchema = z.object({
  // Comprehensive Analysis
  detailed_analysis: z.object({
      personality_summary: z.string().min(200),  // Long-form analysis
      key_observations: z.array(z.string()),
      behavioral_patterns: z.string(),
      recommendation_rationale: z.string()
  }),

  // Core Interests & Topics
  primary_interests: z.array(z.string()).max(5),
  content_domains: z.array(z.string()).max(5),
  expertise_areas: z.array(z.string()).max(3),
  
  // Interaction Patterns
  engagement_style: z.object({
      primary_style: InteractionStyleEnum,
      content_type: ContentTypeEnum,
      vibe: VibeEnum,
      response_patterns: z.array(z.string()).max(3)
  }),
  
  // Content Preferences
  content_affinity: z.object({
      preferred_formats: z.array(z.string()).max(3),
      topic_weights: z.array(z.object({
          topic: z.string(),
          weight: z.number().min(0).max(1)
      })).max(5),
      engagement_triggers: z.array(z.string()).max(3)
  }),
  
  // Community Interaction
  community_fit: z.object({
      preferred_communities: z.array(z.string()).max(3),
      interaction_frequency: z.string(),
      collaboration_style: z.string()
  }),
  
  // Recommendation Signals
  recommendation_signals: z.object({
      key_indicators: z.array(z.string()).max(5),
      compatibility_factors: z.array(z.object({
          factor: z.string(),
          importance: z.number().min(0).max(1)
      })).max(5),
      avoid_patterns: z.array(z.string()).max(3)
  })
});
