import path from 'path';
import fs from 'fs/promises';
import fm from 'front-matter';
import { marked } from 'marked';

export type Post = {
	content: string,
	id: number,
	slug: string,
	title: string
}

export type NewPost = {
	content: string,
	slug: string,
	title: string
}

type PostMarkdownAttributes = {
	title: string
}

type PostMarkdown = {
	attributes: PostMarkdownAttributes,
	body: string
}

function isValidPostAttributes (attributes: any): attributes is PostMarkdownAttributes {
	return attributes.title;
}

const postPath = path.join(__dirname, '..', 'posts');

export const getPosts = async () => {
  const files = await fs.readdir(postPath);

	return Promise.all(files.map(async filename => {
		const file = await fs.readFile(path.join(postPath, filename), 'utf-8');
		const { attributes } : PostMarkdown = fm(file.toString());

		if(!isValidPostAttributes) {
			throw new Error('Invalid post attributes');
		}

		return {
			slug: filename.replace('.md', ''),
			title: attributes.title
		}
	}));
}

export const getPost = async (slug: string) => {
	const file = await fs.readFile(path.join(postPath, `${slug}.md`), 'utf-8');
	const {attributes, body} : PostMarkdown = fm(file.toString());

	if(!isValidPostAttributes) {
		throw new Error('Invalid post attributes');
	}

	return {
		content: marked(body),
		slug,
		title: attributes.title
	}
}

export const createPost = async (post: NewPost) => {
	const markdown: string = `---
title: ${post.title}
---

${post.content}
	`;

	await fs.writeFile(
		path.join(postPath, `${post.slug}.md`),
		markdown
	);

	return getPost(post.slug);
}