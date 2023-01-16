import { useRoute } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { Dimensions } from 'react-native';
import { View, Text, StyleSheet, Image, Button, TextInput, TouchableOpacity, Keyboard, TouchableWithoutFeedback, FlatList, Alert } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';

import { firebase } from './firebase';


let testURL = 'https://i.picsum.photos/id/840/300/200.jpg?hmac=tfwaoTnpOckS20aUVeUByeTyXA49hzT3zBB9A_2plfc';

function ProductScreen({ navigation, route }) {
    const [edit, setEdit] = useState(false);
    const [productTitle, setProductTitle] = useState('')
    const [productDescription, setProductDescription] = useState('');

    const updateHeader = () => {
        navigation.setOptions({
            headerRight: () => (
                route.name === 'Product' ?
                edit === false ?
                    <Button
                        onPress={() => {
                            setEdit(true)
                            console.log('edit onpress', edit)
                        }}
                        title="Edit"
                    />
                    :
                    <Button
                        onPress={() => {
                            setEdit(false)
                            console.log('edit onpress', edit)
                        }}
                        title="Save"
                    />
                    : console.log()
            ),
            headerLeft: () => (
                edit === false ?
                    console.log('default')
                    :
                    <Button
                        onPress={() => {
                            setEdit(false)
                            console.log('cancel pressed', edit)
                        }}
                        title="Cancel"
                    />
            ),

        })
    }

    useEffect(() => {
        updateHeader();
        if (!edit && (productTitle.length > 0 && productDescription.length > 0)) {
            updateData();
        }
    }, [navigation, edit])

    const { docId } = route.params;

    const [scrollEnabled, setScrollEnabled] = useState(true);

    const [product, setProduct] = useState([]);
    const docRef = firebase.firestore().collection('test').doc(docId);


    useEffect(() => {
        const subscribe = (async () => {
            docRef.get()
                .then(doc => {
                    if (doc.exists) {
                        setProduct(doc.data());
                        (console.log('fetched'))
                        setProductTitle(doc.data().title);
                        setProductDescription(doc.data().description);
                    } else {
                        console.log("No such document!");
                    }
                })
                .catch(error => {
                    console.log("Error getting document:", error);
                });
        })

        subscribe();
    }, [edit]);

    const updateData = async () => {
        console.log(productTitle, 'producttitle');
        if (product.title !== productTitle || product.description !== productDescription) {
            console.log('data has changed');
            await docRef.update({
                title: productTitle,
                description: productDescription
            })
                .then(() => {
                    console.log('success')
                })
                .catch((error) => {
                    console.log(error, 'failed')
                })

        } else {
            console.log('data did not change');
        }

    }

    const deleteProduct = async () => {
        await docRef.delete()
            .then(() => {
                console.log('succesfully deleted')
                navigation.goBack()
            })
            .catch((error) => console.log(error))
    }

    const onLayout = (event) => {
        const { height } = event.nativeEvent.layout;
        const screenHeight = Dimensions.get('window').height;
        if (height < screenHeight * 0.9) {
            setScrollEnabled(false);
        } else {
            setScrollEnabled(true);
        }
    }


    const deleteAlert = () =>
        Alert.alert('Delete Product', 'Are you sure you want to delete this product?', [
            {
                text: 'Cancel',
                onPress: () => console.log('Cancel Pressed'),
                style: 'cancel',
            },
            {
                text: 'OK', onPress: () => {
                    console.log('OK Pressed')
                    deleteProduct()
                }
            },
        ]);

    return (
        <ScrollView onLayout={onLayout} scrollEnabled={scrollEnabled}>
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <View style={styles.screen} onLayout={onLayout}>
                    <Image style={styles.image} source={{ uri: product.imageUrl }} />

                    <View style={[styles.underline, { paddingTop: 20 }]} />
                    <Text style={styles.descriptiveText}>Title</Text>
                    {edit === false ?
                        <Text style={styles.title}>{product.title}</Text>
                        :
                        <TextInput
                            style={[styles.title, { borderWidth: 1 }]}
                            value={productTitle}
                            onChangeText={(value) => setProductTitle(value)}
                            scrollEnabled={false}
                            multiline={true}
                        />}

                    <View style={styles.underline} />
                    <Text style={styles.descriptiveText}>Description</Text>
                    {edit === false ?
                        <Text style={[styles.text, { paddingBottom: '5%' }]}>{product.description}</Text>
                        :
                        <TextInput
                            style={[styles.text, { borderWidth: 1 }]}
                            value={productDescription}
                            onChangeText={(value) => setProductDescription(value)}
                            scrollEnabled={false}
                            multiline={true}
                        />}

                    <View style={styles.underline} />
                    <Text style={styles.descriptiveText}>{edit === false ? 'Created at' : 'hehe created not'}</Text>
                    <Text style={styles.text}>
                        {typeof product.createdAt !== 'undefined' ? product.createdAt.toDate()
                            .toLocaleDateString('en-EN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }) + '\nat ' +
                            product.createdAt.toDate()
                                .toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric' }) : console.log('no data for created at')}
                    </Text>
                    {edit === true ? <Button title='delete' onPress={deleteAlert} color={'#d80000'} /> : console.log('not delete')}
                </View>
            </TouchableWithoutFeedback>



        </ScrollView>
    );

}

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        justifyContent: 'space-between',
        padding: '10%',
    },
    title: {
        paddingBottom: '2%',
        fontWeight: 'bold',
        fontSize: '40%'
    },
    descriptiveText: {
        color: 'blue',
    },

    text: {
        fontSize: '20%',
    },
    underline: {
        borderBottomColor: 'black',
        borderBottomWidth: StyleSheet.hairlineWidth,
    },
    card: {
        marginTop: 50,
        maxWidth: '40%',
        color: 'blue',
    },
    image: {
        display: 'flex',
        aspectRatio: 3 / 2,
        width: '100%',
        border: '1px solid #ddd',
        border: 4,
        padding: 5,
    },
});

export default ProductScreen;