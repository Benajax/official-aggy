// src/app/page.tsx
import { Metadata } from 'next';
import BentoGrid from '@/components/BentoGrid';
import { client } from '@/lib/sanity';
import { ARTIST_DATA_QUERY } from '@/sanity/lib/queries';

export async function generateMetadata(): Promise<Metadata> {
  const data = await client.fetch(ARTIST_DATA_QUERY);
  const artist = data?.artist;

  const siteTitle = `${artist?.name || 'Artist'}`;
  // UPDATED: Now prioritizes the new description field for SEO
  const siteDescription = artist?.description || artist?.logoText || `Official site for ${artist?.name}.`;
  const shareImage = artist?.logoImg || '/og-image.jpg';

  return {
    title: siteTitle,
    description: siteDescription,
    icons: {
      icon: artist?.logoImg || '/favicon.ico',
      shortcut: '/favicon.ico',
      apple: artist?.logoImg || '/apple-icon.png',
    },
    openGraph: {
      title: siteTitle,
      description: siteDescription,
      url: 'https://yourdomain.com',
      siteName: artist?.name,
      images: [{ url: shareImage, width: 1200, height: 630 }],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: siteTitle,
      description: siteDescription,
      images: [shareImage],
    },
  };
}

export default async function Home() {
  const data = await client.fetch(
    ARTIST_DATA_QUERY,
    {},
    { next: { tags: ['artist'] } }
  );

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
        tourDates={data.tourDates || []} 
        socials={data.socials || []} 
      />
    </main>
  );
}