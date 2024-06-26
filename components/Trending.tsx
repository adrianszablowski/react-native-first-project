import { icons } from '@/constants';
import { ResizeMode, Video } from 'expo-av';
import React, { useState } from 'react';
import { FlatList, Image, ImageBackground, TouchableOpacity } from 'react-native';
import * as Animatable from 'react-native-animatable';

const zoomIn = {
	0: {
		opacity: 1,
		scale: 0.9,
	},
	1: {
		opacity: 1,
		scale: 1.1,
	},
};

const zoomOut = {
	0: {
		opacity: 1,
		scale: 1.1,
	},
	1: {
		opacity: 1,
		scale: 0.9,
	},
};

const TrendingItem = ({ activeItem, item }: { activeItem: PostType | string; item: PostType }) => {
	const [play, setPlay] = useState(false);
	return (
		<Animatable.View className='mx-5' animation={activeItem === item.$id ? zoomIn : zoomOut} duration={500}>
			{play ? (
				<Video
					source={{ uri: item.video }}
					className='w-52 h-72 rounded-[35px] mt-3 bg-white/10'
					resizeMode={ResizeMode.CONTAIN}
					useNativeControls
					shouldPlay
					onPlaybackStatusUpdate={(playbackStatus: any) => {
						if (playbackStatus.didJustFinish) {
							setPlay(false);
						}
					}}
				/>
			) : (
				<TouchableOpacity
					className='relative justify-center items-center'
					activeOpacity={0.7}
					onPress={() => setPlay(true)}>
					<ImageBackground
						source={{ uri: item.thumbnail }}
						className='w-52 h-72 rounded-[35px] my-5 overflow-hidden shadow-lg shadow-black/40'
						resizeMode='cover'
					/>
					<Image source={icons.play} className='absolute w-12 h-12' resizeMode='contain' />
				</TouchableOpacity>
			)}
		</Animatable.View>
	);
};

const Trending = ({ posts }: { posts: PostType[] }) => {
	const [activeItem, setActiveItem] = useState<PostType | string>(posts[1]);

	const viewableItemsChanged = ({ viewableItems }: { viewableItems: any }) => {
		if (viewableItems.length > 0) {
			setActiveItem(viewableItems[0].key);
		}
	};

	return (
		<FlatList
			data={posts}
			keyExtractor={item => item.$id}
			renderItem={({ item }) => <TrendingItem activeItem={activeItem} item={item} />}
			onViewableItemsChanged={viewableItemsChanged}
			viewabilityConfig={{ itemVisiblePercentThreshold: 70 }}
			contentOffset={{ x: 170, y: 0 }}
			horizontal
		/>
	);
};

export default Trending;
