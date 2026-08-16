import type { BlogPost } from './blogPosts'

const modules = import.meta.glob('./posts/*.md', {
  eager: true,
  query: '?raw',
  import: 'default'
})

function parseFrontmatter(raw: string): { data: Record<string, string>, content: string } {
  const match = raw.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/)
  if (!match) return { data: {}, content: raw }
  const data: Record<string, string> = {}
  match[1].split('\n').forEach(line => {
    const [key, ...rest] = line.split(':')
    if (key && rest.length) data[key.trim()] = rest.join(':').trim()
  })
  return { data, content: match[2].trim() }
}

export const markdownPosts: BlogPost[] = Object.entries(modules).map(([, raw]) => {
  const { data, content } = parseFrontmatter(raw as string)
  return {
    id: data.id,
    title: data.title,
    excerpt: data.excerpt,
    category: data.category,
    date: data.date,
    image: data.image,
    imageAlt: data.imageAlt,
    content
  }
})