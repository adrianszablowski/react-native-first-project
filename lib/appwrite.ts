import { Alert } from 'react-native';
import { Account, Avatars, Client, Databases, ID, ImageGravity, Query, Storage } from 'react-native-appwrite';

export const config = {
	endpoint: 'https://cloud.appwrite.io/v1',
	platform: 'com.asz.aora',
	projectId: '665855ba003949d53127',
	databaseId: '665856f20018a32bae2f',
	userCollectionId: '665857260022dd28fa69',
	videoCollectionId: '66585752000341d2a26f',
	storageId: '6658588a000c41f8fb6c',
};

// Init your React Native SDK
const client = new Client();

client
	.setEndpoint(config.endpoint) // Your Appwrite Endpoint
	.setProject(config.projectId) // Your project ID
	.setPlatform(config.platform); // Your application ID or bundle ID.

const account = new Account(client);
const avatars = new Avatars(client);
const databases = new Databases(client);
const storage = new Storage(client);

// Register User
export const createUser = async (email: string, password: string, username: string) => {
	try {
		const newAccount = await account.create(ID.unique(), email, password, username);

		if (!newAccount) throw Error;

		const avatarUrl = avatars.getInitials(username);

		await signIn(email, password);

		const newUser = await databases.createDocument(config.databaseId, config.userCollectionId, ID.unique(), {
			accountId: newAccount.$id,
			email: email,
			username: username,
			avatar: avatarUrl,
		});

		return newUser;
	} catch (error: any) {
		console.log(error);
		throw new Error(error);
	}
};

export const signIn = async (email: string, password: string) => {
	try {
		const session = await account.createEmailPasswordSession(email, password);

		return session;
	} catch (error: any) {
		console.log(error);
		throw new Error(error);
	}
};

export const getCurrentUser = async () => {
	try {
		const currentAccount = await account.get();

		if (!currentAccount) throw Error;

		const currentUser = await databases.listDocuments(config.databaseId, config.userCollectionId, [
			Query.equal('accountId', currentAccount.$id),
		]);

		if (!currentUser) throw Error;

		return currentUser.documents[0];
	} catch (error: any) {
		console.log(error);
	}
};

export const getAllPosts = async () => {
	try {
		const posts = await databases.listDocuments(config.databaseId, config.videoCollectionId, [
			Query.orderDesc('$createdAt'),
		]);

		return posts.documents;
	} catch (error: any) {
		throw new Error(error);
	}
};

export const getLatestPosts = async () => {
	try {
		const posts = await databases.listDocuments(config.databaseId, config.videoCollectionId, [
			Query.orderDesc('$createdAt'),
			Query.limit(7),
		]);

		return posts.documents;
	} catch (error: any) {
		throw new Error(error);
	}
};

export const searchPosts = async (query: string) => {
	try {
		const posts = await databases.listDocuments(config.databaseId, config.videoCollectionId, [
			Query.search('title', query),
		]);

		return posts.documents;
	} catch (error: any) {
		throw new Error(error);
	}
};

export const getUserPosts = async (userId: string) => {
	try {
		const posts = await databases.listDocuments(config.databaseId, config.videoCollectionId, [
			Query.equal('creator', userId),
			Query.orderDesc('$createdAt'),
		]);

		return posts.documents;
	} catch (error: any) {
		throw new Error(error);
	}
};

export const signOut = async () => {
	try {
		const session = await account.deleteSession('current');

		return session;
	} catch (error: any) {
		throw new Error(error);
	}
};

export const getFilePreview = async (fileId: string, type: 'image' | 'video') => {
	let fileUrl;

	try {
		if (type === 'video') {
			fileUrl = storage.getFileView(config.storageId, fileId);
		} else if (type === 'image') {
			fileUrl = storage.getFilePreview(config.storageId, fileId, 2000, 2000, ImageGravity.Top, 100);
		} else {
			throw new Error('Invalid file type');
		}

		if (!fileUrl) throw Error;

		return fileUrl;
	} catch (error: any) {
		throw new Error(error);
	}
};

export const uploadFile = async (file: any, type: 'image' | 'video') => {
	if (!file) return;

	const asset = { name: file.fileName, type: file.mimeType, size: file.fileSize, uri: file.uri };

	try {
		const uploadedFile = await storage.createFile(config.storageId, ID.unique(), asset);

		const fileUrl = await getFilePreview(uploadedFile.$id, type);

		return fileUrl;
	} catch (error: any) {
		throw new Error(error);
	}
};

export const createVideo = async (form: {
	title: string;
	video: { uri: string };
	thumbnail: { uri: string };
	prompt: string;
	userId: string;
}) => {
	try {
		const [thumbnailUrl, videoUrl] = await Promise.all([
			uploadFile(form.thumbnail, 'image'),
			uploadFile(form.video, 'video'),
		]);

		const newPost = await databases.createDocument(config.databaseId, config.videoCollectionId, ID.unique(), {
			title: form.title,
			video: videoUrl,
			thumbnail: thumbnailUrl,
			prompt: form.prompt,
			creator: form.userId,
		});

		return newPost;
	} catch (error: any) {
		throw new Error(error);
	}
};

export const savePost = async (userId: string | undefined, postId: string) => {
	try {
		if (!userId) throw Error;

		const post = await databases.getDocument(config.databaseId, config.videoCollectionId, postId);

		if (!post) throw Error;

		await databases.updateDocument(config.databaseId, config.videoCollectionId, postId, {
			likes: [...post.likes, userId],
		});
	} catch (error: any) {
		throw new Error(error);
	}
};

export const getSavedPosts = async (userId: string | undefined) => {
	try {
		if (!userId) throw Error;

		const posts = await databases.listDocuments(config.databaseId, config.videoCollectionId, [
			Query.orderDesc('$createdAt'),
		]);

		const filteredPostsByUserId = posts.documents.filter((post: any) => {
			return post.likes.some((like: any) => {
				return like.$id === userId;
			});
		});

		return filteredPostsByUserId;
	} catch (error: any) {
		throw new Error(error);
	}
};
