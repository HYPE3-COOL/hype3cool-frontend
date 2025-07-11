import { z } from 'zod';

export const HypeLevelEnum = z.enum([
  "COLD",    // 0-20
  "CHILL",   // 21-40
  "WAVY",    // 41-60
  "BASED",   // 61-80
  "ICONIC",  // 81-95
  "ULTRA"    // 96-100
]).describe('Represents the intensity level of a hype attribute on a scale from COLD to ULTRA');

export const HypeStatusEnum = z.enum([
  "FLATLINE",   // Overall dormant
  "AMBIENT",    // Steady presence
  "ELEVATED",   // Rising influence
  "MAXIMUM",    // Peak performance
  "ULTRAWAVE"   // Transcendent state
]).describe('Indicates the overall hype momentum and influence state');

// Enhanced Hype Profile Schema
export const HypeProfileSchema = z.object({
    // Identity Section
    username: z.string().min(3).max(32)
        .describe('Unique identifier for the profile, 3-32 characters'),
    displayName: z.string().min(2).max(50)
        .describe('Public display name shown in the interface, 2-50 characters'),
    avatarUrl: z.string().nullable()
        .describe('URL to profile avatar image, can be null for default avatar'),

    // Core Stats Section
    name: HypeLevelEnum
        .describe('Overall name recognition and brand strength'),
    presence: HypeLevelEnum
        .describe('Digital footprint and visibility across platforms'),
    influence: HypeLevelEnum
        .describe('Impact and authority within the community'),
    virality: HypeLevelEnum
        .describe('Ability to generate and spread viral content'),

    // Advanced Metrics Section
    synthmind: HypeLevelEnum
        .describe('Cognitive alignment with digital culture and trends'),
    aesthetics: HypeLevelEnum
        .describe('Visual and stylistic impact of content'),
    wavelength: HypeLevelEnum
        .describe('Resonance with audience and cultural frequencies'),
    
    // Meta Stats Section
    totalHypeScore: z.number()
        .describe('Aggregate numerical score of all hype attributes'),
    rank: z.number()
        .describe('Global ranking position among all profiles'),
    hypeStatus: HypeStatusEnum
        .describe('Current momentum and influence state'),

    // Capabilities Section
    abilities: z.array(z.object({
        name: z.string()
            .describe('Unique name of the special ability'),
        power: z.number().min(0).max(100)
            .describe('Effectiveness rating from 0-100'),
        description: z.string()
            .describe('Detailed explanation of the ability\'s effects')
    })).max(4)
        .describe('Set of up to 4 unique special abilities'),

    // Special Moves Section
    finishers: z.array(z.string()).max(3)
        .describe('Collection of up to 3 signature move names'),

    // Aesthetic Markers Section
    vaporTags: z.array(z.string()).max(5)
        .describe('Up to 5 aesthetic/cultural tags defining the profile\'s style'),
    
    // Generated Content Section
    description: z.string()
        .describe('AI-generated narrative describing the profile\'s essence and impact'),
    personality: z.string()
        .describe('Concise summary of key personality traits and characteristics')
}).describe('Complete profile schema for the Hype system, containing identity, stats, abilities, and generated content');