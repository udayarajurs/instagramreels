import React, {useState, useEffect} from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
import {
  Video as VideoCompress,
  Image as ImageCompress,
} from 'react-native-compressor';
import ImagePicker from 'react-native-image-crop-picker';

function AddPost() {
  const [video, setVideo] = useState();

  const AddVideo = () => {
    ImagePicker.openPicker({
      mediaType: 'video',
    }).then(video => {
      if (video.duration < 65000) {
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
        compressionMethod: 'auto',
      },
      progress => {
        console.log({compression: progress});
      },
    ).then(async compressedFileUrl => {
      console.log('compressedFileUrl', compressedFileUrl);
    });
  };

  return (
    <View>
      <TouchableOpacity onPress={() => AddVideo()}>
        <Text>hasbdkjsbad</Text>
      </TouchableOpacity>
    </View>
  );
}

export default AddPost;
