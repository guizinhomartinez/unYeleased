import { fetchAlbumCredits, fetchAlbumSongs } from '@/lib/server-fetching';
import { notFound } from 'next/navigation';
import AlbumPageRootComponent from '@/components/albumpageRoot';
import { AlbumPageResponse, CreditsResponse } from '@/lib/interfaces';

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const data: AlbumPageResponse = await fetchAlbumSongs(id.toLowerCase().replace(" ", "-"));
  const credits: CreditsResponse = await fetchAlbumCredits(id.toLowerCase().replace(" ", "-"));

  if (data === "NOT FOUND") return notFound();

  //@ts-expect-error
  return <AlbumPageRootComponent data={data} albumCreditData={credits.credits} id={id.toLowerCase().replace(" ", "-")} />
}