import { ObjectId } from 'mongodb';
import { getCollection } from '../../utils/mongodb';
import type { UpdateTicketInput } from '../../models/Ticket';

export default defineEventHandler(async (event) => {
  try {
    const id = getRouterParam(event, 'id');
    
    if (!id || !ObjectId.isValid(id)) {
      throw createError({
        statusCode: 400,
        statusMessage: 'ID invalide'
      });
    }

    const body = await readBody<UpdateTicketInput>(event);
    const collection = await getCollection('tickets');

    const updateData: any = {
      ...body,
      updatedAt: new Date()
    };

    const result = await collection.findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: updateData },
      { returnDocument: 'after' }
    );

    if (!result) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Ticket non trouvé'
      });
    }

    return {
      success: true,
      data: result
    };
  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.statusMessage || 'Erreur lors de la mise à jour du ticket',
      message: error.message
    });
  }
});
