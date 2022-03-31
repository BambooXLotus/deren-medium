import Head from 'next/head'

import Header from '../components/Header'
import Hero from '../components/Hero'
import Posts from '../components/Posts'
import { sanityClient } from '../sanity'
import { Post } from '../typings'

import type { GetServerSideProps, NextPage } from 'next'
interface HomeProps {
  posts: [Post]
}

const HomePage: NextPage<HomeProps> = ({ posts }: { posts: Post[] }) => {
  return (
    <div className="mx-auto max-w-7xl">
      <Head>
        <title>Deren Medium Clone</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Header />
      <Hero />

      <Posts posts={posts} />
    </div>
  )
}

export default HomePage

export const getServerSideProps: GetServerSideProps = async () => {
  const query = `
  *[_type == "post"] {
    _id,
    title
    ,author -> {
    name,
    image
  }, description,
  mainImage,
  slug
  }`

  const posts = await sanityClient.fetch(query)

  return {
    props: {
      posts,
    },
  }
}
