/* eslint-disable prettier/prettier */
/* eslint-disable react/self-closing-comp */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
/* eslint-disable react-native/no-inline-styles */
import React, { useState, useEffect } from 'react';
import {
    StyleSheet, Text, View, TextInput,
    TouchableOpacity, KeyboardAvoidingView, Animated, Easing,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { signUp, signIn } from 'aws-amplify/auth';
import { normalize } from '../components/theme';
import { SvgXml } from 'react-native-svg';
import { shinkLogoImage, shinkTitle } from '../data/SvgImageData';
import CountryPicker from 'react-native-country-picker-modal';
import Loader from 'react-native-modal-loader';
import ProgressBar from '../components/ProgressBar';
import AsyncStorage from '@react-native-async-storage/async-storage';

const EnterPhoneNumberScreen = () => {
    const navigation = useNavigation();
    const [selectedPhoneCode, setSelectedPhoneCode] = useState('+91');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [borderColor, setBorderColor] = useState('#979797');
    const [countryCode, setCountryCode] = useState('IN');
    const [country, setCountry] = useState(null);
    const [slideValue] = useState(new Animated.Value(0));

    useEffect(() => {
        // Start sliding animation when component mounts
        Animated.timing(slideValue, {
            toValue: 1,
            duration: 1000,
            easing: Easing.linear,
            useNativeDriver: true,
        }).start();
    }, []);

    const onSelect = (cntry) => {
        setCountryCode(cntry.cca2);
        setSelectedPhoneCode(cntry.callingCode);
        setCountry(cntry);
    };

    const handleNextButtonPressed = () => {
        if (phoneNumber.length < 10) {
            setBorderColor('#eb4335');
            return;
        }
        setBorderColor('#979797');
        const calculatedPhoneNumber = selectedPhoneCode + phoneNumber;
        handleSignUp({
            username: phoneNumber, password: phoneNumber,
            phone_number: calculatedPhoneNumber,
        });
        const userPhoneNumber = selectedPhoneCode + phoneNumber;
        console.log(userPhoneNumber);
        AsyncStorage.setItem('phoneNumber', userPhoneNumber);
        setIsLoading(false);
        navigation.navigate('OTPConfirmation',
            { phoneNumber: phoneNumber, countryCode: selectedPhoneCode });
    };

    async function handleSignUp({ username, password, phone_number }) {
        setIsLoading(true);
        try {
            const { isSignUpComplete, userId, nextStep } = await signUp({
                username,
                password,
                options: {
                    userAttributes: {
                        phone_number,  // E.164 number convention
                    },
                    // optional
                    autoSignIn: true,  // or SignInOptions e.g { authFlowType: "USER_SRP_AUTH" }
                },
            });
            console.log(userId);
            console.log('isSignUpComplete: ', isSignUpComplete);
            console.log('nextStep: ', nextStep);
            setIsLoading(false);
            navigation.navigate('OTPConfirmation',
                { phoneNumber: phoneNumber, countryCode: selectedPhoneCode });
        } catch (error) {
            console.log(error.message);
            if (error.message === 'An account with the given phone_number already exists.') {
                handleSignIn({ username, password, phone_number });
            }
        }
    }

    async function handleSignIn({ username, password }) {
        try {
            setIsLoading(false);
            const { isSignedIn, nextStep } = await signIn({ username, password });
            console.log(isSignedIn);
            if (isSignedIn) {
                setIsLoading(false);
                navigation.navigate('BottomTab');
            }
            console.log(nextStep);
        } catch (error) {
            console.log('error while signing in', error);
        }
    }

    const buttonTextStyle = {
        fontSize: 16,
        fontWeight: '600',
        lineHeight: 23.4,
    };

    return (
        <View style={styles.container}>
            <Animated.View style={[styles.circleContainer,
            {
                transform: [{
                    translateY: slideValue.interpolate({
                        inputRange: [0, 1],
                        outputRange: [500, 0],
                    }),
                }],
            }]}>
                <View style={styles.firstCircleContainer}></View>
                <View style={styles.secondCircleContainer}></View>
                <View style={styles.thirdCircleContainer}></View>
                <View style={styles.fourthCircleContainer}>
                    <View style={styles.logoContainer}>
                        <SvgXml xml={shinkLogoImage}
                            style={{ marginRight: normalize(10) }} />
                        <SvgXml xml={shinkTitle}
                            style={styles.shinkTitleSvgStyle} />
                    </View>
                    <Text style={styles.subtitleTextStyle}>Someone for Everyone</Text>
                    <KeyboardAvoidingView style={styles.subContainer}>
                        {/* <ProgressBar progress={0.05} /> */}
                        <Loader loading={isLoading} color={'#9d4edd'} />
                        <Text style={styles.titleTextStyle}>Number?</Text>
                        <View style={[styles.phoneNumberInputContainer,
                        { borderColor: borderColor }]}>
                            <CountryPicker
                                {...{
                                    countryCode,
                                    onSelect,
                                }}
                                withCallingCode={true}
                                withFlag={true}
                                visible={false}
                                withCallingCodeButton={true}
                                withModal={true} />
                            <TextInput placeholder="Number"
                                placeholderTextColor={'#979797'}
                                keyboardType="numeric"
                                value={phoneNumber}
                                onChangeText={text => setPhoneNumber(text)}
                                style={[styles.phoneNumberTextInputStyle,
                                { borderColor: borderColor }]} />
                        </View>
                        {borderColor === '#eb4335' ?
                            <Text style={styles.warningTextStyle}>
                                Enter a valid phone number</Text>
                            : null}
                        <View style={styles.bottomButtonContainer}>
                            <TouchableOpacity onPress={() => handleNextButtonPressed()}
                                style={[styles.buttonContainer,
                                { backgroundColor: phoneNumber ? '#4e40b3' : '#ffffff' }]}
                                disabled={!phoneNumber}>
                                <Text style={[buttonTextStyle,
                                    { color: phoneNumber ? '#ffffff' : '#4e40b3' }]}>Next</Text>
                            </TouchableOpacity>
                        </View>
                    </KeyboardAvoidingView>
                </View>
            </Animated.View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#a69bea',
    },
    circleContainer: {
        flex: 1,
        marginTop: '45%',
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
        marginTop: '6%',
        marginBottom: normalize(20),
        flexDirection: 'row',
        alignItems: 'center',
    },
    shinkTitleSvgStyle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#000000',
    },
    subtitleTextStyle: {
        marginTop: normalize(-12),
        fontSize: 12,
        fontWeight: '800',
        fontFamily: 'AvenirNext-Regular',
        color: '#4e40b3',
        textAlign: 'center',
        lineHeight: 21,
    },
    subContainer: {
        marginBottom: 'auto',
        width: '40%',
        alignItems: 'left',
        justifyContent: 'center',
    },
    titleTextStyle: {
        marginTop: normalize(30),
        marginLeft: normalize(-8),
        fontSize: 30,
        fontWeight: '800',
        color: '#4e40b3',
    },
    phoneNumberInputContainer: {
        paddingVertical: normalize(1.7),
        paddingHorizontal: normalize(7),
        bottom: '2%',
        marginTop: normalize(25),
        marginHorizontal: normalize(-8),
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#ffffff',
        borderWidth: 1,
        borderColor: '#4e40b3',
        borderRadius: 8,
    },
    phoneNumberTextInputStyle: {
        flex: 1,
        marginLeft: normalize(10),
        paddingLeft: normalize(10),
        fontSize: 16,
        fontWeight: '600',
        fontFamily: 'AvenirNext-Regular',
        color: '#000000',
        borderLeftWidth: 1.5,
    },
    warningTextStyle: {
        marginTop: normalize(20),
        fontSize: normalize(12),
        fontWeight: '400',
        fontFamily: 'AvenirNext-Regular',
        color: '#eb4335',
        textAlign: 'center',
    },
    bottomButtonContainer: {
        marginTop: 'auto',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    buttonContainer: {
        padding: normalize(13),
        top: '8%',
        marginHorizontal: normalize(-8),
        marginBottom: normalize(20),
        width: normalize(318),
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 2,
        borderColor: '#4e40b3',
        borderRadius: 8,
    },
});

export default EnterPhoneNumberScreen;
