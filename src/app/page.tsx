// src/app/page.tsx
import BentoGrid from '@/components/BentoGrid';
import { client } from '@/lib/sanity';
import { ARTIST_DATA_QUERY } from '@/sanity/lib/queries';

export default async function Home() {
  // One fetch to rule them all
  const data = await client.fetch(ARTIST_DATA_QUERY);

  // If the Artist hasn't been created yet, show the guard
  if (!data.artist) {
    return <div className="text-white p-20 text-center uppercase">Artist not found in Sanity</div>;
  }

  return (
    <main className="min-h-screen bg-black py-12 px-6">
      <BentoGrid 
        artist={data.artist} 
        tourDates={data.tourDates} 
        socials={data.socials} 
      />
    </main>
  );
}