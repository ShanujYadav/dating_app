/* eslint-disable prettier/prettier */
/* eslint-disable no-unused-vars */
import React from 'react';
import {
    View, Text, StyleSheet, TouchableOpacity, Alert,
    Image, PermissionsAndroid, KeyboardAvoidingView,
} from 'react-native';
import { normalize } from '../components/theme';
import { useNavigation } from '@react-navigation/native';
import { SvgXml } from 'react-native-svg';
import { shinkLogoImage, shinkTitle, locationSvg } from '../data/SvgImageData';
import Geolocation from 'react-native-geolocation-service';
import ProgressBar from '../components/ProgressBar';
import AsyncStorage from '@react-native-async-storage/async-storage';

const LocationAccessScreen = () => {
    const navigation = useNavigation();
    const handleNextButtonPressed = async (type) => {
        try {
            const granted = await PermissionsAndroid.requestMultiple([
                PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
                PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION,
            ]);
            if (
                granted['android.permission.ACCESS_FINE_LOCATION'] ===
                PermissionsAndroid.RESULTS.GRANTED &&
                granted['android.permission.ACCESS_COARSE_LOCATION'] ===
                PermissionsAndroid.RESULTS.GRANTED
            ) {
                Geolocation.getCurrentPosition(
                    (position) => {
                        console.log('Your Location Data: ', position);
                        AsyncStorage.setItem('location', JSON.stringify(position));
                        const location = String(position);
                        navigation.navigate('NotificationsAccess', { location: location });
                    },
                    (error) => {
                        console.log('Location Error: ', error);
                        Alert.alert('Error getting location');
                    },
                    { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
                );
            } else {
                console.log('Location permission denied');
                Alert.alert('Shink needs your location to connect you to nearby Shinkers');
            }
        } catch (error) {
            console.log(error);
        }
    };

    const requestCameraPermission = async () => {
        try {
            const granted = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
                PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION,
            );
            if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                console.log('You have the access to the camera');
            } else {
                console.log('camera access denied');
            }
        } catch (error) {
            console.warn(error);
        }
    };

    const buttonTextStyle = {
        fontSize: 16,
        fontWeight: '600',
        color: '#4e40b3',
        lineHeight: 23.4,
    };

    return (
        // <KeyboardAvoidingView style={styles.container}>
        //     <ProgressBar progress={0.25} />
        //     <Image source={require('../assets/images/location-image.png')}
        //         style={styles.imageStyle} />
        //     <Text style={styles.titleTextStyle}>Location?</Text>
        //     <Text style={styles.subTitleTextStyle}>
        //         The next pop-up - allow it. We need it to Shink you with nearby humans.</Text>
        //     <Text style={[styles.subTitleTextStyle,
        //     { marginTop: normalize(35) }]}>We do not share your exact location.</Text>
        //     <Text style={[styles.subTitleTextStyle,
        //     { marginTop: normalize(35) }]}>Safety first!</Text>
        //     {/* <Text style={styles.subTitleTextStyle}>
        //         We use your location to connect you to nearby Shinkers
        //     </Text> */}
        //     <View style={styles.bottomButtonContainer}>
        //         <TouchableOpacity onPress={() => handleNextButtonPressed()}
        //             style={styles.buttonContainer}>
        //             <Text style={buttonTextStyle}>Allow</Text>
        //         </TouchableOpacity>
        //     </View>
        // </KeyboardAvoidingView>
        <KeyboardAvoidingView style={styles.container}>
            <View style={styles.circleContainer}>
                <View style={styles.firstCircleContainer} />
                <View style={styles.secondCircleContainer} />
                <View style={styles.thirdCircleContainer} />
                <View style={styles.fourthCircleContainer}>
                    <View style={styles.contentContainer}>
                        <View style={styles.logoContainer}>
                            <SvgXml xml={shinkLogoImage}
                                style={{ marginRight: normalize(10) }} />
                            <SvgXml xml={shinkTitle}
                                style={styles.shinkTitleSvgStyle} />
                        </View>
                        <Text style={styles.titleTextStyle}>Where is your</Text>
                        <Text style={styles.subTitleTextStyle}>Location?</Text>
                        <SvgXml xml={locationSvg}
                            style={styles.locationSvgStyle} />
                        <TouchableOpacity onPress={() => handleNextButtonPressed()}
                            style={styles.buttonContainer}>
                            <Text style={buttonTextStyle}>Next</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#a69bea',
    },
    circleContainer: {
        position: 'relative',
        marginBottom: '90%',
        alignItems: 'center',
        justifyContent: 'center',
    },
    firstCircleContainer: {
        position: 'absolute',
        width: normalize(950),
        height: normalize(950),
        backgroundColor: '#c6bdfe',
        borderRadius: normalize(900),
        zIndex: -4,
    },
    secondCircleContainer: {
        position: 'absolute',
        width: normalize(900),
        height: normalize(900),
        backgroundColor: '#cdd2fe',
        borderRadius: normalize(800),
        zIndex: -3,
    },
    thirdCircleContainer: {
        position: 'absolute',
        width: normalize(850),
        height: normalize(850),
        backgroundColor: '#e0e9ff',
        borderRadius: normalize(700),
        zIndex: -2,
    },
    fourthCircleContainer: {
        width: normalize(800),
        height: normalize(800),
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#fafafa',
        borderRadius: normalize(600),
        zIndex: -1,
    },
    logoContainer: {
        marginBottom: normalize(30),
        marginTop: normalize(80),
        flexDirection: 'row',
        alignItems: 'center',
        alignSelf: 'center',
    },
    shinkTitleSvgStyle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#000000',
    },
    locationSvgStyle: {
        marginVertical: '4%',
        alignSelf: 'center',
    },
    imageStyle: {
        marginTop: normalize(10),
        width: normalize(56),
        height: normalize(56),
        alignSelf: 'center',
    },
    titleTextStyle: {
        marginTop: normalize(30),
        marginLeft: normalize(8),
        fontSize: normalize(30),
        fontWeight: '400',
        color: '#4e40b3',
        textAlign: 'left',
    },
    subTitleTextStyle: {
        marginTop: normalize(5),
        marginLeft: normalize(8),
        fontSize: normalize(40),
        fontWeight: '800',
        fontFamily: 'AvenirNext-Regular',
        color: '#4e40b3',
        textAlign: 'left',
        lineHeight: 45,
    },
    bottomButtonContainer: {
        paddingHorizontal: normalize(20),
        marginBottom: normalize(8),
        marginTop: 'auto',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    buttonContainer: {
        padding: normalize(13),
        marginBottom: normalize(20),
        width: normalize(300),
        alignItems: 'center',
        alignSelf: 'center',
        justifyContent: 'center',
        backgroundColor: '#ffffff',
        borderWidth: 2,
        borderColor: '#4e40b3',
        borderRadius: 8,
    },
});
export default LocationAccessScreen;
