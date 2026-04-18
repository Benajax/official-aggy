import { defineType, defineField } from 'sanity'

export const artistType = defineType({
  name: 'artist',
  title: 'Artist Profile',
  type: 'document',
  fields: [
    defineField({ name: 'name', type: 'string', title: 'Artist Name' }),
    defineField({ name: 'logoText', type: 'string', title: 'Logo Text' }),
    defineField({ 
      name: 'description', 
      type: 'text', 
      title: 'Artist Description',
      description: 'A short description used for SEO and social media previews.'
    }),
    defineField({ name: 'logoImg', type: 'image', title: 'Logo Image' }),
    
    // --- NEW BANNER FIELD ---
    defineField({ 
      name: 'bannerImg', 
      type: 'image', 
      title: 'Banner Image',
      options: { hotspot: true } // This allows you to center the "Aggy" text in Sanity
    }),

    defineField({
      name: 'heroVideoPool',
      title: 'Hero Video Pool',
      type: 'array',
      of: [
        {
          type: 'object',
          name: 'videoEntry',
          title: 'Video Entry',
          fields: [
            defineField({
              name: 'fillContainer',
              type: 'boolean',
              title: 'Fill Container?',
              description: 'ON = Fill/Crop. OFF = Full frame with glow.',
              initialValue: true,
            }),
            defineField({ 
              name: 'videoFile', 
              type: 'file', 
              title: 'Video File', 
              options: { accept: 'video/*' } 
            }),
          ],
          preview: {
            select: {
              title: 'videoFile.asset.originalFilename',
              fill: 'fillContainer'
            },
            prepare({ title, fill }: any) {
              return {
                title: title || 'New Video',
                subtitle: fill ? 'Layout: Fill' : 'Layout: Ambient Glow'
              }
            }
          }
        }
      ]
    }),
    defineField({ name: 'spotifyUrl', type: 'url', title: 'Latest Release Link' }),
    defineField({
      name: 'bio',
      title: 'Bio',
      type: 'array',
      of: [{type: 'block'}]
    }),
  ]
})