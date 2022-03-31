import { sanityClient } from './../../sanity';

// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
const client = sanityClient;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { _id, name, email, comment } = JSON.parse(req.body)

  try {
    await client.create({
      _type: 'comment',
      post: {
        _type: 'reference',
        _ref: _id
      },
      name,
      email,
      comment
    })
  } catch (ex) {
    return res.status(500).json({ message: 'Could not submit comment', ex })
  }

  res.status(200).json({ message: 'Comment submitted' })
}
