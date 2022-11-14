import React, {useState, useEffect, useRef} from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
import {
  Video as VideoCompress,
  Image as ImageCompress,
} from 'react-native-compressor';
import ImagePicker from 'react-native-image-crop-picker';
import Video from 'react-native-video';
import storage from '@react-native-firebase/storage';
import RNVideoHelper from 'react-native-video-helper';

function AddPost() {
  const videoRef = useRef(null);
  const [video, setVideo] = useState();
  const [afterVideoC, setAfterVideoC] = useState(null);

  const VideoConvert = async video1 => {
    // VideoCompress 1
    await VideoCompress.compress(
      video1,
      {
        quality: 'medium',
        compressionMethod: 'auto',
      },
      progress => {
        console.log({compression: progress});
      },
    ).then(async compressedFileUrl => {
      setAfterVideoC(compressedFileUrl);
      console.log('comper', compressedFileUrl);
    });
  };

  const videoConvert2 = sourceUri1 => {
    // VideoCompress 2
    RNVideoHelper.compress(sourceUri1, {
      // startTime: 10, // optional, in seconds, defaults to 0
      //  endTime: 100, //  optional, in seconds, defaults to video duration
      quality: 'high', // default low, can be medium or high
      defaultOrientation: 0, // By default is 0, some devices not save this property in metadata. Can be between 0 - 360
    })
      .progress(value => {
        console.log('progress', value); // Int with progress value from 0 to 1
      })
      .then(compressedUri => {
        console.log('compressedUri', compressedUri); // String with path to temporary compressed video
        setAfterVideoC(`${'file://' + compressedUri}`);
      });
  };

  const AddVideo = () => {
    ImagePicker.openPicker({
      mediaType: 'video',
    }).then(video => {
      if (video.duration < 11165000) {
        //setVideo(video.path);
        //VideoConvert(video.path);
        //videoConvert2(video.path);
      } else {
        alert('Video should be less than 60 seconds');
      }
    });
  };

  console.log('Video : ' + afterVideoC);

  const onBuffer = e => {
    console.log('buffering....', e);
  };

  const onError = e => {
    console.log('error raised', e);
  };

  const uploadUri = async your_Video_Link => {
    let filename = your_Video_Link.substring(
      your_Video_Link.lastIndexOf('/') + 1,
    );

    const blob = await new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.onload = function () {
        resolve(xhr.response);
      };
      xhr.onerror = function () {
        reject(new TypeError('Network request failed'));
      };
      xhr.responseType = 'blob';
      xhr.open('GET', your_Video_Link, true);
      xhr.send(null);
    });

    try {
      console.log('khjh' + blob);
      await storage()
        .ref('Posts/' + filename)
        .put(blob);
    } catch (e) {
      console.log('Upload video error = ', e);
    }
  };

  return (
    <View>
      <TouchableOpacity onPress={() => AddVideo()}>
        <Text>hasbdkjsbad</Text>
      </TouchableOpacity>

      {afterVideoC !== null ? (
        <View>
          <Video
            source={{
              uri: afterVideoC,
            }}
            posterResizeMode="cover"
            ref={videoRef}
            onBuffer={onBuffer}
            onError={onError}
            paused={false}
            repeat
            style={{width: 500, height: 500}}
          />
        </View>
      ) : (
        <View />
      )}

      <View>
        <TouchableOpacity onPress={() => uploadUri(afterVideoC)}>
          <Text>Uplode video</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

export default AddPost;
