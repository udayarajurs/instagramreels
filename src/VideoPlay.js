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

const VideoPlay = ({
  navigation,
  item,
  index,
  recentVideo,
  currIndex,
  LoginID,
}) => {
  const videoRef = useRef(null);
  const [isLike, setLike] = useState(false);
  const [likeCounts, setLikeCounts] = useState(0);
  const [DocId, setDocID] = useState('');
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
                querySnapshot.forEach(docLikeID => {
                  console.log('useefft');
                  setLikeCounts(querySnapshot.size);
                  if (docLikeID._data.userID === LoginID) {
                    setLike(true);
                  } else {
                    setLike(false);
                  }
                });
              }
            });
        });
      })
      .catch(error => {
        console.log('Error getting documents: ', error);
      });
  }, [currIndex]);

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
                {
                  isLike
                    ? (setLikeCounts(likeCounts - 1), setLike(false))
                    : (setLikeCounts(likeCounts + 1), setLike(true));
                }
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
                            querySnapshot.forEach(docLikeID => {
                              if (docLikeID._data.userID === LoginID) {
                                console.log('like delete', doc.id);

                                docLikeID.ref
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
                                          userID: LoginID,
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
                                      userID: LoginID,
                                      PostID: item.PostID,
                                      CreateAt: new Date(),
                                    });
                                });
                              })
                              .catch(error => {
                                console.log('Error getting documents: ', error);
                              });
                          }
                        });
                    });
                  })
                  .catch(error => {
                    console.log('Error getting documents: ', error);
                  });
              }}>
              {isLike ? (
                <View>
                  <Image
                    style={{
                      width: 25,
                      height: 25,
                      tintColor: 'red',
                      marginVertical: 15,
                    }}
                    source={imagePath.icLike}
                  />
                </View>
              ) : (
                <View>
                  <Image
                    style={{
                      width: 25,
                      height: 25,
                      tintColor: 'white',
                      marginVertical: 15,
                    }}
                    source={imagePath.icLike}
                  />
                </View>
              )}

              <Text style={{color: '#FFF', marginStart: 7, fontWeight: 'bold'}}>
                {likeCounts}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => {
                navigation.navigate('Comment_Screen', {
                  name: item.userName,
                  des: item.des,
                  ProfilePic: item.profilePic,
                  PostID: item.PostID,
                  LoginID: LoginID,
                });
              }}>
              <Image
                style={{
                  width: 25,
                  height: 25,
                  tintColor: 'white',
                  marginVertical: 15,
                }}
                source={imagePath.icComment}
              />
            </TouchableOpacity>

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

export default VideoPlay;

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
