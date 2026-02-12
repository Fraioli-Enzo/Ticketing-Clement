import { ObjectId } from 'mongodb';
import { getCollection } from '../../utils/mongodb';

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
    const result = await collection.deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Ticket non trouvé'
      });
    }

    return {
      success: true,
      message: 'Ticket supprimé avec succès'
    };
  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.statusMessage || 'Erreur lors de la suppression du ticket',
      message: error.message
    });
  }
});
