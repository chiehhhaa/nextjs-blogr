import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]';
import prisma from '../../../lib/prisma';

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { title, content } = req.body;
  console.log('Title:', title, 'Content:', content);

  try {
    const session = await getServerSession(req, res, authOptions);
    console.log('！！！Session！！！:', session);

    if (!session || !session.user?.email) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    const result = await prisma.post.create({
      data: {
        title: title,
        content: content,
        author: { connect: { email: session.user.email } },
      },
    });

    res.json(result);
  } catch (error) {
    console.error('Error creating post:', error);
    res.status(500).json({ error: 'Error creating post' });
  }
}
