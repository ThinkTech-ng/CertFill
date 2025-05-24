export const env = {
  API_BASE_URL: process.env.NEXT_PUBLIC_APP_NAME || 'https://api.certfill.com/api',
  RECIPIENT_SAMPLE_CSV:
    process.env.NEXT_PUBLIC_RECIPIENT_SAMPLE_CSV || 'https://api.reckonio.com/RecipientSample.csv',
  FONT_BASE_URL: process.env.NEXT_PUBLIC_FONT_BASE_URL || 'https://api.reckonio.com/fonts',
  GOOGLE_CLIENT_ID:
    process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID ||
    '874553960260-v10l1rkch6lo1ff7ehv850m6ifk42keq.apps.googleusercontent.com',
};
