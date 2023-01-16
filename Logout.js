import { Button, View, Text } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { firebase } from './firebase';

export function LogoutButton({ navigation }) {
    const auth = firebase.auth();

    const handleLogout = async () => {
        try {
            await auth.signOut();
            await AsyncStorage.removeItem('user');
            navigation.navigate('Login');
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <View style={[{flex: 1, alignItems: 'center', justifyContent: 'center'}]}>
            <Button
                title="Logout"
                onPress={handleLogout}
            />
        </View>

    );
};
