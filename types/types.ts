type PostType = {
	$collectionId: string;
	$createdAt: string;
	$databaseId: string;
	$id: string;
	$permissions: [];
	$updatedAt: string;
	creator: CreatorType;
	prompt: string;
	thumbnail: string;
	title: string;
	video: string;
};

type CreatorType = {
	$collectionId: string;
	$createdAt: string;
	$databaseId: string;
	$id: string;
	$permissions: [];
	$updatedAt: string;
	accoundId: string;
	avatar: string;
	email: string;
	username: string;
};

type ViewableType = { index: number; isViewable: boolean; item: []; key: string };

type UserType = {
	$collectionId: string;
	$createdAt: string;
	$databaseId: string;
	$id: string;
	$permissions: [];
	$updatedAt: string;
	accountId: string;
	avatar: string;
	email: string;
	username: string;
};
