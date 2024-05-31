import React from 'react';
import { FlatList, Text } from 'react-native';

const Trending = ({ posts }: { posts: { id: number; user: string }[] }) => {
	return (
		<FlatList
			data={posts}
			keyExtractor={item => item.user}
			renderItem={({ item }) => <Text className='text-3xl text-white'>{item.id}</Text>}
			horizontal
		/>
	);
};

export default Trending;
