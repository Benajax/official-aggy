import { type SchemaTypeDefinition } from 'sanity'
import { artistType } from './artist'
import { tourDateType } from './tourDate'
import { socialPostType } from './socialPost'

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [artistType, tourDateType, socialPostType],
}