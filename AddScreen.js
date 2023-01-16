import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, Button, TextInput, TouchableOpacity, Keyboard, TouchableWithoutFeedback } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';
import { firebase } from './firebase';

function AddScreen() {
  // The path of the picked image
  const [pickedImagePath, setPickedImagePath] = useState('');
  const [url, setUrl] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const [loading, setLoading] = useState(false);
  let docId = '';
  const [userId, setUserId] = useState('');

  useEffect(() => {
    //setUserId(firebase.auth().currentUser.uid);
    //console.log(firebase.auth().currentUser.uid);
    const getUser = (async () => {
      const userData = await AsyncStorage.getItem('user');
      const user = JSON.parse(userData);
      setUserId(user.uid);
    })
    getUser();
  }, [])

  const collectionRef = firebase.firestore().collection("test");

  const addDocument = () => {
    if (title && title.length > 0) {
      setLoading(true);
      const timestamp = firebase.firestore.FieldValue.serverTimestamp();
      const data = {
        userId: userId,
        title: title,
        description: description,
        createdAt: timestamp
      };

      collectionRef.add(data)
        .then(async (colRef) => {
          docId = `${colRef.id}`;
          console.log("docid is:", docId);
          await uploadImage();
        })
        .catch((error) => {
          console.log(error);
        });
    } else {
      alert('Title cannot be empty');
    }
  }

  // This function is triggered when the "Select an image" button pressed
  const showImagePicker = async () => {
    // Ask the user for the permission to access the media library 
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (permissionResult.granted === false) {
      alert("You've refused to allow this appp to access your photos!");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync();

    // Explore the result
    console.log(result);

    if (!result.cancelled) {
      setPickedImagePath(result.uri);
      console.log(result.uri);
    }
  }

  // This function is triggered when the "Open camera" button pressed
  const openCamera = async () => {
    setLoading(true);
    // Ask the user for the permission to access the camera
    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();

    if (permissionResult.granted === false) {
      alert("You've refused to allow this app to access your camera!");
      return;
    }

    const result = await ImagePicker.launchCameraAsync();

    // Explore the result
    console.log(result);

    if (!result.cancelled) {
      setPickedImagePath(result.uri);
      console.log(result.uri);
    }
    setLoading(false);
  }

  const removeImage = () => {
    setPickedImagePath('');
  }

  const uploadImage = async () => {
    // Save the image to Firebase Storage
    const storageRef = firebase.storage().ref();
    const imageRef = storageRef.child(`images/${pickedImagePath}`);

    if (pickedImagePath === '') {
      await collectionRef.doc(docId).update({
        imageUrl: 'https://firebasestorage.googleapis.com/v0/b/secondhand-9fdb6.appspot.com/o/images%2Fdefault_image.jpg?alt=media&token=947eefec-64ad-4215-893e-408f28d19c45'
      })
        .then(() => {
          console.log('well done');
        })
        .catch((error) => {
          console.log(error);
        });
    } else {
      const response = await fetch(pickedImagePath);
      const file = await response.blob();

      imageRef.put(file).then(() => {
        // Get the download URL for the image
        imageRef.getDownloadURL().then(async (url) => {
          // Save the download URL to Firestore
          await collectionRef.doc(docId).update({
            imageUrl: url
          })
            .then(() => {
              console.log('well done');
            })
            .catch((error) => {
              console.log(error);
            });
        });
      });
    }
    setTitle();
    setDescription();
    removeImage();
    setLoading(false);
  };

  return (

    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.screen}>
        <View style={styles.inputContainer}>
          <Text style={styles.text}>Title</Text>
          <TextInput
            style={styles.input}
            onChangeText={(value) => setTitle(value)}
            value={title}
            multiline={false}
          />
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.text}>Description</Text>
          <TextInput
            style={[styles.input, { height: 100 }]}
            onChangeText={(value) => setDescription(value)}
            value={description}
            multiline={true}
          />
        </View>
        <View style={styles.buttonContainer}>
          <Button onPress={showImagePicker} title="Select image" />
          <Button onPress={openCamera} title="Open camera" />
          <Button disabled={pickedImagePath === '' ? true : false} onPress={removeImage} title="Remove image" />
        </View>

        <View style={styles.imageContainer}>
          {
            pickedImagePath !== '' ?
              <Image
                source={{ uri: pickedImagePath }}
                style={styles.image}
              />
              :
              <Text style={styles.image} />
          }
        </View>
        <View>
          <TouchableOpacity style={[styles.button, loading && styles.buttonDisabled]} disabled={loading} onPress={addDocument}>
            <Text style={styles.buttonText}>Add</Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableWithoutFeedback>

  );
}

// Just some styles
const styles = StyleSheet.create({
  screen: {
    flex: 1,
    justifyContent: 'space-evenly',
    alignItems: 'center',
  },
  text: {
    fontSize: 20,
  },
  input: {
    height: 35,
    width: 200,
    borderWidth: 1,
    padding: 10,
  },
  inputContainer: {
    width: 325,
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    top: '10%',
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 4,
    elevation: 3,
    backgroundColor: 'black',
  },
  buttonDisabled: {
    backgroundColor: 'grey',
  },
  buttonText: {
    fontSize: 16,
    lineHeight: 21,
    fontWeight: 'bold',
    letterSpacing: 0.25,
    color: 'white',
  },
  buttonContainer: {
    width: 350,
    flexDirection: 'row',
    justifyContent: 'space-around'
  },
  imageContainer: {
    padding: 0
  },
  image: {
    width: 350,
    height: 275,
    resizeMode: 'cover',
    borderWidth: 1
  }
});

export default AddScreen;