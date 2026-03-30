// src/sanity/structure.ts
import type {StructureResolver} from 'sanity/structure'

// https://www.sanity.io/docs/structure-builder-introduction
export const structure: StructureResolver = (S) =>
  S.list()
    .title('Content')
    .items([
      // This line automatically shows every type you added to index.ts
      ...S.documentTypeListItems(), 
    ])