import * as z from 'zod';

export const alphaNumericUnderscoreSchema = z.string().regex(/^[a-zA-Z0-9_]+$/, {
  message: 'Only alphabets, numbers, and underscores are allowed',
});
