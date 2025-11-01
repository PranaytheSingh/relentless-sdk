# Changelog

All notable changes to the Relentless JavaScript SDK will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.2.0] - 2025-11-01

### ⚠️ BREAKING CHANGES

- **Username parameter now required**: The SDK now requires a `username` parameter in the config. This change aligns with Relentless CMS's new user namespacing feature that prevents API path collisions between users.

### Changed

- **Updated API URL structure**: API calls now use the format `/api/v1/public/{username}/{apiPath}` instead of `/api/v1/public/{apiPath}`
- **Updated `RelentlessConfig` interface**: Added required `username: string` field
- **Updated all documentation**: All code examples now include the `username` parameter

### Migration Guide

**Before (v0.1.x):**
```javascript
const client = createClient({
  apiKey: 'your-api-key',
  apiPath: 'blog'
})
```

**After (v0.2.0):**
```javascript
const client = createClient({
  apiKey: 'your-api-key',
  username: 'johndoe',  // Get this from Relentless Settings
  apiPath: 'blog'
})
```

**Finding your username:**
1. Go to [Relentless Settings](https://relentless.so/settings)
2. Look for your username under "Account" (e.g., `@johndoe`)
3. Use the username without the `@` prefix in the SDK config

### Why this change?

This breaking change was necessary to support Relentless CMS's new multi-tenancy model. Previously, API paths were globally unique, which could cause conflicts when multiple users wanted the same path name (e.g., "blog" or "products"). With username namespacing:

- ✅ Each user has their own namespace
- ✅ Users can choose any API path without conflicts
- ✅ API URLs are more organized: `/api/v1/public/johndoe/blog` vs `/api/v1/public/janesmith/blog`

---

## [0.1.1] - 2024-10-31

### Added
- Initial TypeScript support
- Full type definitions export

### Fixed
- Build configuration improvements
- Type definition paths

## [0.1.0] - 2024-10-31

### Added
- Initial release of Relentless JavaScript SDK
- `list()` - Get all items
- `getBySlug(slug)` - Get single item by slug
- `index(format)` - Get index of all items (array or object format)
- `batch(slugs)` - Fetch multiple items in parallel
- `insert(row)` - Insert new row into Notion database
- Full TypeScript support with type definitions
- Error handling with `RelentlessError`
- Support for both ESM and CommonJS

[0.2.0]: https://github.com/PranaytheSingh/relentless-sdk/compare/v0.1.1...v0.2.0
[0.1.1]: https://github.com/PranaytheSingh/relentless-sdk/compare/v0.1.0...v0.1.1
[0.1.0]: https://github.com/PranaytheSingh/relentless-sdk/releases/tag/v0.1.0
