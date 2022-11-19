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
import {SwiperFlatList} from 'react-native-swiper-flatlist';
import {data} from './constants/data';
import LinearGradient from 'react-native-linear-gradient';
import firestore from '@react-native-firebase/firestore';

const {height, width} = Dimensions.get('window');

const Home = () => {
  const videoRef = useRef(null);
  const VIDEO_LIMIT = 2;
  const [currIndex, setIndex] = useState(0);
  const [recentVideo, setRecentVideo] = useState([]);
  const [messages, setMessages] = useState([]);
  const [moreVideoAvailable, setMoreVideoAvailable] = useState(true);

  const onBuffer = e => {
    console.log('buffering....', e);
  };

  const onError = e => {
    console.log('error raised', e);
  };

  useEffect(() => {
    if (!videoRef.current && recentVideo.length > 0) {
      videoRef.current.seek(0);
    }

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
    console.log('call');
    if (!moreVideoAvailable) {
      return;
    }
    let startAfterTime;
    if (messages.length > 0) {
      startAfterTime = messages[messages.length - 1].createdAt;
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
          setMessages([...messages, ...video]);
        }
      });
  };

  console.log(recentVideo.length, messages.length);
  {
    moreVideoAvailable ? '' : console.log('no more video');
  }

  const renderItem = ({item, index}) => {
    return (
      <View style={{flex: 1, height: height}}>
        <Video
          source={{
            uri: item.videoLink,
          }}
          poster={item.ThubLine}
          posterResizeMode="cover"
          ref={videoRef}
          resizeMode="cover"
          onBuffer={onBuffer}
          onError={onError}
          //paused={currIndex !== index}
          paused={true}
          repeat
          style={styles.backgroundVideo}
        />
        <LinearGradient
          colors={['rgba(0,0,0,0.1)', 'rgba(0,0,0,0.6)']}
          style={styles.bootomView}>
          <View
            style={{
              ...styles.flexHorziontal,
              marginVertical: 8,
              marginBottom: 75,
            }}>
            <View style={{position: 'absolute', right: 0}}>
              <Image
                style={{
                  width: 25,
                  height: 25,
                  tintColor: 'white',

                  marginVertical: 15,
                }}
                source={imagePath.icLike}
              />
              <Image
                style={{
                  width: 25,
                  height: 25,
                  tintColor: 'white',

                  marginVertical: 15,
                }}
                source={imagePath.icComment}
              />
              <Image
                style={{
                  width: 25,
                  height: 25,
                  tintColor: 'white',

                  marginVertical: 15,
                }}
                source={imagePath.icShare}
              />
            </View>
          </View>

          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <Image
              source={{
                uri: item.profilePic,
              }}
              style={styles.profileStyle}
            />
            <Text style={{marginHorizontal: 8, color: 'white'}}>
              {item.userName}
            </Text>
            <TouchableOpacity>
              <Text style={{color: 'white', fontWeight: 'bold'}}>Follow</Text>
            </TouchableOpacity>
          </View>
          <View style={{flexDirection: 'row', marginTop: 8}}>
            <Text numberOfLines={1} style={{flex: 1, color: 'white'}}>
              {item.des}
            </Text>
            <TouchableOpacity>
              <Text style={{color: 'white', fontWeight: 'bold'}}>more</Text>
            </TouchableOpacity>
          </View>
        </LinearGradient>
      </View>
    );
  };

  const onChangeIndex = ({index}) => {
    setIndex(index);
  };

  return (
    <View style={{flex: 1, backgroundColor: 'black'}}>
      <StatusBar hidden />

      <SwiperFlatList
        vertical={true}
        data={[...recentVideo, ...messages]}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
        onChangeIndex={onChangeIndex}
        onEndReached={onChatListEndReached}
      />

      <View style={{position: 'absolute', top: 20, left: 16}}>
        <Text style={styles.textStyle}>Reels</Text>
      </View>
      <View style={{position: 'absolute', top: 20, right: 16}}>
        <Image
          style={{width: 25, height: 25, tintColor: 'white'}}
          source={imagePath.icCamera}
        />
      </View>
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
