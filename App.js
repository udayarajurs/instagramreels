import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  FlatList,
  Image,
  StatusBar,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import React, {useRef} from 'react';
import Video from 'react-native-video';
import imagePath from './src/constants/imagePath';
import {SwiperFlatList} from 'react-native-swiper-flatlist';
import {data} from './src/constants/data';

const {height, width} = Dimensions.get('window');

const App = () => {
  const videoRef = useRef(null);

  const onBuffer = e => {
    console.log('buffering....', e);
  };

  const onError = e => {
    console.log('error raised', e);
  };

  const renderItem = () => {
    return (
      <View style={{flex: 1}}>
        <Video
          source={{
            uri: 'https://firebasestorage.googleapis.com/v0/b/sconti-e7f3a.appspot.com/o/campusreels%2F%23nadiya%20%23river%20%23songs%20%23song%23hindi%20%23hindisong%20%23nature%20%23naturelovers%20%23mountains%20%23valley%20%23reels%20%23hills.mp4?alt=media&token=adec9231-d02d-41ea-821a-3d3017716baf',
          }}
          poster="https://firebasestorage.googleapis.com/v0/b/sconti-e7f3a.appspot.com/o/campusreels%2Fwp2337141.jpg?alt=media&token=703f4391-38ee-4635-8eb1-5b62a8ca0c60"
          posterResizeMode="cover"
          ref={videoRef}
          resizeMode="cover"
          onBuffer={onBuffer}
          onError={onError}
          paused={true}
          repeat
          style={styles.backgroundVideo}
        />
      </View>
    );
  };

  return (
    <View style={{flex: 1, backgroundColor: 'pink'}}>
      <StatusBar barStyle="light-content" />

      <FlatList
        data={data}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
      />

      <SafeAreaView style={{margin: 16}}>
        <View style={styles.flexHorziontal}>
          <Text style={styles.textStyle}>Reels</Text>
          <Image
            style={{width: 25, height: 25, tintColor: 'white'}}
            source={imagePath.icCamera}
          />
        </View>
      </SafeAreaView>
      {/* 
      <View style={styles.bootomView}>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <Image
            source={{
              uri: 'https://firebasestorage.googleapis.com/v0/b/sconti-e7f3a.appspot.com/o/campusreels%2Fdownload.jpg?alt=media&token=43bf2206-e39f-4f8b-be8a-949ee46cc65b',
            }}
            style={styles.profileStyle}
          />
          <Text style={{marginHorizontal: 8}}>Udaya raj urs</Text>
          <TouchableOpacity>
            <Text style={{}}>Follow</Text>
          </TouchableOpacity>
        </View>
        <View style={{flexDirection: 'row', marginTop: 8}}>
          <Text numberOfLines={1} style={{flex: 1}}>
            kjdhjkdhn dajsdnjaksdhnkjsad asdkjbhsak
          </Text>
          <TouchableOpacity>
            <Text>more</Text>
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
              source={imagePath.icCamera}
            />
            <Image
              style={{
                width: 20,
                height: 20,
                tintColor: 'white',
                marginHorizontal: 10,
              }}
              source={imagePath.icCamera}
            />
            <Image
              style={{
                width: 20,
                height: 20,
                tintColor: 'white',
                marginHorizontal: 10,
              }}
              source={imagePath.icCamera}
            />
            <Image
              style={{
                width: 20,
                height: 20,
                tintColor: 'white',
                marginHorizontal: 10,
              }}
              source={imagePath.icCamera}
            />
            <Image
              style={{
                width: 20,
                height: 20,
                tintColor: 'white',
                marginHorizontal: 10,
              }}
              source={imagePath.icCamera}
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
              source={imagePath.icCamera}
            />
            <Text style={{marginLeft: 4, color: 'white', marginTop: 10}}>
              16.6k
            </Text>
          </View>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <Image
              style={{
                width: 15,
                height: 15,
                tintColor: 'white',
                marginTop: 10,
              }}
              source={imagePath.icCamera}
            />
            <Text style={{marginLeft: 4, color: 'white', marginTop: 10}}>
              16.6k
            </Text>
          </View>
        </View>
      </View> */}
    </View>
  );
};

export default App;

const styles = StyleSheet.create({
  backgroundVideo: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
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
