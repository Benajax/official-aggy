export default {
  name: 'artist',
  title: 'Artist Profile',
  type: 'document',
  fields: [
    { name: 'name', type: 'string', title: 'Artist Name' },
    { name: 'logoText', type: 'string', title: 'Logo Text' },
    { name: 'logoImg', type: 'image', title: 'Logo Image' },
    { 
      name: 'heroVideo', 
      type: 'file', 
      title: 'Default Hero Video', 
      options: { accept: 'video/*' } 
    },
    {
      name: 'heroVideoPool',
      title: 'Hero Video Pool',
      type: 'array',
      of: [
        {
          type: 'object',
          name: 'videoEntry',
          title: 'Video Entry',
          fields: [
            { 
              name: 'videoFile', 
              type: 'file', 
              title: 'Video File', 
              options: { accept: 'video/*' } 
            },
            {
              name: 'fillContainer',
              type: 'boolean',
              title: 'Fill Container?',
              description: 'Check to fill the tile (crops edges). Uncheck for "Ambient Glow" (shows full frame).',
              initialValue: true
            }
          ],
          preview: {
            select: {
              title: 'videoFile.asset.originalFilename',
              fill: 'fillContainer'
            },
            prepare({ title, fill }: any) {
              return {
                title: title || 'Untitled Video',
                subtitle: fill ? 'Layout: Fill' : 'Layout: Ambient Glow'
              }
            }
          }
        }
      ]
    },
    { name: 'spotifyUrl', type: 'url', title: 'Latest Release Link' },
    {
      name: 'bio',
      title: 'Bio',
      type: 'array',
      of: [{type: 'block'}]
    },
  ]
}