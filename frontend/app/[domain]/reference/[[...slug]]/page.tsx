import { BASE_URL } from '@/config/url';
import Reference from './reference';
import { headers } from 'next/headers';
import { Metadata } from 'next';

type Props = {
  params: {
    slug: string,
    domain: string,
  }
}

async function fetchSeoData(endpointSlug: string) {
  const response = await fetch(
    `${BASE_URL}endpoints/fetch_endpoint//${encodeURIComponent(endpointSlug)}`,
    {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
      cache: 'no-cache',
      credentials: 'same-origin',
    }
  );
  const data = await response.json();
  return data.data;
}

export async function generateMetadata({ params }: { params: { slug: string, domain: string } }): Promise<Metadata> {
  if(!params.slug) return {}
  const pageData = await fetchSeoData(params.slug as string);
  const headersList = headers();
  const hostname = headersList.get('host') || '';

  return {
    title: pageData?.title,
    description: pageData?.body,
    openGraph: {
      title: pageData?.title,
      description: pageData?.body?.description,
      url: `https://${hostname}`,
      siteName: pageData?.title,
      locale: 'en_US',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: pageData?.title,
      description: pageData?.body
    }
  };
}


export default function Page({ params: { slug, domain } }: Props) {
  return (
    <>
      <Reference slug={slug} domain={domain} />
    </>
  )
}
