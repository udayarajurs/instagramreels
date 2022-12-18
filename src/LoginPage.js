import React, {Component, useState} from 'react';
import {
  Text,
  StyleSheet,
  View,
  TextInput,
  Image,
  ToastAndroid,
  TouchableOpacity,
} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';

const LoginPage = ({navigation}) => {
  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const [NewAcc, setNewAcc] = useState(false);
  const [userID, setUserID] = useState('');

  return (
    <View style={{alignSelf: 'center'}}>
      <View>
        <View style={{alignSelf: 'center'}}>
          <Image
            style={{width: 100, height: 100, marginTop: 80}}
            source={require('./assets/images/inst.png')}
          />
        </View>
        <TextInput
          style={{
            marginTop: 55,
            paddingHorizontal: 100,
            borderWidth: 1,
            borderColor: '#000',
          }}
          onChangeText={data => {
            setUserName(data);
          }}
          value={userName}
          placeholder="Enter your G-mail ID"
        />
      </View>
      <View>
        <TextInput
          style={{
            paddingHorizontal: 130,
            borderWidth: 1,
            borderColor: '#000',
            marginTop: 25,
          }}
          onChangeText={data => setPassword(data)}
          value={password}
          placeholder="Password"
        />
      </View>

      <View>
        {NewAcc ? (
          <View>
            <TouchableOpacity
              style={{
                alignSelf: 'center',
                marginTop: 50,
                backgroundColor: '#0000FF',
              }}
              onPress={() => {
                auth()
                  .createUserWithEmailAndPassword(userName, password)
                  .then(() => {
                    firestore().collection('user').add({
                      createdAt: new Date(),
                      userName: userName,
                      userID: auth().currentUser.uid,
                    });
                    navigation.navigate('Home');
                    ToastAndroid.showWithGravity(
                      'User account created & signed in!',
                      ToastAndroid.SHORT,
                      ToastAndroid.CENTER,
                    );
                  })
                  .catch(error => {
                    if (error.code === 'auth/email-already-in-use') {
                      ToastAndroid.showWithGravity(
                        'That email address is already in use!',
                        ToastAndroid.SHORT,
                        ToastAndroid.CENTER,
                      );
                    }

                    if (error.code === 'auth/invalid-email') {
                      ToastAndroid.showWithGravity(
                        'That email address is invalid!',
                        ToastAndroid.SHORT,
                        ToastAndroid.CENTER,
                      );
                    }

                    console.error(error);
                  });
              }}>
              <Text
                style={{
                  color: '#FFF',
                  marginHorizontal: 100,
                  marginVertical: 10,
                }}>
                Submit
              </Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View>
            <TouchableOpacity
              style={{
                alignSelf: 'center',
                marginTop: 50,
                backgroundColor: '#0000FF',
              }}
              onPress={() => {
                auth()
                  .signInWithEmailAndPassword(userName, password)
                  .then(() => {
                    navigation.navigate('Home');
                    ToastAndroid.showWithGravity(
                      'signed in!',
                      ToastAndroid.SHORT,
                      ToastAndroid.CENTER,
                    );
                  })
                  .catch(error => {
                    ToastAndroid.showWithGravity(
                      'That email address or Password is invalid!',
                      ToastAndroid.SHORT,
                      ToastAndroid.CENTER,
                    );

                    console.error(error);
                  });
              }}>
              <Text
                style={{
                  color: '#FFF',
                  marginHorizontal: 100,
                  marginVertical: 10,
                }}>
                Login
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      <View>
        <TouchableOpacity
          onPress={() => {
            NewAcc ? setNewAcc(false) : setNewAcc(true);
          }}
          style={{alignSelf: 'center', marginTop: 25}}>
          <Text>{NewAcc ? 'I Have Account' : 'I Dont Have Account'}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default LoginPage;

const styles = StyleSheet.create({});
