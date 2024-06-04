/**
 * Defines the schema for environment variables using Zod.
 * This ensures that the necessary environment variables are of the correct type.
 *
 * @module
 */
import { z } from "zod";

/**
 * Schema definition for the expected environment variables.
 * Each variable is expected to be a string.
 */
const envSchema = z.object({
  SUPABASE_URL: z.string(),
  SUPABASE_KEY: z.string(),
});

/**
 * Parses the environment variables using the defined schema.
 * This will throw an error at runtime if any variable is missing or of an incorrect type.
 */
export const env = envSchema.parse(process.env);
