// src/sanity/schemaTypes/socialPost.ts
export const socialPostType = {
  name: 'socialPost',
  title: 'Social Post',
  type: 'document',
  fields: [
    {
      name: 'image',
      title: 'Post Image',
      type: 'image',
      options: { hotspot: true }, // Allows you to crop the perfect square
    },
    {
      name: 'platform',
      title: 'Platform',
      type: 'string',
      options: {
        list: ['Instagram', 'TikTok', 'Snapchat', 'X'],
      },
    },
    {
      name: 'url',
      title: 'Link to Post',
      type: 'url',
    },
    {
      name: 'caption',
      title: 'Short Caption',
      type: 'string',
    },
  ],
}