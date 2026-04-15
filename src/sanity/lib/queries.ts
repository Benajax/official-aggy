// src/sanity/lib/queries.ts
import { defineQuery } from 'next-sanity'

export const ARTIST_DATA_QUERY = defineQuery(`
  {
    "artist": *[_type == "artist"][0] {
      name,
      logoText,
      description, // Added this field
      bio,         // Added this field
      "logoImg": logoImg.asset->url,
      "heroVideo": heroVideo.asset->url,
      "heroVideoPool": heroVideoPool[] {
        "url": videoFile.asset->url,
        "fillContainer": fillContainer
      }
    },
    "tourDates": *[_type == "tourDate"] | order(date asc) { _id, city, venue, date, ticketUrl },
    "socials": *[_type == "socialPost"] | order(_createdAt desc) [0...3] { _id, "mediaUrl": image.asset->url, platform, url }
  }
`)