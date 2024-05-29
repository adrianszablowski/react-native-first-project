import { Link } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { Text, View } from 'react-native';

const Index = () => {
	return (
		<View className='flex-1 items-center justify-center'>
			<Text className='font-pbold'>Aora!</Text>
			<StatusBar style='auto' />
			<Link href='/home' style={{ color: 'blue' }}>
				Go to home
			</Link>
		</View>
	);
};

export default Index;
