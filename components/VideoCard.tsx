import { icons } from '@/constants';
import { useGlobalContext } from '@/context/GlobalProvider';
import { removeSavedPost, savePost } from '@/lib/appwrite';
import { ResizeMode, Video } from 'expo-av';
import React, { useState } from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';

const VideoCard = ({ video, isBookmark = false }: { video: PostType; isBookmark?: boolean }) => {
	const { user } = useGlobalContext();
	const [play, setPlay] = useState(false);
	const [saved, setSaved] = useState(isBookmark ? true : false);

	const handleSavePost = async () => {
		if (!saved) {
			setSaved(!saved);
			await savePost(user?.$id, video.$id);
		} else {
			setSaved(!saved);
			await removeSavedPost(user?.$id, video.$id);
		}
	};

	return (
		<View className='flex-col items-center px-4 mb-14'>
			<View className='flex-row gap-3 items-center'>
				<View className='justify-center items-center flex-row flex-1'>
					<View className='w-[46px] h-[46px] rounded-lg border border-secondary justify-center items-center p-0.5'>
						<Image source={{ uri: video.creator.avatar }} className='w-full h-full rounded-lg' resizeMode='cover' />
					</View>
					<View className='justify-center flex-1 ml-3 gap-y-1'>
						<Text className='text-white font-psemibold text-sm' numberOfLines={1}>
							{video.title}
						</Text>
						<Text className='text-xs text-gray-100 font-pregular'>{video.creator.username}</Text>
					</View>
				</View>
				<View className='pt-2'>
					<TouchableOpacity className='items-center' onPress={handleSavePost}>
						{saved ? (
							<Image source={icons.bookmark} className='h-5 w-5' tintColor='#FFA001' resizeMode='contain' />
						) : (
							<Image source={icons.bookmark} className='h-5 w-5' resizeMode='contain' />
						)}
					</TouchableOpacity>
				</View>
			</View>
			{play ? (
				<Video
					source={{ uri: video.video }}
					className='w-full h-60 rounded-xl mt-3'
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
					activeOpacity={0.7}
					onPress={() => setPlay(true)}
					className='w-full h-60 rounded-xl mt-3 relative justify-center items-center'>
					<Image source={{ uri: video.thumbnail }} className='w-full h-full rounded-xl mt-3' resizeMode='cover' />
					<Image source={icons.play} className='absolute w-12 h-12' resizeMode='contain' />
				</TouchableOpacity>
			)}
		</View>
	);
};

export default VideoCard;
