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
import imagePath from './src/constants/imagePath';
import {SwiperFlatList} from 'react-native-swiper-flatlist';
import {data} from './src/constants/data';
import LinearGradient from 'react-native-linear-gradient';

const {height, width} = Dimensions.get('window');

const Home = () => {
  const videoRef = useRef(null);
  const [currIndex, setIndex] = useState(0);

  const onBuffer = e => {
    console.log('buffering....', e);
  };

  const onError = e => {
    console.log('error raised', e);
  };

  useEffect(() => {
    if (!videoRef.current) {
      videoRef.current.seek(0);
    }
  }, [currIndex]);

  const renderItem = ({item, index}) => {
    return (
      <View style={{flex: 1, height: height}}>
        <Video
          source={{
            uri: item.url,
          }}
          poster={item.thumb}
          posterResizeMode="cover"
          ref={videoRef}
          resizeMode="cover"
          onBuffer={onBuffer}
          onError={onError}
          paused={currIndex !== index}
          repeat
          style={styles.backgroundVideo}
        />
        <LinearGradient
          colors={['rgba(0,0,0,0.1)', 'rgba(0,0,0,0.6)']}
          style={styles.bootomView}>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <Image
              source={{
                uri: 'https://firebasestorage.googleapis.com/v0/b/memory-352617.appspot.com/o/images.jpg?alt=media&token=946ade41-2527-44e0-9892-40f6a4c199ac',
              }}
              style={styles.profileStyle}
            />
            <Text style={{marginHorizontal: 8, color: 'white'}}>
              Udaya raj urs
            </Text>
            <TouchableOpacity>
              <Text style={{color: 'white', fontWeight: 'bold'}}>Follow</Text>
            </TouchableOpacity>
          </View>
          <View style={{flexDirection: 'row', marginTop: 8}}>
            <Text numberOfLines={1} style={{flex: 1, color: 'white'}}>
              {item.description}
            </Text>
            <TouchableOpacity>
              <Text style={{color: 'white', fontWeight: 'bold'}}>more</Text>
            </TouchableOpacity>
          </View>

          <View style={{...styles.flexHorziontal, marginVertical: 8}}>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <Image
                style={{
                  width: 20,
                  height: 20,
                  tintColor: 'white',
                  marginHorizontal: 10,
                }}
                source={imagePath.icLike}
              />
              <Image
                style={{
                  width: 20,
                  height: 20,
                  tintColor: 'white',
                  marginHorizontal: 10,
                }}
                source={imagePath.icComment}
              />
              <Image
                style={{
                  width: 20,
                  height: 20,
                  tintColor: 'white',
                  marginHorizontal: 10,
                }}
                source={imagePath.icShare}
              />
            </View>

            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <Image
                style={{
                  width: 15,
                  height: 15,
                  tintColor: 'white',
                  marginTop: 10,
                }}
                source={imagePath.icView}
              />
              <Text style={{marginLeft: 4, color: 'white', marginTop: 10}}>
                16.6k
              </Text>
            </View>
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
        data={data}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
        onChangeIndex={onChangeIndex}
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
