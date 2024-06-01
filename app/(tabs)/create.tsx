import FormField from '@/components/FormField';
import React, { useState } from 'react';
import { ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const Create = () => {
	const [uploading, setUploading] = useState(false);
	const [form, setForm] = useState({
		title: '',
		video: null,
		thumbnail: null,
		prompt: '',
	});

	return (
		<SafeAreaView className='bg-primary h-full'>
			<ScrollView className='px-4 my-6'>
				<Text className='text-2xl text-white font-psemibold'>Upload Video</Text>
				<FormField title='Video Title' value={form.title} handleChangeText={() => {}} />
			</ScrollView>
		</SafeAreaView>
	);
};

export default Create;
