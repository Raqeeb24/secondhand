import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, Button, TextInput, TouchableOpacity, Keyboard, TouchableWithoutFeedback, FlatList } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CardScreen from './ProductScreen';
import { useNavigation } from '@react-navigation/native';


import { firebase } from './firebase';

function EditScreen({ navigation }) {
    const [products, setProducts] = useState([]);
    const collectionRef = firebase.firestore().collection('test');
    let testURL = 'https://i.picsum.photos/id/840/300/200.jpg?hmac=tfwaoTnpOckS20aUVeUByeTyXA49hzT3zBB9A_2plfc';

    const [userId, setUserId] = useState('');

    const getUser = (async () => {
        const userData = await AsyncStorage.getItem('user');
        const user = JSON.parse(userData);
        setUserId(user.uid);
    })

    useEffect(() => {
        const fetchData = async () => {
            console.log(userId.length, 'length');
            await getUser();
            if (userId) {
                console.log('re-run', userId)
                const unsubscribe = collectionRef.where('userId', '==', userId).onSnapshot((snapshot) => {
                    const data = [];
                    snapshot.forEach((doc) => {
                        const docData = doc.data();
                        docData.id = doc.id;
                        data.push(docData);
                        console.log('one')
                    });
                    setProducts(data);
                });
            }
            return () => {
                unsubscribe();
            };
        };
        fetchData();
    }, [userId]);

    const Item = ({ title }) => (
        <View style={styles.item}>
            <Text style={styles.title}>{title}</Text>
        </View>
    );

    const renderItem = ({ item }) => (
        <Card title={item} />
    );

    const Card = ({ title }) => (
        <TouchableOpacity onPress={() => navigation.navigate('Product', { docId: title.id })}>
            <View style={styles.item}>
                <View style={styles.card}>
                    <Text style={styles.text}>{title.title}</Text>
                    <Text style={styles.text}>{title.createdAt !== null ?
                        title.createdAt.toDate().toLocaleDateString('en-EN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }) + ', ' +
                        title.createdAt.toDate().toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric' }) : console.log("type:", typeof title.createdAt)}</Text>

                </View>
                <Image style={styles.image} source={{ uri: title.imageUrl }/*{ uri: testURL }*/} />

            </View>
        </TouchableOpacity>

    );

    return (
        <View>
            <FlatList
                data={products}
                renderItem={renderItem}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    header: {
        visible: false,
    },
    title: {
        textAlign: 'center',
        paddingTop: '25%',
        fontWeight: 'bold',
        fontSize: '40%'
    },
    main: {
        paddingTop: '30%',
        marginHorizontal: 50
    },
    footer: {
        paddingBottom: '20%',
        marginHorizontal: 110
    },
    text: {
        fontSize: '14%',
        color: 'white',
    },
    input: {
        height: 40,
        borderWidth: 1,
        padding: 10,
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
    buttonText: {
        fontSize: 16,
        lineHeight: 21,
        fontWeight: 'bold',
        letterSpacing: 0.25,
        color: 'white',
    },
    buttonNewAccountText: {
        paddingTop: '70%',
        textDecorationLine: 'underline',
    },
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
    card: {
        marginTop: 50,
        maxWidth: '40%',
    },
    item: {
        backgroundColor: '#105b7e',
        height: 175,
        justifyContent: 'space-between',
        flexDirection: 'row',
        marginVertical: 8,
        marginHorizontal: 16,
        padding: 20,
        borderWidth: 4,
        borderRadius: 10,
        flex: 1,
        flexGrow: 1
    },
    image: {
        display: 'flex',
        height: '100%',
        width: '60%',
        border: '1px solid #ddd',
        border: 4,
        padding: 5,
    },
});

export default EditScreen;