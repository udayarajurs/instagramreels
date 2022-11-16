import React, {useState, useEffect, useRef} from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
import firestore from '@react-native-firebase/firestore';

const AddPost = () => {
  const [userID, setUserID] = useState('userID');
  const [userName, setUserName] = useState('Udaya raj');
  const [creatAt, setCreatAt] = useState('98729');
  const [profilePic, setProfilePic] = useState('jdlaksdl');
  const [des, setDes] = useState('aksjdhkjsadh');
  const [videoLink, setVideoLink] = useState('');
  const [comment, setComment] = useState('');
  const [shre, setShare] = useState('s');
  const [ThubLine, setThubLine] = useState('asd');

  const onSend = () => {
    const Reels = {
      createdAt: new Date(),
      userName: userName,
      userID: userID,
      profilePic: profilePic,
      des: des,
      videoLink: videoLink,
      ThubLine: ThubLine,
    };
    console.log(Reels);

    firestore()
      .collection('compassreal')
      .add({...Reels});
  };

  return (
    <View>
      <TouchableOpacity
        onPress={() => onSend()}
        style={{
          backgroundColor: '#0000FF',
          marginTop: 250,
          marginHorizontal: 100,
          borderRadius: 15,
        }}>
        <Text style={{color: '#fff', padding: 15, alignSelf: 'center'}}>
          Add rell
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default AddPost;
