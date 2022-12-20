import React, {useState, useEffect, useRef} from 'react';
import {View, Text, TouchableOpacity, TextInput} from 'react-native';
import ImagePicker from 'react-native-image-crop-picker';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import storage from '@react-native-firebase/storage';

const AddPost = ({navigation, route}) => {
  const {UserName} = route.params;
  const [userID, setUserID] = useState(auth()?.currentUser?.uid);
  const [profilePic, setProfilePic] = useState('');
  const [des, setDes] = useState('');
  const [videoLink, setVideoLink] = useState('');
  const [ThubLine, setThubLine] = useState('');
  const [uploading, setUploading] = useState(true);
  const [transferred, setTransferred] = useState(0);

  const onSend = async () => {
    const storageRef = storage().ref().child(`/Video/${Date.now()}`);
    const imageRef = storage().ref().child(`/Image/${Date.now()}`);

    const uploadTask = storageRef.putFile(videoLink);
    const uploadTaskImage = imageRef.putFile(ThubLine);

    uploadTask.on(
      'state_changed',
      snapshot => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
      },
      error => {
        // Handle unsuccessful uploads
      },
      () => {
        storageRef.getDownloadURL().then(downloadURL => {
          uploadTaskImage.on(
            'state_changed',
            snapshot => {
              const progress =
                (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            },
            error => {
              // Handle unsuccessful uploads
            },
            () => {
              imageRef.getDownloadURL().then(downloadURLImage => {
                const Reels = {
                  createdAt: new Date(),
                  userName: UserName,
                  userID: userID,
                  profilePic: profilePic,
                  des: des,
                  videoLink: downloadURL,
                  ThubLine: downloadURLImage,
                  LikeCount: 0,
                  PostID: userID + new Date(),
                };
                console.log(Reels);
                firestore()
                  .collection('compassreal')
                  .add({...Reels})
                  .then(() => {
                    navigation.goBack();
                  });
              });
            },
          );
        });
      },
    );
  };

  const AddVideo = () => {
    ImagePicker.openPicker({
      mediaType: 'video',
    }).then(video => {
      setVideoLink(video.path);
    });
  };

  const AddImage = () => {
    ImagePicker.openPicker({
      mediaType: 'photo',
    }).then(photo => {
      setThubLine(photo.path);
    });
  };

  return (
    <View>
      <View>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={{padding: 15, marginStart: 10, color: '#000'}}>
            Back
          </Text>
        </TouchableOpacity>
      </View>

      <View>
        <TextInput
          style={{
            paddingHorizontal: 130,
            marginTop: 25,
          }}
          onChangeText={data => setDes(data)}
          value={des}
          multiline
          placeholder="Enter your comment"
        />
      </View>

      <View>
        <Text style={{marginHorizontal: 15, marginTop: 25}}>{videoLink}</Text>
      </View>

      <View>
        <Text style={{marginHorizontal: 15, marginTop: 25}}>{ThubLine}</Text>
      </View>

      <TouchableOpacity
        onPress={() => {
          AddVideo();
        }}
        style={{
          backgroundColor: '#0000FF',
          marginTop: 250,
          marginHorizontal: 100,
          borderRadius: 15,
        }}>
        <Text style={{color: '#fff', padding: 15, alignSelf: 'center'}}>
          Add Video
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => {
          AddImage();
        }}
        style={{
          backgroundColor: '#0000FF',
          marginTop: 25,
          marginHorizontal: 100,
          borderRadius: 15,
        }}>
        <Text style={{color: '#fff', padding: 15, alignSelf: 'center'}}>
          Add ThubLine
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => {
          onSend();
        }}
        style={{
          backgroundColor: '#0000FF',
          marginTop: 25,
          marginHorizontal: 100,
          borderRadius: 15,
        }}>
        <Text style={{color: '#fff', padding: 15, alignSelf: 'center'}}>
          Add Post
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default AddPost;
