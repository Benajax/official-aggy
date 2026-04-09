export default {
  name: 'artist',
  title: 'Artist Profile',
  type: 'document',
  fields: [
    { name: 'name', type: 'string', title: 'Artist Name' },
    // Keep the original for fallback
    { name: 'heroVideo', type: 'file', title: 'Default Hero Video', options: { accept: 'video/*' } },
    // Add the pool
    {
      name: 'heroVideoPool',
      title: 'Hero Video Pool',
      type: 'array',
      of: [{ type: 'file', options: { accept: 'video/*' } }]
    },
    { name: 'spotifyUrl', type: 'url', title: 'Latest Release Link' },
    {
      name: 'bio',
      title: 'Bio',
      type: 'array',
      of: [{type: 'block'}] // Allows him to use bold/italics
    },
  ]
}