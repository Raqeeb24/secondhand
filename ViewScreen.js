import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, Button, TextInput, TouchableOpacity, Keyboard, TouchableWithoutFeedback, FlatList } from 'react-native';

import { firebase } from './firebase';

function ViewScreen() {
    const [products, setProducts] = useState([]);
    const collectionRef = firebase.firestore().collection('test');
    let testURL = 'https://i.picsum.photos/id/840/300/200.jpg?hmac=tfwaoTnpOckS20aUVeUByeTyXA49hzT3zBB9A_2plfc';
    const [collectionsData, setCollectionsData] = useState({});

    const navigation = useNavigation();

    useEffect(() => {
        console.log('re-run')
        const unsubscribe = collectionRef.onSnapshot((snapshot) => {
            const data = [];
            snapshot.forEach((doc) => {
                const docData = doc.data();
                docData.id = doc.id;
                data.push(docData);
            });
            setProducts(data);
        });

        return () => unsubscribe();
    }, []);


    const renderItem = ({ item }) => (
        <Card style={{ flex: 0.5 }} title={item} />
    );

    const Card = ({ title }) => (
        <TouchableOpacity onPress={() => {
            navigation.navigate('Products', { docId: title.id })
        }}>
            <View style={styles.item}>
                <Image style={styles.image} source={{ uri: title.imageUrl }/*{ uri: testURL }*/} />
                <Text style={styles.card}>{title.title}</Text>

            </View>
        </TouchableOpacity>

    );

    return (
        <View>
            <FlatList
                data={products}
                renderItem={({ item }) => <Card title={item} />}
                numColumns={2}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    title: {
        textAlign: 'center',
        paddingTop: '25%',
        fontWeight: 'bold',
        fontSize: '40%'
    },


    text: {
        fontSize: '20%',
    },
    card: {
        marginTop: 5,
        color: 'black',
        textAlign: 'center',
    },
    item: {
        backgroundColor: '#89cff0',
        height: 175,
        width: 150,
        justifyContent: 'space-between',
        flexDirection: 'column',
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
        height: '80%',
        width: '100%',
        border: '1px solid #ddd',
        border: 4,
        padding: 5,
    },
});

export default ViewScreen;