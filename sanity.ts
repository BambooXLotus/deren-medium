import imageUrlBuilder from '@sanity/image-url';
import { SanityImageSource } from '@sanity/image-url/lib/types/types';
import { ClientConfig, createClient, createCurrentUserHook } from 'next-sanity';

export const config: ClientConfig = {
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID as string,
  apiVersion: '2021-03-25',
  useCdn: process.env.NODE_ENV === 'production',
  token: process.env.SANITY_API_TOKEN
}

export const sanityClient = createClient(config);

export const urlFor = (source: SanityImageSource) => imageUrlBuilder(sanityClient).image(source).auto('format')

export const useCurrentUser = createCurrentUserHook(config)