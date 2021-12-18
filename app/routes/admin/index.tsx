import { Form, redirect, useActionData } from 'remix';
import { createPost } from '~/post';
import type { ActionFunction } from '@remix-run/server-runtime';

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();

  const title = formData.get('title') as string;
  const content = formData.get('content') as string;
  const slug = formData.get('slug') as string;

  let errors = {
    title: false,
    content: false,
    slug: false,
  }

  if(!title) errors.title = true;
  if(!content) errors.content = true;
  if(!slug) errors.slug = true;

  if(errors.title || errors.content || errors.slug) return errors;

  await createPost({ title, content, slug });

  return redirect('/posts/' + slug);
}

export default function Admin() {

  const errors = useActionData();

  return (
    <>
      <h1>Admin</h1>
      <Form method='post'>
        <label>
          <h4>Post Title</h4>
          {errors?.title && <small>Title is required</small>}
          <input type="text" name='title' placeholder="Post Title" />
        </label>

        <label>
          <h4>Post Slug</h4>
          {errors?.slug && <small>Slug is return</small>}
          <input type="text" name='slug' placeholder="Post Slug" />
        </label>

        <label>
          <h4>Post Content</h4>
          {errors?.content && <small>Content is required</small>}
          <textarea rows={10} name='content'placeholder="Content" style={{width: '100%'}}/>
        </label>

        <div style={{ paddingTop: '5px'}}>
          <button>Save Post</button>
        </div>
      </Form>
    </>
  )
}