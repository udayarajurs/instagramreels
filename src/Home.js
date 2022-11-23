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
  const VIDEO_LIMIT = 1;
  const [currIndex, setIndex] = useState(0);
  const [recentVideo, setRecentVideo] = useState([]);
  const [videos, setVideos] = useState([]);
  const [moreVideoAvailable, setMoreVideoAvailable] = useState(true);

  const onBuffer = e => {
    console.log('buffering....', e);
  };

  const onError = e => {
    console.log('error raised', e);
  };

  useEffect(() => {
    // firestore()
    //   .collection('compassreal')
    //   .where('PostID', '==', 'Post123456C')
    //   .get()
    //   .then(querySnapshot => {
    //     querySnapshot.forEach(doc => {
    //       console.log(doc.id);
    //     });
    //   })
    //   .catch(error => {
    //     console.log('Error getting documents: ', error);
    //   });

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
              <TouchableOpacity
                onPress={() => {
                  firestore()
                    .collection('compassreal')
                    .where('PostID', '==', item.PostID)
                    .get()
                    .then(querySnapshot => {
                      querySnapshot.forEach(doc => {
                        firestore()
                          .collection('compassreal')
                          .doc(doc.id)
                          .collection('Likes')
                          .get()
                          .then(querySnapshot => {
                            if (querySnapshot.size > 0) {
                              querySnapshot.forEach(doc => {
                                if (doc._data.userID === '123456B') {
                                  console.log('like delete');
                                  doc.ref
                                    .delete()
                                    .then(() => {
                                      console.log(
                                        'Document successfully deleted!',
                                      );
                                    })
                                    .catch(function (error) {
                                      console.error(
                                        'Error removing document: ',
                                        error,
                                      );
                                    });
                                } else {
                                  console.log('Add like');
                                  firestore()
                                    .collection('compassreal')
                                    .where('PostID', '==', item.PostID)
                                    .get()
                                    .then(querySnapshot => {
                                      querySnapshot.forEach(doc => {
                                        firestore()
                                          .collection('compassreal')
                                          .doc(doc.id)
                                          .collection('Likes')
                                          .add({
                                            name: 'Udaya raj urs G',
                                            userID: '123456B',
                                            PostID: item.PostID,
                                            CreateAt: new Date(),
                                          });
                                      });
                                    })
                                    .catch(error => {
                                      console.log(
                                        'Error getting documents: ',
                                        error,
                                      );
                                    });
                                }
                              });
                            } else {
                              console.log('first like add');
                              firestore()
                                .collection('compassreal')
                                .where('PostID', '==', item.PostID)
                                .get()
                                .then(querySnapshot => {
                                  querySnapshot.forEach(doc => {
                                    firestore()
                                      .collection('compassreal')
                                      .doc(doc.id)
                                      .collection('Likes')
                                      .add({
                                        name: 'Udaya raj urs G',
                                        userID: '123456B',
                                        PostID: item.PostID,
                                        CreateAt: new Date(),
                                      });
                                  });
                                })
                                .catch(error => {
                                  console.log(
                                    'Error getting documents: ',
                                    error,
                                  );
                                });
                            }
                          });
                      });
                    })
                    .catch(error => {
                      console.log('Error getting documents: ', error);
                    });
                }}>
                <Image
                  style={{
                    width: 25,
                    height: 25,
                    tintColor: 'white',

                    marginVertical: 15,
                  }}
                  source={imagePath.icLike}
                />
                <Text style={{color: '#FFF'}}>{item.LikeCount}</Text>
              </TouchableOpacity>

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
        data={[...recentVideo, ...videos]}
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