import { prisma } from '../../config/prisma';

export const searchService = {
  searchHotels: async (query: string) => {
    // Task 7: Using PostgreSQL Full-Text Search with raw SQL to utilize GIN index and tsvector
    // This allows us to use the specific Postgres features requested
    const hotels = await prisma.$queryRaw`
      SELECT * FROM "Hotel"
      WHERE 
        to_tsvector('english', "name" || ' ' || COALESCE("description", '')) 
        @@ plainto_tsquery('english', ${query})
    `;
    return hotels;
  },
};
