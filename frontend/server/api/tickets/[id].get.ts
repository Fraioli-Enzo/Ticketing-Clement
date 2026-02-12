import { ObjectId } from 'mongodb';
import { getCollection } from '../../utils/mongodb';
import type { Ticket } from '../../models/Ticket';

export default defineEventHandler(async (event) => {
  try {
    const id = getRouterParam(event, 'id');
    
    if (!id || !ObjectId.isValid(id)) {
      throw createError({
        statusCode: 400,
        statusMessage: 'ID invalide'
      });
    }

    const collection = await getCollection('tickets');
    const ticket = await collection.findOne({ _id: new ObjectId(id) }) as Ticket | null;
    
    if (!ticket) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Ticket non trouvé'
      });
    }

    return {
      success: true,
      data: ticket
    };
  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.statusMessage || 'Erreur lors de la récupération du ticket',
      message: error.message
    });
  }
});
