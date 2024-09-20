/* eslint-disable prettier/prettier */
/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import {
    View, StyleSheet, Text, TextInput,
    TouchableOpacity, KeyboardAvoidingView, Animated,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { normalize } from '../components/theme';
import ProgressBar from '../components/ProgressBar';
import { SvgXml } from 'react-native-svg';
import { shinkLogo, shinkLogoImage, shinkTitle } from '../data/SvgImageData';
import AsyncStorage from '@react-native-async-storage/async-storage';

const EnterNameScreen = () => {
    const navigation = useNavigation();
    const [name, setName] = useState('');
    const [slideAnimationValue] = useState(new Animated.Value(0));

    useEffect(() => {
        Animated.timing(
            slideAnimationValue,
            {
                toValue: 1,
                duration: 1000, // Adjust duration as needed
                useNativeDriver: true,
            }
        ).start();
    }, []);

    const slideAnimation = {
        transform: [{
            translateY: slideAnimationValue.interpolate({
                inputRange: [0, 1],
                outputRange: [-normalize(800), 0], // Adjust value based on desired initial position and final position
            }),
        }],
    };

    const handleNextButtonPressed = () => {
        AsyncStorage.setItem('name', name);
        navigation.navigate('EnterBirthday');
    };

    const buttonTextStyle = {
        fontSize: 16,
        fontWeight: '600',
        color: '#4e40b3',
        lineHeight: 23.4,
        opacity: name !== '' ? 1 : 0.5,
    };

    return (
        <View style={styles.container}>
            <Animated.View style={[styles.circleContainer,
                slideAnimation]}>
                <View style={styles.firstCircleContainer} />
                <View style={styles.secondCircleContainer} />
                <View style={styles.thirdCircleContainer} />
                <View style={styles.fourthCircleContainer}>
                    <KeyboardAvoidingView style={styles.contentContainer}>
                        {/* <ProgressBar progress={0.15} /> */}
                        <View style={styles.logoContainer}>
                            <SvgXml xml={shinkLogoImage}
                                style={{ marginRight: normalize(10) }} />
                            <SvgXml xml={shinkTitle}
                                style={styles.shinkTitleSvgStyle} />
                        </View>
                        <Text style={styles.titleTextStyle}> What is your</Text>
                        <Text style={styles.subTitleTextStyle}> Name?</Text>
                        <TextInput underlineColorAndroid="transparent"
                            placeholder="Name"
                            placeholderTextColor={'#979797'}
                            value={name}
                            onChangeText={(text) => setName(text)}
                            style={styles.textInputStyle} />
                        <View style={styles.bottomButtonContainer}>
                            <TouchableOpacity onPress={() => handleNextButtonPressed()}
                                style={styles.buttonContainer}
                                disabled={!name}>
                                <Text style={buttonTextStyle}>Next</Text>
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
        width: '40%',
        alignItems: 'left',
        justifyContent: 'center',
    },
    logoContainer: {
        marginTop: normalize(-10),
        marginBottom: normalize(30),
        flexDirection: 'row',
        alignItems: 'center',
        alignSelf: 'center',
    },
    shinkTitleSvgStyle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#000000',
    },
    titleTextStyle: {
        marginTop: normalize(30),
        fontSize: 30,
        fontWeight: 'bold',
        color: '#4e40b3',
    },
    subTitleTextStyle: {
        fontSize: 40,
        fontWeight: 'bold',
        color: '#4e40b3',
    },
    textInputStyle: {
        paddingHorizontal: normalize(11),
        paddingVertical: normalize(11),
        marginTop: normalize(23),
        marginBottom: normalize(80),
        marginRight: normalize(5),
        width: '90%',
        alignSelf: 'center',
        fontSize: 16,
        fontWeight: '600',
        fontFamily: 'AvenirNext-Regular',
        color: '#000000',
        lineHeight: 24,
        borderTopWidth: 0,
        borderLeftWidth: 0,
        borderRightWidth: 0,
        borderBottomWidth: 1.5,
        borderColor: '#979797',
        borderRadius: 5,
    },
    bottomButtonContainer: {
        paddingHorizontal: normalize(20),
        marginTop: 'auto',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    buttonContainer: {
        padding: normalize(13),
        width: normalize(275),
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#ffffff',
        borderWidth: 2,
        borderColor: '#4e40b3',
        borderRadius: 8,
    },
});

export default EnterNameScreen;
