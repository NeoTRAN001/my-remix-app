import { useLoaderData } from 'remix';
import type {LoaderFunction} from 'remix';
import { getPost } from '~/post.js';

export const loader : LoaderFunction = ({ params }) => {
  const { slug } = params;

  if(slug === undefined) throw new Error('Slug is required');
  const post = getPost(slug);

  return post;
}

export default function Post() {

  const post = useLoaderData();

  return (
    <>
      <h1>{post.title}</h1>
      <div dangerouslySetInnerHTML={{__html: post.content}} />
    </>
  )
}