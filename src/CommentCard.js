import {StyleSheet, Text, View} from 'react-native';
import React from 'react';

const CommentCard = ({item}) => {
  return (
    <View>
      <Text>{item.CommentDes}</Text>
    </View>
  );
};

export default CommentCard;

const styles = StyleSheet.create({});
