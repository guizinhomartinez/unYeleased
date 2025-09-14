import { fetchAlbumCredits, fetchAlbumSongs } from '@/lib/server-fetching';
import { notFound } from 'next/navigation';
import AlbumPageRootComponent from '@/components/albumpageRoot';
import { AlbumPageRoot, Credits } from '@/lib/interfaces';

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const data: AlbumPageRoot = await fetchAlbumSongs(id.toLowerCase().replace(" ", "-"));
  const credits: Credits[] = await fetchAlbumCredits(id.toLowerCase().replace(" ", "-"));

  //@ts-expect-error
  console.log('Credits:', credits.credits);

  if (data.tracks.length === 0) return notFound();
  
  //@ts-expect-error
  return <AlbumPageRootComponent data={data} albumCreditData={credits.credits} id={id} />
}