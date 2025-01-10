/* eslint-disable react-native/no-inline-styles */
import React, { useEffect, useState } from 'react';
import SplashScreen from 'react-native-splash-screen';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { SafeAreaView, StatusBar } from 'react-native';
import OnboardingScreen from './screens/OnBoarding';
import LoginSignupScreen from './screens/auth/LoginSignup';
import ForgetPasswordScreen from './screens/auth/ForgetPassword';
import MainApp from './screens/mainApp/MainApp';
import Toast from 'react-native-toast-message';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
// import SplashScreen from './screens/auth/SplashScreen';



const Stack = createStackNavigator();

function App() {
  const [splashScreen, setSplashScreen] = useState(true);
  const [isLogedIn, setIsLogedIn] = useState(null);
  const linking = {
    prefixes: ['https://tasteperfect.com', 'tasteperfect://'],
    config: {
      screens: {
        MainApp: '/',
        ChangePassword: 'changepassword/:id',
      },
    },
  };

  const checkLogin = async () => {
    const splashTimeout = () => {
      if (isLogedIn !== null) {
        SplashScreen.hide();
        setSplashScreen(false);
      } else {
        setTimeout(splashTimeout, 500);
      }
    };
    setTimeout(splashTimeout, 1000);
    const JWT = await AsyncStorage.getItem('JWT');
    if (JWT) {
      axios.post('http://192.168.231.252:3000/api/auth/verifyJWT', {
        'type': 'users',
        'token': JWT,
      }).then(response => {
        if (response.status === 200) {
          setIsLogedIn(true);
        } else {
          setIsLogedIn(false);
        }
      }).catch(error => {
        console.log(error);
        setIsLogedIn(false);
      });
    }
    else{
      setIsLogedIn(false);
    }
  };

  useEffect(() => {
    checkLogin();
  });

  return (
    <SafeAreaView style={{ height: '100%', width: '100%' }}>
      <StatusBar
        barStyle="light-content"
        backgroundColor="#f75454"
        translucent={true}
        showHideTransition="fade"
        hidden={false}
      />
      {!splashScreen && <NavigationContainer theme={DefaultTheme} linking={linking}>
        <Stack.Navigator initialRouteName={isLogedIn ? 'MainApp' : 'Onboarding'} screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Onboarding" component={OnboardingScreen} />
          <Stack.Screen name="LoginSignup" component={LoginSignupScreen} />
          <Stack.Screen name="ResetPass" component={ForgetPasswordScreen} />
          <Stack.Screen name="MainApp" component={MainApp} />
        </Stack.Navigator>
      </NavigationContainer>}
      <Toast visibilityTime={3000} position="bottom" text2Style={{ color: 'black' }} />
    </SafeAreaView>
  );
}



export default App;
