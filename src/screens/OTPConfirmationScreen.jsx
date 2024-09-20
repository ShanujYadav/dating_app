/* eslint-disable prettier/prettier */
/* eslint-disable react/self-closing-comp */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
/* eslint-disable react-native/no-inline-styles */
import React, { useEffect, useState } from 'react';
import {
    StyleSheet, Text, View, Animated,
    TouchableOpacity, KeyboardAvoidingView, Easing,
} from 'react-native';
// import { confirmSignUp } from 'aws-amplify/auth';
import { useNavigation } from '@react-navigation/native';
import { SvgXml } from 'react-native-svg';
import { shinkLogo, shinkTitle } from '../data/SvgImageData';
import theme, { normalize } from '../components/theme';
import ProgressBar from '../components/ProgressBar';
import OTPTextInput from 'react-native-otp-textinput';
import Loader from 'react-native-modal-loader';

export default function OTPScreen({ route }) {
    const navigation = useNavigation();
    const { phoneNumber, countryCode } = route.params;
    const [otp, setOtp] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isOTPTrue, setIsOTPTrue] = useState(true);
    const [errorMessage, setErrorMessage] = useState();
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [timer, setTimer] = useState(30);
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

    useEffect(() => {
        console.log(otp);
    }, [otp]);

    async function handleSignUpConfirmation() {
        navigation.navigate('EnterName');
    }

    // async function handleSignUpConfirmation() {
    //     setIsLoading(true);
    //     const username = countryCode + phoneNumber;
    //     try {
    //         const { isSignUpComplete, nextStep } = await confirmSignUp({
    //             username: username,
    //             confirmationCode: otp
    //         });
    //         if (isSignUpComplete) {
    //             console.log('Sign up complete');
    //             setIsAuthenticated(true);
    //             setIsLoading(false);
    //             setIsOTPTrue(true);
    //             navigation.navigate('LocationAccess');
    //         } else {
    //             console.log('Next step...', nextStep);
    //         }
    //     } catch (error) {
    //         setIsLoading(false);
    //         setIsOTPTrue(false);
    //         console.log('Error while confirming sign up: ', error);
    //         setErrorMessage(error.message);
    //     }
    // }

    useEffect(() => {
        let interval;
        if (timer > 0) {
            interval = setInterval(() => {
                setTimer((prevTimer) => prevTimer - 1);
            }, 1000);
        }
        return () => {
            clearInterval(interval);
        };
    }, [timer]);

    const formatTimer = (time) => {
        return time.toString().padStart(2, '0');
    };

    const resendOTP = () => {
        setTimer(30);
    };

    const buttonTextStyle = {
        fontSize: 16,
        fontWeight: '600',
        color: '#4e40b3',
        lineHeight: 23.4,
        opacity: otp !== '' ? 1 : 0.5,
    };

    return (
        <View style={styles.container}>
            {/* <ProgressBar progress={0.1} /> */}
            {/* <Loader loading={isLoading} color={'#9d4edd'} /> */}
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
                    <View style={styles.contentContainer}>
                        {/* <Text style={[styles.subTitleTextStyle, { color: '#979797' }]}>OTP sent to <Text
                    style={[styles.subTitleTextStyle, { color: '#9d4edd' }]}>
                    {countryCode}-{phoneNumber}</Text></Text> */}
                        <View style={styles.logoContainer}>
                            <SvgXml xml={shinkLogo}
                                style={styles.shinkLogo} />
                            <SvgXml xml={shinkTitle}
                                style={styles.shinkTitleSvgStyle} />
                            <Text style={styles.subTitleTextStyle}>Someone for Everyone.</Text>
                        </View>
                        <Text style={styles.titleTextStyle}>OTP?</Text>
                        <View style={{ marginHorizontal: normalize(-5) }}>
                            <OTPTextInput
                                handleTextChange={e => setOtp(e)}
                                textInputStyle={[styles.textInputStyle, {
                                    backgroundColor: isOTPTrue ? '#eef1f8' : '#000000',
                                }]}
                                tintColor={isOTPTrue ? '#4e40b3' : '#eb4335'}
                                offTintColor={'transparent'}
                                inputCount={6} />
                        </View>
                        {isOTPTrue ? null : <Text style={styles.Warning}>{errorMessage}</Text>}
                        {timer > 0
                            ? <Text style={[styles.resendOTPTextStyle, {
                                marginLeft: normalize(8), color: '#979797',
                            }]}>
                                Resend OTP in <Text style={[styles.resendOTPTextStyle,
                                { marginLeft: normalize(5), color: '#9d4edd' }]}>
                                    00:{formatTimer(timer)}</Text></Text>
                            : <View style={{
                                marginHorizontal: normalize(55), display: 'flex', flexDirection: 'row',
                                alignItems: 'center', justifyContent: 'space-between',
                            }}>
                                {/* <Text style={[styles.textStyle, {
                                    fontFamily: 'AvenirNext-Regular', color: '#979797',
                                }]}>
                                    Didn't received OTP?</Text>
                                <TouchableOpacity onPress={() => resendOTP()}>
                                    <Text style={[styles.textStyle,
                                    {
                                        fontSize: normalize(14), fontFamily: 'AvenirNext-Regular',
                                        color: '#354e66',
                                    }]}>RESEND OTP</Text>
                                </TouchableOpacity> */}
                            </View>
                        }
                        <View style={styles.bottomButtonContainer}>
                            <TouchableOpacity onPress={() => handleSignUpConfirmation()}
                                style={[styles.buttonContainer,
                                { backgroundColor: otp ? '#ffffff' : '#ffffff' }]}
                                disabled={!otp}>
                                <Text style={buttonTextStyle}>Next</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Animated.View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#a69bea',
    },
    circleContainer: {
        flex: 1,
        position: 'relative',
        marginTop: '50%',
        alignItems: 'center',
        justifyContent: 'center',
    },
    firstCircleContainer: {
        position: 'absolute',
        width: normalize(950),
        height: normalize(950),
        backgroundColor: '#c6bdfe',
        borderRadius: normalize(800),
        zIndex: -4,
    },
    secondCircleContainer: {
        position: 'absolute',
        width: normalize(900),
        height: normalize(900),
        backgroundColor: '#cdd2fe',
        borderRadius: normalize(700),
        zIndex: -3,
    },
    thirdCircleContainer: {
        position: 'absolute',
        width: normalize(850),
        height: normalize(850),
        backgroundColor: '#e0e9ff',
        borderRadius: normalize(600),
        zIndex: -2,
    },
    fourthCircleContainer: {
        width: normalize(800),
        height: normalize(800),
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#fafafa',
        borderRadius: normalize(500),
        zIndex: -1,
    },
    contentContainer: {
        marginBottom: 'auto',
        width: '40%',
        alignItems: 'left',
        justifyContent: 'center',
    },
    logoContainer: {
        top: '12%',
        alignItems: 'center',
    },
    shinkTitleSvgStyle: {
        top: normalize(-40),
        marginTop: normalize(60),
        width: normalize(116),
        height: normalize(116),
        alignSelf: 'center',
    },
    subTitleTextStyle: {
        marginTop: normalize(-40),
        fontSize: 12,
        fontWeight: '800',
        fontFamily: 'AvenirNext-Regular',
        color: '#4e40b3',
        textAlign: 'center',
        lineHeight: 21,
    },
    titleTextStyle: {
        marginTop: normalize(100),
        marginLeft: normalize(5),
        fontSize: 15,
        fontWeight: '400',
        color: '#4e40b3',
        lineHeight: 23,
    },
    // subTitleTextStyle: {
    //     marginTop: normalize(25),
    //     marginBottom: normalize(17),
    //     marginLeft: normalize(15),
    //     fontSize: normalize(13.8),
    //     fontWeight: '400',
    //     fontFamily: 'AvenirNext-Regular',
    //     lineHeight: 21,
    // },
    textInputStyle: {
        width: normalize(45),
        height: normalize(45),
        fontSize: normalize(20),
        fontFamily: 'AvenirNext-Regular',
        color: '#171724',
        borderWidth: normalize(2),
        borderBottomWidth: normalize(2),
        borderRadius: normalize(10),
    },
    warningTextStyle: {
        marginTop: normalize(20),
        fontSize: normalize(12),
        fontWeight: '400',
        fontFamily: 'AvenirNext-Regular',
        color: '#eb4335',
        textAlign: 'center',
    },
    resendOTPTextStyle: {
        marginTop: normalize(28),
        marginBottom: normalize(20),
        fontSize: normalize(14),
        fontWeight: '400',
        fontFamily: 'AvenirNext-Regular',
        lineHeight: 21,
    },
    textStyle: {
        marginTop: normalize(28),
        marginBottom: normalize(20),
        fontWeight: '400',
    },
    bottomButtonContainer: {
        paddingHorizontal: normalize(1),
        marginTop: 'auto',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    buttonContainer: {
        padding: normalize(13),
        top: '8%',
        marginBottom: normalize(20),
        width: normalize(300),
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 2,
        borderColor: '#4e40b3',
        borderRadius: 8,
    },
});
