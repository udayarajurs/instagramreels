import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  Image,
  StatusBar,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import Video from 'react-native-video';
import imagePath from './constants/imagePath';
import {useIsFocused} from '@react-navigation/native';
import {SwiperFlatList} from 'react-native-swiper-flatlist';
import {data} from './constants/data';
import LinearGradient from 'react-native-linear-gradient';
import firestore from '@react-native-firebase/firestore';
import VideoPlay from './VideoPlay';
import auth from '@react-native-firebase/auth';

const {height, width} = Dimensions.get('window');

const Home = ({navigation}) => {
  const isFocused = useIsFocused();
  const videoRef = useRef(null);
  const VIDEO_LIMIT = 2;
  const [userName, setUserName] = useState('');
  const [currIndex, setIndex] = useState(0);
  const [recentVideo, setRecentVideo] = useState([]);
  const [videos, setVideos] = useState([]);
  const userID = auth()?.currentUser?.uid;
  let LoginID = auth()?.currentUser?.uid;
  const [moreVideoAvailable, setMoreVideoAvailable] = useState(true);

  useEffect(() => {
    firestore()
      .collection('user')
      .get()
      .then(querySnapshot => {
        querySnapshot.forEach(doc => {
          setUserName(doc._data.userName);
        });
      })
      .catch(error => {
        console.log('Error getting documents: ', error);
      });

    if (recentVideo.length === 0) {
      const messageRef = firestore()
        .collection('compassreal')
        .orderBy('createdAt')
        .limit(VIDEO_LIMIT);

      const unSubscribe = messageRef.onSnapshot(querySnapshot => {
        const allmsg = querySnapshot.docs.map(docSanp => {
          const data = docSanp.data();
          if (data.createdAt) {
            return {
              ...docSanp.data(),
              createdAt: docSanp.data().createdAt.toDate(),
            };
          } else {
            return {
              ...docSanp.data(),
              createdAt: new Date(),
            };
          }
        });

        let video = [];
        allmsg.forEach(snapshot => {
          video.push(snapshot);
        });

        if (recentVideo.length > 0) {
          const newRecentVideo = [];
          for (let i = 0; i < video.length; i++) {
            if (video[i].sentBy === recentVideo[0].sentBy) {
              break;
            }

            newRecentVideo.push(video[i]);
          }
          setRecentVideo([...newRecentVideo, ...recentVideo]);
        } else {
          setRecentVideo(video);
          if (video.length < 2) {
            setMoreVideoAvailable(false);
          }
        }
      });

      return () => {
        unSubscribe();
      };
    }
  }, [currIndex]);

  const onChatListEndReached = () => {
    if (!moreVideoAvailable) {
      return;
    }
    let startAfterTime;
    if (videos.length > 0) {
      startAfterTime = videos[videos.length - 1].createdAt;
    } else if (recentVideo.length > 0) {
      startAfterTime = recentVideo[recentVideo.length - 1].createdAt;
    } else {
      setMoreVideoAvailable(false);
      return;
    }

    firestore()
      .collection('compassreal')
      .orderBy('createdAt')
      .startAfter(startAfterTime)
      .limit(VIDEO_LIMIT)
      .get()
      .then(querySnapshot => {
        const allmsg = querySnapshot.docs.map(docSanp => {
          const data = docSanp.data();
          if (data.createdAt) {
            return {
              ...docSanp.data(),
              createdAt: docSanp.data().createdAt.toDate(),
            };
          } else {
            return {
              ...docSanp.data(),
              createdAt: new Date(),
            };
          }
        });

        let video = [];
        allmsg.forEach(snapshot => {
          video.push(snapshot);
        });

        if (video.length === 0) {
          setMoreVideoAvailable(false);
        } else {
          setVideos([...videos, ...video]);
        }
      });
  };

  {
    moreVideoAvailable ? '' : console.log('no more video');
  }

  const onChangeIndex = ({index}) => {
    setIndex(index);
  };

  return (
    <View style={{flex: 1, backgroundColor: 'black'}}>
      <StatusBar hidden />

      <SwiperFlatList
        vertical={true}
        data={[...recentVideo, ...videos]}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({item, index}) => (
          <VideoPlay
            item={item}
            index={index}
            recentVideo={recentVideo}
            currIndex={currIndex}
            navigation={navigation}
            LoginID={LoginID}
            userName={userName}
          />
        )}
        onChangeIndex={onChangeIndex}
        onEndReached={onChatListEndReached}
      />

      <View style={{position: 'absolute', top: 20, left: 16}}>
        <Text style={styles.textStyle}>Reels</Text>
      </View>
      {userID ? (
        <View style={{position: 'absolute', top: 20, right: 16}}>
          <TouchableOpacity
            onPress={() => {
              navigation.navigate('AddPost', {
                UserName: userName,
              });
            }}>
            <Image
              style={{width: 25, height: 25, tintColor: 'white'}}
              source={imagePath.icCamera}
            />
          </TouchableOpacity>
        </View>
      ) : (
        <View style={{position: 'absolute', top: 20, right: 16}}>
          <TouchableOpacity
            onPress={() => {
              navigation.navigate('LoginPage');
            }}>
            <Text style={styles.textStyle}>Login</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

export default Home;

const styles = StyleSheet.create({
  backgroundVideo: {
    height: height,
    width: width,
    position: 'absolute',
  },
  flexHorziontal: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  textStyle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
  },
  bootomView: {
    flex: 1,
    justifyContent: 'flex-end',
    paddingVertical: 32,
    paddingHorizontal: 16,
  },
  profileStyle: {
    height: 35,
    width: 35,
    borderRadius: 35 / 2,
  },
});
