import * as React from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';
import { NavigationContainer, useRoute } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AddScreen from './AddScreen';
import ViewScreen from './ViewScreen';
import EditScreen from './EditScreen';
import ProductScreen from './ProductScreen';
import Login from './Login';
import { LogoutButton } from './Logout';

const EditStack = createNativeStackNavigator();

function EditStackScreen() {
  const route = useRoute();

  return (
    <EditStack.Navigator screenOptions={[route.name === 'Product' ? false : true,]}>
      <EditStack.Screen name="Your products" component={EditScreen} />
      <EditStack.Screen name="Product" component={ProductScreen} />
    </EditStack.Navigator>
  );
}

function ViewStackScreen() {
  const route = useRoute();

  return (
    <EditStack.Navigator screenOptions={[route.name === 'Products' ? false : true,]}>
      <EditStack.Screen name="View all products" component={ViewScreen} />
      <EditStack.Screen name="Products" component={ProductScreen} options={{headerRight: () => console.log('nothing')}} />
    </EditStack.Navigator>
  );
}


const Tab = createBottomTabNavigator();

function TabStackScreen() {
  return (
    <Tab.Navigator>
      <Tab.Screen name="View products" component={ViewStackScreen} options={{ headerShown: false }}/>
      <Tab.Screen name="Add product" component={AddScreen} />
      <Tab.Screen name='Edit product' component={EditStackScreen} options={{ headerShown: false }} />
      <Tab.Screen name='Logout' component={LogoutButton} />
    </Tab.Navigator>
  );

}

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{headerShown: false}}>
        <Stack.Screen name='Login' component={Login} />
        <Stack.Screen name='Home' component={TabStackScreen}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
