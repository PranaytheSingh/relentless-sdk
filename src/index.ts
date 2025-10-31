/**
 * Relentless CMS JavaScript SDK
 * Official client for consuming Notion-powered APIs
 */

export interface RelentlessConfig {
  /** Your API key from Relentless dashboard */
  apiKey: string
  /** The API path/name (e.g., 'blog', 'products') */
  apiPath: string
  /** Base URL of the Relentless API (defaults to production) */
  baseUrl?: string
}

export interface RelentlessItem {
  slug: string
  title: string
  content: string
  [key: string]: any
}

export interface RelentlessIndexItem {
  slug: string
  title: string
  url: string
}

export class RelentlessError extends Error {
  constructor(
    message: string,
    public status?: number,
    public response?: any
  ) {
    super(message)
    this.name = 'RelentlessError'
  }
}

/**
 * Relentless API Client
 */
export class RelentlessClient {
  private apiKey: string
  private apiPath: string
  private baseUrl: string

  constructor(config: RelentlessConfig) {
    this.apiKey = config.apiKey
    this.apiPath = config.apiPath
    this.baseUrl = config.baseUrl || 'https://api.relentless.so'
  }

  /**
   * Build full URL with API key
   */
  private buildUrl(path: string, params?: Record<string, string>): string {
    const url = new URL(`${this.baseUrl}/api/v1/${this.apiPath}${path}`)
    url.searchParams.set('api_key', this.apiKey)

    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        url.searchParams.set(key, value)
      })
    }

    return url.toString()
  }

  /**
   * Make HTTP request with error handling
   */
  private async request<T>(url: string): Promise<T> {
    try {
      const response = await fetch(url)

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new RelentlessError(
          (errorData as any).message || `Request failed with status ${response.status}`,
          response.status,
          errorData
        )
      }

      return await response.json() as T
    } catch (error) {
      if (error instanceof RelentlessError) {
        throw error
      }
      throw new RelentlessError(
        error instanceof Error ? error.message : 'Unknown error occurred'
      )
    }
  }

  /**
   * Get all items from the API
   * @returns Array of all items
   * @example
   * const posts = await client.list()
   * console.log(posts) // [{ slug: 'hello', title: 'Hello World', content: '...' }]
   */
  async list(): Promise<RelentlessItem[]> {
    return this.request<RelentlessItem[]>(this.buildUrl(''))
  }

  /**
   * Get a single item by slug
   * @param slug - The item's slug
   * @returns Single item
   * @example
   * const post = await client.getBySlug('hello-world')
   * console.log(post.title) // 'Hello World'
   */
  async getBySlug(slug: string): Promise<RelentlessItem> {
    return this.request<RelentlessItem>(this.buildUrl(`/${slug}`))
  }

  /**
   * Get index of all items (slug, title, and URL only)
   * Useful for generating sitemaps or navigation
   * @param format - 'array' (default) or 'object' for slug-keyed object
   * @returns Array or object of index items
   * @example
   * const index = await client.index()
   * console.log(index) // [{ slug: 'hello', title: 'Hello World', url: '...' }]
   *
   * const indexObj = await client.index('object')
   * console.log(indexObj['hello']) // { title: 'Hello World', url: '...' }
   */
  async index(format: 'array' | 'object' = 'array'): Promise<RelentlessIndexItem[] | Record<string, Omit<RelentlessIndexItem, 'slug'>>> {
    return this.request(this.buildUrl('/index', { format }))
  }

  /**
   * Get multiple items by slugs (batch fetch)
   * This is a convenience method that makes parallel requests
   * @param slugs - Array of slugs to fetch
   * @returns Array of items (same order as input)
   * @example
   * const posts = await client.batch(['post-1', 'post-2', 'post-3'])
   */
  async batch(slugs: string[]): Promise<RelentlessItem[]> {
    const promises = slugs.map(slug => this.getBySlug(slug))
    return Promise.all(promises)
  }
}

/**
 * Create a new Relentless client instance
 * @param config - Configuration object with apiKey and apiPath
 * @returns Client instance with list, getBySlug, index, and batch methods
 * @example
 * import { createClient } from 'relentless-sdk'
 *
 * const blog = createClient({
 *   apiKey: 'your-api-key',
 *   apiPath: 'blog'
 * })
 *
 * const posts = await blog.list()
 * const post = await blog.getBySlug('hello-world')
 */
export function createClient(config: RelentlessConfig): RelentlessClient {
  return new RelentlessClient(config)
}

// Default export for convenience
export default createClient
