import EmptyState from '@/components/EmptyState';
import SearchInput from '@/components/SearchInput';
import VideoCard from '@/components/VideoCard';
import { getAllPosts } from '@/lib/appwrite';
import useAppwrite from '@/lib/useAppwrite';
import React, { useState } from 'react';
import { FlatList, RefreshControl, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const Bookmark = () => {
	// const { user } = useGlobalContext();
	const [refreshing, setRefreshing] = useState<boolean>(false);
	const { data: posts, refetch } = useAppwrite(getAllPosts);
	// const { data: latestPosts } = useAppwrite(getLatestPosts);

	const onRefresh = async () => {
		setRefreshing(true);
		await refetch();
		setRefreshing(false);
	};

	return (
		<SafeAreaView className='bg-primary h-full'>
			<FlatList
				data={posts as PostType[]}
				keyExtractor={item => item.$id}
				renderItem={({ item }) => <VideoCard video={item} />}
				ListHeaderComponent={() => (
					<View className='my-6 px-4 pb-4'>
						<View className='justify-between items-start flex-row mb-6'>
							<Text className='font-psemibold text-2xl text-white'>Saved Videos</Text>
						</View>
						<SearchInput />
					</View>
				)}
				ListEmptyComponent={() => <EmptyState title='No Videos Found' subtitle='Be the first one to upload a video' />}
				refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
			/>
		</SafeAreaView>
	);
};

export default Bookmark;
