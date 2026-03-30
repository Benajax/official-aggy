export async function getSocials() {
  const BEHOLD_URL = "https://behold.so/api/feed/YOUR_ID"; // Get this from Behold.so
  const res = await fetch(BEHOLD_URL, { next: { revalidate: 3600 } });
  return res.ok ? res.json() : [];
}