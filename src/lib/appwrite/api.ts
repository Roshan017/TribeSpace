/* eslint-disable @typescript-eslint/no-explicit-any */
import { INewPost, INewUser, IUpdatePost, IUpdateUser } from "@/types";
import { account, appwriteConfig, avatar, database, storage } from "./config";
import { ID } from "appwrite";
import { Query } from "appwrite";

export async function createUserAcc(user: INewUser) {
  console.log("Creating user with data:", user);
  try {
    // Use email as userId (email is unique and preferred for Appwrite)
    const newAccount = await account.create(
      ID.unique(), // Email used as the userId
      user.email, // Email address of the user
      user.password, //Password
      user.name
    );
    if (!newAccount) {
      throw new Error("User account creation failed");
    }

    const avatarUrl = avatar.getInitials(user.name);
    console.log(avatarUrl);

    const newUser = await saveUsertoDB({
      Acc_id: newAccount.$id,
      name: newAccount.name,
      email: newAccount.email,
      username: user.username,
      image_url: avatarUrl,
    });

    return newUser;
  } catch (error) {
    console.error("Error creating user account:", error);
    throw error; // Re-throw error for handling in the calling function
  }
}
export async function saveUsertoDB(user: {
  Acc_id: string;
  email: string;
  name: string;
  image_url: URL;
  username?: string;
}) {
  try {
    const newUser = await database.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.collection_UsersId,
      ID.unique(),
      user
    );
    return newUser;
  } catch (e) {
    console.error("Error saving user to database:", e);
  }
}

export async function signInAccount(user: { email: string; password: string }) {
  try {
    try {
      await account.deleteSession("current");
    } catch (e) {
      console.error("Error deleting session:", e);
    }
    // Check if a session is already active
    const currentSession = await account.get();
    if (currentSession) {
      console.log("User already signed in:", currentSession);
      return currentSession; // Already logged in
    }
  } catch (err) {
    console.error("Error checking current session:", err);
  }

  try {
    const session = await account.createEmailSession(user.email, user.password);
    return session;
  } catch (e: unknown) {
    console.error("Error signing in:", e);
    // ✅ Throw error to handle in React Query onError
    throw new Error((e as Error)?.message || "Invalid credentials");
  }
}

export async function getAccount() {
  try {
    const currentAccount = await account.get();

    return currentAccount;
  } catch (error) {
    console.log(error);
  }
}
export async function getCurrentUSer() {
  try {
    const currentAcc = await getAccount();
    if (!currentAcc) {
      throw new Error("No user is currently logged in.");
    }
    const currentUser = await database.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.collection_UsersId,
      [Query.equal("Acc_id", currentAcc.$id)]
    );
    if (!currentUser) {
      throw new Error("No user found in the database.");
    }
    return currentUser.documents[0];
  } catch (e) {
    console.error("Error getting current user:", e);
  }
}
export async function signOutAccount() {
  try {
    const session = await account.deleteSession("current");
    return session;
  } catch (e) {
    console.error("Error signing out:", e);
  }
}
export async function createPost(post: INewPost) {
  try {
    // Upload file to appwrite storage
    const uploadedFile = await uploadFile(post.file[0]);

    if (!uploadedFile) throw Error;

    // Get file url
    const fileUrl = getFilePreview(uploadedFile.$id);
    if (!fileUrl) {
      await deleteFile(uploadedFile.$id);
      throw Error;
    }

    // Convert tags into array
    const tags = post.tags?.replace(/ /g, "").split(",") || [];

    // Create post
    const newPost = await database.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.collection_PostsId,
      ID.unique(),
      {
        creator: post.userId,
        caption: post.caption,
        imageUrl: fileUrl,
        imageId: uploadedFile.$id,
        location: post.location,
        tags: tags,
      }
    );

    if (!newPost) {
      await deleteFile(uploadedFile.$id);
      throw Error;
    }

    return newPost;
  } catch (error) {
    console.log(error);
  }
}

// ============================== UPLOAD FILE
export async function uploadFile(file: File) {
  try {
    const uploadedFile = await storage.createFile(
      appwriteConfig.storageId,
      ID.unique(),
      file
    );

    return uploadedFile;
  } catch (error) {
    console.log(error);
  }
}

// ============================== GET FILE URL
export function getFilePreview(fileId: string) {
  try {
    const fileUrl = storage.getFileView(appwriteConfig.storageId, fileId);

    if (!fileUrl) throw Error;

    return fileUrl;
  } catch (error) {
    console.log(error);
  }
}

// ============================== DELETE FILE
export async function deleteFile(fileId: string) {
  try {
    await storage.deleteFile(appwriteConfig.storageId, fileId);
    //console.log("Deleted From Storage");
    return { status: "ok" };
  } catch (error) {
    console.log(error);
  }
}
export async function getRecentPosts() {
  try {
    const posts = await database.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.collection_PostsId,
      [Query.orderDesc("$createdAt"), Query.limit(20)]
    );

    if (!posts) throw Error;

    return posts;
  } catch (error) {
    console.log(error);
  }
}
export async function LikePost(postId: string, likesArray: string[]) {
  try {
    const updatedPost = await database.updateDocument(
      appwriteConfig.databaseId,
      appwriteConfig.collection_PostsId,
      postId,
      {
        likes: likesArray,
      }
    );
    if (!updatedPost) {
      console.log("Error Updating Post");
    }
    return updatedPost;
  } catch (e) {
    console.log(e);
  }
}
export async function savePost(userId: string, postId: string) {
  try {
    const updatedPost = await database.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.collection_SavesId,
      ID.unique(),

      {
        user: userId,
        post: postId,
      }
    );

    if (!updatedPost) throw Error;
    return updatedPost;
  } catch (error) {
    console.log(error);
  }
}
export async function deleteSavedPost(savedRecordId: string) {
  //console.log(savedRecordId);
  try {
    const status = await database.deleteDocument(
      appwriteConfig.databaseId,
      appwriteConfig.collection_SavesId,
      savedRecordId
    );
    if (!status) {
      console.log("Error Unsaving Post");
    }
    return { status: "Ok" };
  } catch (error) {
    console.log(error);
  }
}
export async function GetPostById(postId: string) {
  try {
    const post = await database.getDocument(
      appwriteConfig.databaseId,
      appwriteConfig.collection_PostsId,
      postId
    );
    if (!post) {
      console.log("Error Fetching Post");
    }
    return post;
  } catch (e) {
    console.log(e);
  }
}
export async function updatePost(post: IUpdatePost) {
  const hasFileToUpdate = post.file.length > 0;

  try {
    let image = {
      imageUrl: post.imageUrl,
      imageId: post.imageId,
    };

    if (hasFileToUpdate) {
      const uploadedFile = await uploadFile(post.file[0]);
      if (!uploadedFile) throw Error;
      const fileUrl = getFilePreview(uploadedFile.$id);
      if (!fileUrl) {
        await deleteFile(uploadedFile.$id);
        throw Error;
      }
      image = { ...image, imageUrl: fileUrl, imageId: uploadedFile.$id };
    }
    const tags = post.tags?.replace(/ /g, "").split(",") || [];
    const UpdatedPost = await database.updateDocument(
      appwriteConfig.databaseId,
      appwriteConfig.collection_PostsId,
      post.postId,
      {
        caption: post.caption,
        imageUrl: image.imageUrl,
        imageId: image.imageId,
        location: post.location,
        tags: tags,
      }
    );
    if (!UpdatedPost) {
      await deleteFile(post.imageId);
      throw Error;
    }

    // Get file url

    // Convert tags into array

    // Create post

    return UpdatedPost;
  } catch (error) {
    console.log(error);
  }
}

export async function deletePost(postId: string, imageId: string) {
  if (!postId || !imageId) throw new Error("Missing postId or imageId");

  try {
    // Step 1: Find saved documents related to the post
    const savedDocs = await database.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.collection_SavesId,
      [Query.equal("post", postId)]
    );

    // Step 2: Delete each related saved document
    for (const doc of savedDocs.documents) {
      await database.deleteDocument(
        appwriteConfig.databaseId,
        appwriteConfig.collection_SavesId,
        doc.$id
      );
    }

    // Step 3: Delete the post itself
    await database.deleteDocument(
      appwriteConfig.databaseId,
      appwriteConfig.collection_PostsId,
      postId
    );

    // Step 4: Delete the image from storage
    deleteFile(imageId);
    return { status: "ok" };
  } catch (e) {
    console.error("Error deleting post:", e);
  }
}

export async function getInfinitePosts({ pageParam }: { pageParam: number }) {
  const queries: any[] = [Query.orderDesc("$updatedAt"), Query.limit(9)];

  if (pageParam) {
    queries.push(Query.cursorAfter(pageParam.toString()));
  }
  try {
    const posts = await database.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.collection_PostsId,
      queries
    );
    if (!posts) {
      console.log("Error Fetching Posts");
    }
    return posts;
  } catch (e) {
    console.log(e);
  }
}
export async function SearchPosts(SearchTerm: string) {
  try {
    const post = await database.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.collection_PostsId,
      [Query.search("tags", SearchTerm)]
    );
    if (!post) {
      console.log("Error Fetching Posts");
    }
    return post;
  } catch (e) {
    console.log(e);
  }
}
export async function GetUsers(limit?: number) {
  const queries: string[] = [Query.orderDesc("$createdAt")];

  if (limit) {
    queries.push(Query.limit(limit));
  }
  try {
    const users = await database.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.collection_UsersId,
      queries
    );
    if (!users) {
      console.log("Error Fetching Users");
    }
    return users;
  } catch (e) {
    console.log(e);
  }
}
export async function getUserById(userId: string) {
  try {
    const user = await database.getDocument(
      appwriteConfig.databaseId,
      appwriteConfig.collection_UsersId,
      userId
    );
    if (!user) {
      console.log("Error Fetching User");
    }
    return user;
  } catch (e) {
    console.log(e);
  }
}

export async function updateUser(user: IUpdateUser) {
  const hasFileToUpdate = user.file.length > 0;
  console.log(user);
  try {
    let image = {
      imageUrl: user.imageUrl,
      imageId: user.imageId,
    };
    if (hasFileToUpdate) {
      const uploadedFile = await uploadFile(user.file[0]);
      if (!uploadedFile) {
        console.log("No File Uploaded");
      }
      if (!uploadedFile?.$id) {
        throw new Error("Uploaded file ID is undefined");
      }
      const fileUrl = getFilePreview(uploadedFile.$id);
      if (!fileUrl) {
        await deleteFile(uploadedFile.$id);
        throw Error;
      }
      image = { ...image, imageUrl: fileUrl, imageId: uploadedFile.$id };
    }
    const updatedUser = await database.updateDocument(
      appwriteConfig.databaseId,
      appwriteConfig.collection_UsersId,
      user.userId,
      {
        name: user.name,
        bio: user.bio,
        image_url: image.imageUrl,
        image_id: image.imageId,
      }
    );
    if (!updatedUser) {
      if (hasFileToUpdate) {
        await deleteFile(image.imageId);
      }
      throw Error;
    }
    if (user.imageId && hasFileToUpdate) {
      await deleteFile(user.imageId);
    }
    return updatedUser;
  } catch (e) {
    console.log(e);
  }
}
export async function getUserPosts(userId?: string) {
  if (!userId) return;

  try {
    const post = await database.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.collection_PostsId,
      [Query.equal("creator", userId), Query.orderDesc("$createdAt")]
    );
    if (!post) throw Error;

    return post;
  } catch (e) {
    console.log(e);
  }
}
