/* eslint-disable prettier/prettier */
/* eslint-disable react/self-closing-comp */
/* eslint-disable no-catch-shadow */
/* eslint-disable no-shadow */
/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import {
    View, StyleSheet, Text, SafeAreaView,
    TouchableOpacity, Image, Animated, Easing,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { normalize } from '../components/theme';
import { getCurrentUser, signInWithRedirect, signOut } from 'aws-amplify/auth';
import { Hub } from '@aws-amplify/core';
import { SvgXml } from 'react-native-svg';
import { shinkLogo, shinkPurpleTitleSvg } from '../data/SvgImageData';
import AsyncStorage from '@react-native-async-storage/async-storage';

const LoginScreen = () => {
    const navigation = useNavigation();
    const [user, setUser] = useState(null);
    const [error, setError] = useState(null);
    const [customState, setCustomState] = useState(null);

    // Initial translate value for sliding animation
    const [slideValue] = useState(new Animated.Value(0));
    // Initial scale value for emerging animation
    const [scaleValue] = useState(new Animated.Value(0));


    useEffect(() => {
        // Start sliding animation when component mounts
        Animated.timing(slideValue, {
            toValue: 1,
            duration: 1000,
            easing: Easing.linear,
            useNativeDriver: true,
        }).start();

        // Start emerging animation when component mounts
        Animated.timing(scaleValue, {
            toValue: 1,
            duration: 1000,
            easing: Easing.linear,
            useNativeDriver: true,
        }).start();
    }, []);

    useEffect(() => {
        const unsubscribe = Hub.listen('auth', ({ payload }) => {
            switch (payload.event) {
                case 'signInWithRedirect':
                    getCurrUser();
                    break;
                case 'signInWithRedirect_failure':
                    setError('An error has ocurred during the OAuth flow.');
                    break;
                case 'customOAuthState':
                    setCustomState(payload.data); // this is the customState provided on signInWithRedirect function
                    break;
            }
        });
        getCurrUser();
        return unsubscribe;
    }, []);

    const getUserStatus = async (userId) => {
        let queryParams = new URLSearchParams({
            query: `
                query GetShinkUser($userId: String!) {
                    getShinkUser(userId: $userId ) {
                        userId
                    }
                }
            `,
            variables: JSON.stringify({
                userId: userId,
            }),
        });
        try {
            // Make a GET request to retrieve user status
            const response = await fetch(`https://6zdkqxsh5nb57gljtisvt3rxre.appsync-api.ap-south-1.amazonaws.com/graphql?${queryParams}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'x-api-key': 'da2-kzjqngazhngz7blym6iljtphny',
                },
            });
            if (response.ok) {
                console.log('User status retrieved successfully');
                const data = await response.json();
                return data;
            } else {
                console.error('Failed to retrieve user status. Status: ', response.status);
                const errorMessage = await response.text();
                console.error('Error Message: ', errorMessage);
            }
        } catch (error) {
            console.error('Error while retrieving user status: ', error);
        }
    };

    const getCurrUser = async () => {
        try {
            const currentUser = await getCurrentUser();
            setUser(currentUser);
            AsyncStorage.setItem('userId', currentUser.userId);
            const userStatus = getUserStatus(currentUser.userId);
            userStatus && userStatus.then((data) => {
                if (data.data.getShinkUser === null) {
                    navigation.navigate('EnterPhoneNumber');
                } else {
                    navigation.navigate('BottomTab');
                }
            });
        } catch (error) {
            console.log('Not signed in');
        }
    };

    const handleNextButtonPressed = () => {
        // Start the navigation immediately without waiting for the animation to complete
        navigation.navigate('EnterPhoneNumber');
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.circleContainer}>
                <View style={styles.firstCircleContainer}></View>
                <View style={styles.secondCircleContainer}></View>
                <View style={styles.thirdCircleContainer}></View>
                <Animated.View style={[styles.fourthCircleContainer,
                { transform: [{ scale: scaleValue }] }]}>
                    <View style={styles.logoContainer}>
                        <SvgXml xml={shinkLogo}
                            style={styles.shinkLogoStyle} />
                        <SvgXml xml={shinkPurpleTitleSvg}
                            style={styles.shinkTitleSvgStyle} />
                        <Text style={styles.subtitleTextStyle}>Someone for Everyone.</Text>
                    </View>
                    <View style={styles.textContainer}>
                        <Text style={styles.textStyle}>Tap Continue to receive an SMS confirmation to assist you with Juber.
                            We require your mobile number for verification.
                        </Text>
                    </View>
                    <View style={styles.SignInOptionsContainer}>
                        <TouchableOpacity onPress={() => navigation.navigate('EnterPhoneNumber')}
                            style={styles.SignInOptionContainer}>
                            <Image source={require('../assets/phone-logo.png')}
                                style={styles.SignInLogoImageStyle} />
                            <Text style={styles.SignInOptionTextStyle}>Sign in with Phone Number</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => handleNextButtonPressed()}
                            style={styles.nextButtonContainer}>
                            <Text style={styles.nextButtonTextStyle}>Next</Text>
                        </TouchableOpacity>
                        {/* <TouchableOpacity onPress={() => signInWithRedirect({
                    provider: 'Google',
                })}
                    style={styles.SignInOptionContainer}>
                    <Image source={require('../assets/google-logo.png')}
                        style={styles.SignInLogoImageStyle} />
                    <Text style={styles.SignInOptionTextStyle}>Sign in with Google</Text>
                </TouchableOpacity> */}
                        {/* <TouchableOpacity style={styles.SignInOptionContainer}
                    onPress={() => signInWithRedirect({
                        provider: 'Facebook',
                    })}>
                    <Image source={require('../assets/facebook-logo.png')}
                        style={styles.SignInLogoImageStyle} />
                    <Text style={styles.SignInOptionTextStyle}>Sign in with Facebook</Text>
                </TouchableOpacity> */}
                    </View>
                    <View style={styles.bottomTextContainer}>
                        <Text style={styles.bottomTextStyle}>
                            By choosing “Sign In” or “Create Account” you agree to our {''}
                            <Text style={styles.subTextStyle}>Terms of Service</Text>.
                            Learn about how we handle your data in our {''}
                            <Text style={styles.subBottomTextStyle}>Privacy Policy</Text> and {''}
                            <Text style={styles.subBottomTextStyle}>Cookies Policy</Text>.
                        </Text>
                    </View>
                </Animated.View>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#a69bea',
    },
    circleContainer: {
        flex: 1,
        marginTop: '40%',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#a69bea',
    },
    firstCircleContainer: {
        position: 'absolute',
        width: normalize(900),
        height: normalize(900),
        backgroundColor: '#c6bdfe',
        borderRadius: normalize(800),
        zIndex: -4,
    },
    secondCircleContainer: {
        position: 'absolute',
        width: normalize(850),
        height: normalize(850),
        backgroundColor: '#cdd2fe',
        borderRadius: normalize(700),
        zIndex: -3,
    },
    thirdCircleContainer: {
        position: 'absolute',
        width: normalize(800),
        height: normalize(800),
        backgroundColor: '#e0e9ff',
        borderRadius: normalize(600),
        zIndex: -2,
    },
    fourthCircleContainer: {
        width: normalize(750),
        height: normalize(750),
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#fafafa',
        borderRadius: normalize(500),
        zIndex: -1,
    },
    logoContainer: {
        top: '10%',
        alignItems: 'center',
    },
    shinkTitleSvgStyle: {
        top: normalize(-45),
        marginTop: normalize(60),
        width: normalize(116),
        height: normalize(116),
        alignSelf: 'center',
    },
    subtitleTextStyle: {
        marginTop: normalize(-40),
        fontSize: 12,
        fontWeight: '800',
        fontFamily: 'AvenirNext-Regular',
        color: '#4e40b3',
        textAlign: 'center',
        lineHeight: 21,
    },
    SignInOptionsContainer: {
        top: normalize(-80),
        width: '100%',
        alignItems: 'center',
    },
    SignInOptionContainer: {
        paddingVertical: normalize(12),
        paddingHorizontal: 16,
        marginTop: normalize(12),
        width: normalize(340),
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#eef1f8',
        borderRadius: normalize(5),
    },
    SignInLogoImageStyle: {
        marginRight: normalize(12.5),
        width: normalize(22),
        height: normalize(22),
    },
    SignInOptionTextStyle: {
        fontSize: 14,
        fontWeight: '400',
        fontFamily: 'AvenirNext-Regular',
        color: '#757575',
        lineHeight: 22,
    },
    bottomTextContainer: {
        bottom: normalize(75),
        marginTop: normalize(15),
        marginBottom: normalize(35),
        marginRight: normalize(15),
        alignSelf: 'center',
    },
    bottomTextStyle: {
        width: normalize(320),
        fontSize: normalize(12),
        fontWeight: '400',
        fontFamily: 'AvenirNext-Regular',
        color: '#959595',
        textAlign: 'justify',
        lineHeight: 18,
    },
    subBottomTextStyle: {
        fontSize: normalize(12),
        fontWeight: '500',
        fontFamily: 'AvenirNext-Bold',
        color: '#59a0ff',
        textDecorationLine: 'underline',
        lineHeight: 18,
        overflow: 'hidden',
    },
    textContainer: {
        paddingLeft: '10%',
        paddingRight: '10%',
        bottom: normalize(85),
        marginTop: 'auto',
        marginRight: normalize(15),
        alignSelf: 'center',
    },
    textStyle: {
        width: normalize(320),
        fontSize: normalize(14),
        fontWeight: '400',
        fontFamily: 'AvenirNext-Regular',
        color: '#282c3f',
        textAlign: 'justify',
        lineHeight: 21,
    },
    nextButtonContainer: {
        paddingVertical: normalize(12),
        paddingHorizontal: 16,
        marginTop: normalize(12),
        width: normalize(340),
        flexDirection: 'row',
        alignItems: 'center', // Center content horizontally
        justifyContent: 'center', // Center content vertically
        backgroundColor: '#ffffff',
        borderWidth: 2, // Border width
        borderColor: '#4e40b3', // Blue border color
        borderRadius: 8, // Adjust as needed
    },
    nextButtonTextStyle: {
        fontSize: 14, // Adjust font size as needed
        fontWeight: 'bold', // Adjust font weight as needed
        color: '#4e40b3', // Text color
        textAlign: 'center', // Align text to center horizontally
    },
});

export default LoginScreen;
