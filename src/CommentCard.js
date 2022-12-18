import {StyleSheet, Text, View, TouchableOpacity, FlatList} from 'react-native';
import React, {useEffect, useState} from 'react';
import firestore from '@react-native-firebase/firestore';

const CommentCard = ({item}) => {
  const [ReplaceComment, setReplaceComment] = useState([]);
  const [updateSubComment, setUpdateSubComment] = useState(true);
  useEffect(() => {
    firestore()
      .collection('compassreal')
      .where('PostID', '==', item.PostID)
      .get()
      .then(querySnapshot1 => {
        querySnapshot1.forEach(doc => {
          firestore()
            .collection('compassreal')
            .doc(doc.id)
            .collection('Comments')
            .where('commentID', '==', item.commentID)
            .get()
            .then(querySnapshot2 => {
              querySnapshot2.forEach(docCommentID => {
                firestore()
                  .collection('compassreal')
                  .where('PostID', '==', item.PostID)
                  .get()
                  .then(querySnapshot3 => {
                    querySnapshot3.forEach(doc => {
                      firestore()
                        .collection('compassreal')
                        .doc(doc.id)
                        .collection('Comments')
                        .doc(docCommentID.id)
                        .collection('ReplayComments')
                        .get()
                        .then(querySnapshot4 => {
                          setReplaceComment([]);
                          querySnapshot4.forEach(docreplayComment => {
                            setReplaceComment(images => [
                              ...images,
                              docreplayComment._data,
                            ]);
                          });
                        });
                    });
                  });
              });
            });
        });
      });
  }, [updateSubComment]);

  return (
    <View style={{marginHorizontal: 15, marginVertical: 15}}>
      <View style={{flexDirection: 'row'}}>
        <Text style={{fontWeight: 'bold'}}>{item.name}</Text>

        {/* {item.userID === '123456B' ? (
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
                          // docLikeID.ref
                          //   .delete()
                          //   .then(() => {
                          //     console.log('Document successfully deleted!');
                          //   })
                          //   .catch(function (error) {
                          //     console.error('Error removing document: ', error);
                          //   });
                          console.log(docLikeID.id);
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
        )} */}

        {/* <TouchableOpacity
          onPress={() => {
            firestore()
              .collection('compassreal')
              .where('PostID', '==', item.PostID)
              .get()
              .then(querySnapshot => {
                querySnapshot.forEach(doc => {
                  setUpdateSubComment(false);
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
        </TouchableOpacity> */}
      </View>
      <Text>{item.CommentDes}</Text>
      <View>
        <FlatList
          contentContainerStyle={{flexGrow: 1}}
          showsVerticalScrollIndicator={false}
          data={ReplaceComment}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({item}) => (
            <View>
              <Text>{item.CommentDes}</Text>
            </View>
          )}
        />
      </View>
    </View>
  );
};

export default CommentCard;

const styles = StyleSheet.create({});
