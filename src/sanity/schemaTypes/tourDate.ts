// src/sanity/schemaTypes/tourDate.ts
export const tourDateType = {
  name: 'tourDate',
  title: 'Tour Date',
  type: 'document',
  fields: [
    { name: 'city', title: 'City', type: 'string' },
    { name: 'venue', title: 'Venue', type: 'string' },
    { name: 'date', title: 'Date', type: 'datetime' },
    { name: 'ticketUrl', title: 'Ticket URL', type: 'url' },
  ],
}