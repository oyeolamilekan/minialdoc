import { BASE_URL } from "@/config/url";
import { Metadata } from "next";
import { headers } from "next/headers";

async function fetchSeoData(subdomain: string) {
  const response = await fetch(
    `${BASE_URL}projects/fetch_project/${encodeURIComponent(subdomain)}`,
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

export async function generateMetadata({ params }: { params: { domain: string } }): Promise<Metadata> {
  const pageData = await fetchSeoData(params.domain as string);
  const headersList = headers();
  const hostname = headersList.get('host') || '';

  return {
    title: pageData?.title,
    description: pageData?.description?.substring(0, 160),
    openGraph: {
      title: pageData?.title,
      description: pageData?.description,
      url: `https://${hostname}`,
      siteName: pageData?.title,
      locale: 'en_US',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: pageData?.title,
      description: pageData?.description
    }
  };
}

export default async function DefaultLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      {children}
    </>
  );
}