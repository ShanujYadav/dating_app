/* eslint-disable prettier/prettier */
/* eslint-disable no-unused-vars */
/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {
    View, Text, StyleSheet, TouchableOpacity,
    Image, PermissionsAndroid, Platform,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { normalize } from '../components/theme';
import { SvgXml } from 'react-native-svg';
import { shinkLogoImage, shinkTitle, notificationBellSvg } from '../data/SvgImageData';
import ProgressBar from '../components/ProgressBar';

const NotificationsAccessScreen = () => {
    const navigation = useNavigation();

    const handleAllowButtonPressed = async () => {
        if (Platform.OS === 'android') {
            // try {
            //     await PermissionsAndroid.request(
            //         PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
            //     );
            navigation.navigate('Likes');
            // } catch (error) {
            //     console.log(error);
            // }
        }
    };

    const buttonTextStyle = {
        fontSize: 16,
        fontWeight: '600',
        lineHeight: 23.4,
    };

    return (
        // <View style={styles.container}>
        //     <ProgressBar progress={0.30} navigation={navigation} />
        //     <Image source={require('../assets/images/notifications-image.png')}
        //         style={styles.imageStyle} />
        //     <Text style={styles.titleTextStyle}>Notifications</Text>
        //     <Text style={styles.subTitleTextStyle}>
        //         Allow this, you must. We only notify when something special is afoot.
        //     </Text>
        //     <TouchableOpacity onPress={() => navigation.navigate('Likes')}
        //         style={[styles.buttonContainer, { backgroundColor: '#ffffff' }]}>
        //         <Text style={[buttonTextStyle, { color: '#282C3F' }]}>Not Now</Text>
        //     </TouchableOpacity>
        //     <View style={styles.bottomButtonContainer}>
        //         <TouchableOpacity onPress={() => handleAllowButtonPressed()}
        //             style={[styles.buttonContainer, { backgroundColor: '#9d4edd' }]}>
        //             <Text style={[buttonTextStyle, { color: '#ffffff' }]}>Allow</Text>
        //         </TouchableOpacity>
        //     </View>
        // </View>
        <View style={styles.container}>
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
                        <Text style={styles.titleTextStyle}>Do you want to see</Text>
                        <Text style={styles.subTitleTextStyle}>Notifications?</Text>
                        <Text style={styles.textStyle}>
                            Allow this, you must. We only notify when something special is afoot.
                        </Text>
                        <SvgXml xml={notificationBellSvg}
                            style={styles.notificationBellSvgStyle} />
                        <View style={styles.buttonRowContainer}>
                            <TouchableOpacity onPress={() => navigation.navigate('AddPicture')}
                                style={[styles.buttonContainer,
                                {
                                    backgroundColor: '#ffffff',
                                    borderWidth: 2, borderColor: '#4e40b3',
                                }]}>
                                <Text style={[buttonTextStyle,
                                    { color: '#282c3f' }]}>Not Now</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => handleAllowButtonPressed()}
                                style={[styles.buttonContainer,
                                { padding: normalize(13.8), backgroundColor: '#4e40b3' }]}>
                                <Text style={[buttonTextStyle,
                                    { color: '#ffffff' }]}>Yes</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </View>
        </View>
    );
};
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ffffff',
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
    notificationBellSvgStyle: {
        marginBottom: '10%',
        marginTop: '8%',
        alignSelf: 'center',
    },
    titleTextStyle: {
        marginTop: normalize(35),
        marginLeft: normalize(15),
        fontSize: normalize(30),
        fontWeight: '400',
        color: '#4e40b3',
        textAlign: 'left',
    },
    subTitleTextStyle: {
        marginLeft: normalize(15),
        fontSize: normalize(40),
        fontWeight: '800',
        color: '#4e40b3',
        textAlign: 'left',
    },
    textStyle: {
        marginTop: normalize(14),
        marginLeft: normalize(15),
        fontSize: normalize(14),
        width: normalize(320),
        fontWeight: '400',
        fontFamily: 'AvenirNext-Regular',
        color: '#354e66',
        textAlign: 'left',
        lineHeight: 21,
    },
    buttonRowContainer: {
        marginLeft: normalize(15),
        width: normalize(308),
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    imageStyle: {
        marginTop: normalize(10),
        width: normalize(56),
        height: normalize(56),
        alignSelf: 'center',
    },
    bottomButtonContainer: {
        paddingHorizontal: normalize(20),
        marginBottom: normalize(13),
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    buttonContainer: {
        padding: normalize(13),
        marginTop: 'auto',
        marginBottom: normalize(15),
        width: '45%', // Adjust the width as needed
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 5,
    },
});

export default NotificationsAccessScreen;
