import { Account, Avatars, Client, Databases, ID, Query } from 'react-native-appwrite';

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
		const posts = await databases.listDocuments(config.databaseId, config.videoCollectionId);

		return posts.documents;
	} catch (error: any) {
		throw new Error(error);
	}
};
