import { getCurrentUser } from '@/lib/appwrite';
import { ReactNode, createContext, useContext, useEffect, useState } from 'react';

interface GlobalContextType {
	isLoggedIn: boolean;
	setIsLoggedIn: React.Dispatch<React.SetStateAction<boolean>>;
	user: UserType | null | undefined;
	setUser: React.Dispatch<React.SetStateAction<UserType | null | undefined>>;
	isLoading: boolean;
}

const GlobalContext = createContext<GlobalContextType | null>(null);

const GlobalProvider = ({ children }: { children: ReactNode }) => {
	const [isLoggedIn, setIsLoggedIn] = useState(false);
	const [user, setUser] = useState<UserType | null | undefined>(null);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		const fetchUser = async () => {
			try {
				const user = await getCurrentUser();

				if (!user) {
					setIsLoggedIn(false);
					setUser(null);
				} else {
					setIsLoggedIn(true);
					setUser(user as UserType);
				}
			} catch (error: any) {
				console.log(error);
			} finally {
				setIsLoading(false);
			}
		};

		fetchUser();

		// OR

		// getCurrentUser()
		// 	.then(res => {
		// 		if (res) {
		// 			setIsLoggedIn(true);
		// 			setUser(res);
		// 		} else {
		// 			setIsLoggedIn(false);
		// 			setUser(null);
		// 		}
		// 	})
		// 	.catch((error: any) => {
		// 		console.log(error);
		// 	})
		// 	.finally(() => {
		// 		setIsLoading(false);
		// 	});
	}, []);

	return (
		<GlobalContext.Provider value={{ isLoggedIn, setIsLoggedIn, user, setUser, isLoading }}>
			{children}
		</GlobalContext.Provider>
	);
};

export default GlobalProvider;

export const useGlobalContext = () => {
	const context = useContext(GlobalContext);
	if (!context) {
		throw new Error('useGlobalContext must be used within a GlobalProvider');
	}
	return context;
};
