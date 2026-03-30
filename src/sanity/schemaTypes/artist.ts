// src/sanity/schemaTypes/artist.ts

export const artistType = {
  name: 'artist',
  title: 'Artist',
  type: 'document',
  fields: [
    {
      name: 'name',
      title: 'Artist Name',
      type: 'string',
    },
    {
      name: 'heroVideo',
      title: 'Hero Video',
      type: 'file',
      options: {
        accept: 'video/mp4',
      },
    },
    {
      name: 'logoImg',
      title: 'Logo Image',
      type: 'image',
      options: { hotspot: true },
    },
    {
      name: 'logoText',
      title: 'Logo Text',
      type: 'string',
    },
  ],
}