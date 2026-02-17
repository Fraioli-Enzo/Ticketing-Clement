import { MongoClient } from 'mongodb';

let client: MongoClient | null = null;

export async function connectToDatabase() {
  if (client) {
    return client;
  }

  const config = useRuntimeConfig();
  const uri = config.mongodbUri;
  // const uri = 'mongodb://82.112.240.32:27017';
  
  client = new MongoClient(uri);
  
  try {
    await client.connect();
    console.log('✅ Connecté à MongoDB');
    return client;
  } catch (error) {
    console.error('❌ Erreur de connexion à MongoDB:', error);
    throw error;
  }
}

export async function getDatabase(dbName: string = 'ticketing') {
  const client = await connectToDatabase();
  return client.db(dbName);
}

export async function getCollection(collectionName: string, dbName: string = 'ticketing') {
  const db = await getDatabase(dbName);
  return db.collection(collectionName);
}
