export default {
  name: 'artist',
  title: 'Artist Profile',
  type: 'document',
  fields: [
    { name: 'name', type: 'string', title: 'Artist Name' },
    { name: 'heroVideo', type: 'url', title: 'Hero Loop Video URL' },
    { name: 'spotifyUrl', type: 'url', title: 'Latest Release Link' },
    {
      name: 'bio',
      title: 'Bio',
      type: 'array', 
      of: [{type: 'block'}] // Allows him to use bold/italics
    },
  ]
}