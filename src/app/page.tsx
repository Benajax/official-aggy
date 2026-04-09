// src/app/page.tsx
import BentoGrid from '@/components/BentoGrid';
import { client } from '@/lib/sanity';
import { ARTIST_DATA_QUERY } from '@/sanity/lib/queries';

export default async function Home() {
  /**
   * By adding 'tags', we give this specific data a label ('artist') 
   * that we can target later to clear the cache instantly.
   */
  const data = await client.fetch(
    ARTIST_DATA_QUERY,
    {},
    {
      next: { tags: ['artist'] }
    }
  );

  // Use optional chaining (?.) and a more robust guard for the artist data
  if (!data?.artist) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black text-white p-20 text-center uppercase tracking-widest">
        Artist data not found in Sanity
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-black py-12 px-6">
      <BentoGrid 
        artist={data.artist} 
        // Providing empty array fallbacks prevents crashes if data is missing
        tourDates={data.tourDates || []} 
        socials={data.socials || []} 
      />
    </main>
  );
}