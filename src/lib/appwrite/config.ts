import { Client, Account, Databases, Storage, Avatars } from "appwrite";

export const appwriteConfig = {
  projectId: import.meta.env.VITE_APPWRITEID,
  url: import.meta.env.VITE_APPWRITEURL,
  databaseId: import.meta.env.VITE_APPWRITE_DB_ID,
  storageId: import.meta.env.VITE_APPWRITE_STORAGE_ID,
  collection_SavesId: import.meta.env.VITE_APPWRITE_DB_SAVES_ID,
  collection_PostsId: import.meta.env.VITE_APPWRITE_DB_POSTS_ID,
  collection_UsersId: import.meta.env.VITE_APPWRITE_DB_USERS_ID,
};
export const client = new Client();
client.setProject(appwriteConfig.projectId);
client.setEndpoint(appwriteConfig.url);
export const account = new Account(client);
export const database = new Databases(client);
export const storage = new Storage(client);
export const avatar = new Avatars(client);
