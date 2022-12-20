import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  Dimensions,
  TextInput,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import React, {useState, useEffect} from 'react';
const {height, width} = Dimensions.get('window');
import CommentCard from './CommentCard';
import firestore from '@react-native-firebase/firestore';

const Comment_Screen = ({route}) => {
  const {name, des, ProfilePic, PostID, LoginID} = route.params;
  const [recentVideo, setRecentVideo] = useState([]);
  const [discretion, setDiscretion] = useState();
  const [documentsID, setDocumentsID] = useState();
  const [messages, setMessages] = useState([]);
  const [recentChats, setRecentChats] = useState([]);
  const MESSAGE_LIMIT = 50;
  const [moreChatsAvailable, setMoreChatsAvailable] = useState(true);

  const AddComment = () => {
    setDiscretion('');
    firestore()
      .collection('compassreal')
      .where('PostID', '==', PostID)
      .get()
      .then(querySnapshot => {
        querySnapshot.forEach(doc => {
          firestore()
            .collection('compassreal')
            .doc(doc.id)
            .collection('Comments')
            .add({
              name: 'Udaya raj urs G',
              userID: LoginID,
              PostID: PostID,
              createdAt: new Date(),
              CommentDes: discretion,
              commentID: LoginID + new Date(),
            });
        });
      })
      .catch(error => {
        console.log('Error getting documents: ', error);
      });
  };

  useEffect(() => {
    firestore()
      .collection('compassreal')
      .where('PostID', '==', PostID)
      .orderBy('createdAt', 'desc')
      .get()
      .then(querySnapshot => {
        querySnapshot.forEach(doc => {
          setDocumentsID(doc.id);
        });
      })
      .catch(error => {
        console.log('Error getting documents: ', error);
      });

    if (documentsID !== undefined) {
      const messageRef = firestore()
        .collection('compassreal')
        .doc(documentsID)
        .collection('Comments')
        .limit(MESSAGE_LIMIT);
      const unSubscribe = messageRef.onSnapshot(querySnapshot => {
        const allmsg = querySnapshot.docs.map(docSanp => {
          const data = docSanp.data();
          if (data.createdAt) {
            return {
              ...docSanp.data(),
              createdAt: docSanp.data().createdAt.toDate(),
            };
          } else {
            return {
              ...docSanp.data(),
              createdAt: new Date(),
            };
          }
        });

        let chats = [];
        allmsg.forEach(snapshot => {
          chats.push(snapshot);
        });

        if (recentChats.length > 0) {
          const newRecentChats = [];
          for (let i = 0; i < chats.length; i++) {
            if (chats[i].sentBy === recentChats[0].sentBy) {
              break;
            }

            newRecentChats.push(chats[i]);
          }
          setRecentChats([...newRecentChats, ...recentChats]);
        } else {
          setRecentChats(chats);
          if (chats.length < MESSAGE_LIMIT) {
            setMoreChatsAvailable(false);
          }
        }
      });

      return () => {
        unSubscribe();
      };
    }
  }, [documentsID]);

  const onChatListEndReached = () => {
    console.log('onChatListEndReached');
    if (!moreChatsAvailable) {
      return;
    }
    let startAfterTime;
    if (messages.length > 0) {
      startAfterTime = messages[messages.length - 1].createdAt;
    } else if (recentChats.length > 0) {
      startAfterTime = recentChats[recentChats.length - 1].createdAt;
    } else {
      setMoreChatsAvailable(false);
      return;
    }

    console.log(startAfterTime);

    firestore()
      .collection('compassreal')
      .doc(documentsID)
      .collection('Comments')
      .orderBy('createdAt', 'desc')
      .startAfter(startAfterTime)
      .limit(MESSAGE_LIMIT)
      .get()
      .then(querySnapshot => {
        const allmsg = querySnapshot.docs.map(docSanp => {
          const data = docSanp.data();
          if (data.createdAt) {
            return {
              ...docSanp.data(),
              createdAt: docSanp.data().createdAt.toDate(),
            };
          } else {
            return {
              ...docSanp.data(),
              createdAt: new Date(),
            };
          }
        });

        let chats = [];
        allmsg.forEach(snapshot => {
          chats.push(snapshot);
        });

        if (chats.length === 0) {
          setMoreChatsAvailable(false);
        } else {
          setMessages([...messages, ...chats]);
        }
      });
  };

  return (
    <View style={{flex: 1}}>
      <View style={{marginHorizontal: 15, marginTop: 15}}>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <Image
            source={{
              uri: ProfilePic,
            }}
            style={styles.profileStyle}
          />
          <Text style={{marginHorizontal: 8, color: 'black'}}>{name}</Text>
          <TouchableOpacity>
            <Text style={{color: 'black', fontWeight: 'bold'}}>Follow</Text>
          </TouchableOpacity>
        </View>
        <View style={{flexDirection: 'row', marginTop: 8}}>
          <Text numberOfLines={1} style={{flex: 1, color: 'black'}}>
            {des}
          </Text>
          <TouchableOpacity>
            <Text style={{color: 'black', fontWeight: 'bold'}}>more</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View
        style={{
          width: width,
          height: 2,
          backgroundColor: '#000',
          marginTop: 15,
        }}
      />

      <View>
        <FlatList
          inverted
          contentContainerStyle={{flexGrow: 1}}
          showsVerticalScrollIndicator={false}
          data={[...recentChats, ...messages]}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({item}) => <CommentCard item={item} />}
          onEndReachedThreshold={0.2}
          onEndReached={onChatListEndReached}
          ListFooterComponent={
            moreChatsAvailable ? (
              <View style={{marginTop: 15, marginBottom: 15}}>
                <ActivityIndicator />
              </View>
            ) : (
              <View></View>
            )
          }
        />
      </View>

      <View
        style={{
          position: 'absolute',
          bottom: 0,
          marginHorizontal: 10,
          marginVertical: 5,
          flexDirection: 'row',
          borderColor: '#A2A2A2',
          borderWidth: 1,
          borderRadius: 15,
        }}>
        <TextInput
          autoFocus={false}
          multiline={true}
          placeholderTextColor="#A2A2A2"
          value={discretion}
          style={{
            marginEnd: width * 0.12,
            color: '#000',
            width: width * 0.6,
            marginStart: 15,
          }}
          onChangeText={Des => setDiscretion(Des)}
          placeholder="Comment as udaya raj urs G"
        />

        <TouchableOpacity
          onPress={() => {
            AddComment();
          }}
          style={{alignSelf: 'center', top: 2, marginEnd: 15}}>
          <Text
            style={{
              paddingHorizontal: 15,
              paddingVertical: 5,
              backgroundColor: '#3388ff',
              color: '#FFF',
              borderRadius: 15,
            }}>
            Post
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Comment_Screen;

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
