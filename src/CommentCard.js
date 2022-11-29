import {StyleSheet, Text, View, TouchableOpacity} from 'react-native';
import React from 'react';
import firestore from '@react-native-firebase/firestore';

const CommentCard = ({item}) => {
  return (
    <View style={{marginHorizontal: 15, marginVertical: 15}}>
      <View style={{flexDirection: 'row'}}>
        <Text style={{fontWeight: 'bold'}}>{item.name}</Text>

        {item.userID === '123456B' ? (
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
                      .collection('Comments')
                      .where('commentID', '==', item.commentID)
                      .get()
                      .then(querySnapshot => {
                        querySnapshot.forEach(docLikeID => {
                          docLikeID.ref
                            .delete()
                            .then(() => {
                              console.log('Document successfully deleted!');
                            })
                            .catch(function (error) {
                              console.error('Error removing document: ', error);
                            });
                        });
                      });
                  });
                });
            }}
            style={{marginStart: 15}}>
            <Text>Delete comment</Text>
          </TouchableOpacity>
        ) : (
          <View />
        )}

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
                    .collection('Comments')
                    .where('commentID', '==', item.commentID)
                    .get()
                    .then(querySnapshot => {
                      querySnapshot.forEach(docLikeID => {
                        firestore()
                          .collection('compassreal')
                          .doc(doc.id)
                          .collection('Comments')
                          .doc(docLikeID.id)
                          .collection('ReplayComments')
                          .add({
                            name: 'Udaya raj urs G',
                            userID: 'LoginID',
                            PostID: 'PostID',
                            createdAt: new Date(),
                            CommentDes: 'discretion',
                            commentID: '123457',
                          });
                      });
                    });
                });
              })
              .catch(error => {
                console.log('Error getting documents: ', error);
              });
          }}>
          <Text style={{marginStart: 15}}>RePlay the comment</Text>
        </TouchableOpacity>
      </View>
      <Text>{item.CommentDes}</Text>
    </View>
  );
};

export default CommentCard;

const styles = StyleSheet.create({});
