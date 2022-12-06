import React from 'react';
import {View, Text} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Home from './src/Home';
import VideoCompress from './src/VideoCompress';
import Comment_Screen from './src/Comment_Screen';
import AddPost from './src/AddPost';
import AudioPage from './src/AudioPage';

const Stack = createNativeStackNavigator();

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="AudioPage"
          component={AudioPage}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="Home"
          component={Home}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="AddPost"
          component={AddPost}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="VideoCompress"
          component={VideoCompress}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="Comment_Screen"
          component={Comment_Screen}
          options={{
            headerShown: false,
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
