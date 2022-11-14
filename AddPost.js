import React, {useState, useEffect, useRef} from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
import {
  Video as VideoCompress,
  Image as ImageCompress,
} from 'react-native-compressor';
import ImagePicker from 'react-native-image-crop-picker';
import Video from 'react-native-video';
import storage from '@react-native-firebase/storage';

function AddPost() {
  const videoRef = useRef(null);
  const [video, setVideo] = useState();
  const [afterVideoC, setAfterVideoC] = useState(null);

  const AddVideo = () => {
    ImagePicker.openPicker({
      mediaType: 'video',
    }).then(video => {
      if (video.duration < 11165000) {
        setVideo(video.path);
        VideoConvert(video.path);
      } else {
        alert('Video should be less than 60 seconds');
      }
    });
  };

  console.log('Video : ' + video);

  const VideoConvert = async video1 => {
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
