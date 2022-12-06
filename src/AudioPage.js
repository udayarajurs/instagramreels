import React, {useEffect, useState} from 'react';
import {View, StyleSheet, TouchableOpacity, Image} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Play_button from './Play_button.png';
import Pause_button from './Pause_button.png';

var Sound = require('react-native-sound');

Sound.setCategory('Playback');

var audio = new Sound(
  'https://firebasestorage.googleapis.com/v0/b/memory-352617.appspot.com/o/AB.mp3?alt=media&token=a9b28705-bcf4-4b55-ae8c-5aa2bf7c2615',
  null,
  error => {
    if (error) {
      console.log('failed to load the sound', error);
      return;
    }
    // if loaded successfully
    console.log(
      'duration in seconds: ' +
        audio.getDuration() +
        'number of channels: ' +
        audio.getNumberOfChannels(),
    );
  },
);
const App = () => {
  const [playing, setPlaying] = useState();
  useEffect(() => {
    audio.setVolume(1);
    return () => {
      audio.release();
    };
  }, []);
  const playPause = () => {
    if (audio.isPlaying()) {
      audio.pause();
      setPlaying(false);
    } else {
      setPlaying(true);
      audio.play(success => {
        if (success) {
          setPlaying(false);
          console.log('successfully finished playing');
        } else {
          setPlaying(false);
          console.log('playback failed due to audio decoding errors');
        }
      });
    }
  };
  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.playBtn} onPress={playPause}>
        {playing ? (
          <Image
            style={{width: 50, height: 50}}
            source={require('./Pause_button.png')}
          />
        ) : (
          <Image
            style={{width: 50, height: 50}}
            source={require('./Play_button.png')}
          />
        )}
      </TouchableOpacity>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  playBtn: {
    padding: 20,
  },
});
export default App;
