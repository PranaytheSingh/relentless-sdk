# Relentless JavaScript SDK

Official JavaScript SDK for [Relentless CMS](https://relentless.so) - Turn your Notion databases into powerful REST APIs.

## Installation

```bash
npm install relentless-sdk
# or
pnpm add relentless-sdk
# or
yarn add relentless-sdk
```

## Quick Start

```javascript
import { createClient } from 'relentless-sdk'

const blog = createClient({
  username: 'johndoe',  // Your Relentless username
  apiPath: 'blog'       // The API path you configured
})

// Get all posts
const posts = await blog.list()

// Get a single post by slug
const post = await blog.getBySlug('hello-world')

// Get database schema
const schema = await blog.getSchema()
```

## Configuration

Create a client by providing your username and API path:

```javascript
const client = createClient({
  username: 'johndoe',         // Your Relentless username (see Settings)
  apiPath: 'blog',             // The API path you configured
  baseUrl: 'https://api.relentless.so' // Optional, defaults to production
})
```

**Finding your username:** Go to your [Relentless dashboard](https://relentless.so/settings) → Settings. Your username is displayed under "Account" (e.g., `@johndoe`).

**Note:** This SDK uses the public API endpoints which do not require authentication.

## API Methods

### `list()`

Get all items from your API.

```javascript
const items = await client.list()
// Returns: [{ slug: 'post-1', title: 'Post 1', content: '...', ... }]
```

**Returns:** `Promise<RelentlessItem[]>`

### `getBySlug(slug)`

Get a single item by its slug.

```javascript
const post = await client.getBySlug('hello-world')
// Returns: { slug: 'hello-world', title: 'Hello World', content: '...', ... }
```

**Parameters:**
- `slug` (string): The item's slug

**Returns:** `Promise<RelentlessItem>`

### `index(format)`

Get an index of all items (slug, title, and URL only). Useful for generating sitemaps or navigation.

```javascript
// Get index as array (default)
const index = await client.index()
// Returns: [{ slug: 'post-1', title: 'Post 1', url: '...' }, ...]

// Get index as object (keyed by slug)
const indexObj = await client.index('object')
// Returns: { 'post-1': { title: 'Post 1', url: '...' }, ... }
```

**Parameters:**
- `format` (optional): `'array'` (default) or `'object'`

**Returns:** `Promise<RelentlessIndexItem[]>` or `Promise<Record<string, Omit<RelentlessIndexItem, 'slug'>>>`

### `batch(slugs)`

Fetch multiple items by their slugs in parallel.

```javascript
const posts = await client.batch(['post-1', 'post-2', 'post-3'])
// Returns: [{ slug: 'post-1', ... }, { slug: 'post-2', ... }, { slug: 'post-3', ... }]
```

**Parameters:**
- `slugs` (string[]): Array of slugs to fetch

**Returns:** `Promise<RelentlessItem[]>` (same order as input)

### `getSchema()`

Get the database schema (field names and types).

```javascript
const schema = await client.getSchema()
// Returns: { Title: 'title', Content: 'rich_text', PublishedAt: 'date', ... }
```

**Returns:** `Promise<Record<string, any>>`

## TypeScript Support

The SDK is written in TypeScript and includes full type definitions.

```typescript
import { createClient, RelentlessItem, RelentlessConfig } from 'relentless-sdk'

const config: RelentlessConfig = {
  username: 'johndoe',
  apiPath: 'blog'
}

const client = createClient(config)
const posts: RelentlessItem[] = await client.list()
```

## Error Handling

The SDK throws `RelentlessError` for failed requests:

```javascript
import { RelentlessError } from 'relentless-sdk'

try {
  const post = await client.getBySlug('non-existent')
} catch (error) {
  if (error instanceof RelentlessError) {
    console.error('API Error:', error.message)
    console.error('Status:', error.status)
    console.error('Response:', error.response)
  }
}
```

## Usage Examples

### Next.js App Router

```typescript
// app/blog/page.tsx
import { createClient } from 'relentless-sdk'

const blog = createClient({
  username: process.env.RELENTLESS_USERNAME!,
  apiPath: 'blog'
})

export default async function BlogPage() {
  const posts = await blog.list()

  return (
    <div>
      {posts.map(post => (
        <article key={post.slug}>
          <h2>{post.title}</h2>
          <div dangerouslySetInnerHTML={{ __html: post.content }} />
        </article>
      ))}
    </div>
  )
}
```

### React with useEffect

```javascript
import { createClient } from 'relentless-sdk'
import { useState, useEffect } from 'react'

const blog = createClient({
  username: import.meta.env.VITE_RELENTLESS_USERNAME,
  apiPath: 'blog'
})

function BlogList() {
  const [posts, setPosts] = useState([])

  useEffect(() => {
    blog.list().then(setPosts)
  }, [])

  return (
    <div>
      {posts.map(post => (
        <article key={post.slug}>
          <h2>{post.title}</h2>
        </article>
      ))}
    </div>
  )
}
```

### Node.js Script

```javascript
import { createClient } from 'relentless-sdk'

const products = createClient({
  username: process.env.RELENTLESS_USERNAME,
  apiPath: 'products'
})

async function generateSitemap() {
  const index = await products.index()

  const urls = index.map(item => ({
    url: `https://example.com/${item.slug}`,
    title: item.title
  }))

  console.log('Sitemap URLs:', urls)
}

generateSitemap()
```

## License

MIT

## Support

- Documentation: [docs.relentless.so](https://docs.relentless.so)
- Issues: [GitHub Issues](https://github.com/pranay/relentless-js/issues)
- Website: [relentless.so](https://relentless.so)
