import { getCollection } from '../../utils/mongodb';
import type { Ticket } from '../../models/Ticket';

export default defineEventHandler(async (event) => {
  try {
    const collection = await getCollection('tickets');
    const tickets = await collection.find({}).toArray() as Ticket[];
    
    return {
      success: true,
      data: tickets
    };
  } catch (error: any) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Erreur lors de la récupération des tickets',
      message: error.message
    });
  }
});
