import { GetStaticPaths, GetStaticProps, NextPage } from 'next'
import { Children, useState } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import PortableText from 'react-portable-text'

import Header from '../../components/Header'
import { getPostbySlug } from '../../queries/queries'
import { sanityClient, urlFor } from '../../sanity'
import { Post } from '../../typings'

interface ICommentForm {
  _id: string
  name: string
  email: string
  comment: string
}

interface PostPageProps {
  post: Post
}

const PostPage: NextPage<PostPageProps> = ({ post }: PostPageProps) => {
  const [submitted, setSubmitted] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ICommentForm>()

  const onSubmit: SubmitHandler<ICommentForm> = (data) => {
    fetch('/api/comments', {
      method: 'POST',
      body: JSON.stringify(data),
    })
      .then(() => {
        console.log(data)
        setSubmitted(true)
      })
      .catch((err) => {
        console.log(err)
        setSubmitted(false)
      })
  }

  return (
    <main>
      <Header />
      <img
        className="h-40 w-full object-cover"
        src={urlFor(post.mainImage).url()}
        alt={post.title}
      />

      <article className="mx-auto max-w-3xl p-5">
        <h1 className="mt-10 mb-3 text-3xl">{post.title}</h1>
        <h2 className="mb-2 text-xl font-light text-gray-500">
          {post.description}
        </h2>
        <div className="flex items-center space-x-2">
          <img
            className="h-10 w-10 rounded-full"
            src={urlFor(post.author.image).url()}
            alt={post.author.name}
          />
          <p className="text-sm font-extralight">
            Blog post by{' '}
            <span className="text-green-600">{post.author.name}</span> -
            Published at {new Date(post._createdAt).toLocaleString()}
          </p>
        </div>

        <div className="mt-10">
          <PortableText
            dataset={process.env.NEXT_PUBLIC_SANITY_DATASET!}
            projectId={process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!}
            content={post.body}
            serializers={{
              h1: (props: any) => (
                <h1 className="my-5 text-2xl font-bold" {...props} />
              ),
              h2: (props: any) => (
                <h2 className="my-5 text-xl font-bold" {...props} />
              ),
              li: ({ children }: any) => (
                <li className="ml-4 list-disc">{children}</li>
              ),
              link: ({ href, children }: any) => (
                <a href={href} className="hove:underline text-blue-500">
                  {children}
                </a>
              ),
            }}
          />
        </div>
      </article>

      <hr className="my-5 mx-auto max-w-lg border border-yellow-500" />

      {post.comments && post.comments.length > 0 && (
        <div className="mx-auto my-10 flex max-w-2xl flex-col p-10 shadow shadow-yellow-500">
          <h3>Comments</h3>
          <hr className="pb-2" />

          {post.comments?.map((comment) => (
            <div key={comment._id}>
              <p>
                <span className="text-yellow-500">{comment.name} : </span>
                {comment.comment}
              </p>
            </div>
          ))}
        </div>
      )}

      {submitted ? (
        <div className="my-10 mx-auto flex max-w-2xl flex-col space-x-2 bg-yellow-500 p-10 text-white">
          <h3 className="text-3xl font-bold">
            Thank you for submitting your comment!
          </h3>
          <p>Once it has been approved, it will appear below!</p>
        </div>
      ) : (
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="my-10 mx-auto mb-10 flex max-w-2xl flex-col p-5"
        >
          <h3 className="text-sm text-yellow-500">Enjoyed this article?</h3>
          <h4 className="text-3xl font-bold">Leave a comment below!</h4>
          <hr className="mt-2 py-3" />

          <input
            {...register('_id')}
            type="hidden"
            name="_id"
            value={post._id}
          />

          <label className="mb-5 block">
            <span className="text-gray-500">Name</span>
            <input
              {...register('name', { required: true })}
              className="form-style"
              placeholder="John Smith"
              type="text"
            />
          </label>
          <label className="mb-5 block">
            <span className="text-gray-500">Email</span>
            <input
              {...register('email', { required: true })}
              className="form-style"
              placeholder="John Smith"
              type="email"
            />
          </label>
          <label className="mb-5 block">
            <span className="text-gray-500">Comment</span>
            <textarea
              {...register('comment', { required: true })}
              className="form-style"
              placeholder="John Smith"
              rows={8}
            />
          </label>

          <div className="flex flex-col p-5">
            {errors.name && (
              <span className="text-red-500">- The Name Field is required</span>
            )}
            {errors.email && (
              <span className="text-red-500">
                - The Email Field is required
              </span>
            )}
            {errors.comment && (
              <span className="text-red-500">
                - The Comment Field is required
              </span>
            )}
          </div>

          <input
            className="cursor-pointer rounded bg-yellow-500 py-2 px-4 font-bold text-white shadow hover:bg-yellow-400 focus:shadow focus:outline-none"
            type="submit"
          />
        </form>
      )}
    </main>
  )
}

export default PostPage

export const getStaticProps: GetStaticProps = async ({ params }) => {
  // const query = `*[_type == "post" && slug.current == $slug][0] {
  //   _id,
  //   _createdAt,
  //   title,
  //   author -> {
  //   name,
  //   image
  // },
  // description,
  // mainImage,
  // slug,
  // body
  // }`
  const query = getPostbySlug

  const post = await sanityClient.fetch(query, { slug: params?.slug })

  if (!post) {
    return {
      notFound: true,
    }
  }

  return {
    props: {
      post,
    },
    revalidate: true,
  }
}

export const getStaticPaths: GetStaticPaths = async () => {
  const query = `*[_type == "post"] {
  _id,
  slug {
  current 
  }
  }`

  const posts = await sanityClient.fetch(query)

  const paths = posts.map((post: Post) => ({
    params: {
      slug: post.slug.current,
    },
  }))

  return {
    paths,
    fallback: 'blocking',
  }
}
