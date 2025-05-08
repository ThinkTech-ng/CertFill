export const env = {
  API_BASE_URL:
    process.env.NEXT_PUBLIC_APP_NAME || "https://api.certfill.com/api",
  RECIPIENT_SAMPLE_CSV:
    process.env.NEXT_PUBLIC_RECIPIENT_SAMPLE_CSV ||
    "https://certfillapi.reckonio.com/RecipientSample.csv",
  FONT_BASE_URL:
    process.env.NEXT_PUBLIC_FONT_BASE_URL ||
    "https://certfillapi.reckonio.com/fonts",
  GOOGLE_CLIENT_ID:
    process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "",
};
