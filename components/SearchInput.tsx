import { icons } from '@/constants';
import React from 'react';
import { Image, Text, TextInput, TouchableOpacity, View } from 'react-native';

const SearchInput = ({
	value,
	placeholder,
	handleChangeText,
	otherStyles,
	keybordType,
	...props
}: {
	value: string;
	placeholder?: string;
	handleChangeText: any;
	keybordType?: string;
	otherStyles: string;
}) => {
	return (
		<View className='w-full h-16 px-4 bg-black-100 border-2 border-black-200 rounded-2xl focus:border-secondary items-center flex-row space-x-4'>
			<TextInput
				className='text-base mt-0.5 text-white flex-1 font-pregular'
				value={value}
				placeholder={placeholder}
				placeholderTextColor='#7b7b8b'
				onChangeText={handleChangeText}
			/>
			<TouchableOpacity onPress={() => {}}>
				<Image source={icons.search} className='w-5 h-5' resizeMode='contain' />
			</TouchableOpacity>
		</View>
	);
};

export default SearchInput;
