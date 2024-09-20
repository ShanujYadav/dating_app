/* eslint-disable prettier/prettier */
/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import {
    View, Text, StyleSheet, TouchableOpacity, Modal,
    TextInput, KeyboardAvoidingView, Keyboard, Animated,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { normalize } from '../components/theme';
import { format } from 'date-fns';
import { SvgXml } from 'react-native-svg';
import { shinkLogoImage, shinkTitle } from '../data/SvgImageData';
import AsyncStorage from '@react-native-async-storage/async-storage';

const EnterBirthdayScreen = () => {
    const navigation = useNavigation();
    const [day, setDay] = useState('');
    const [month, setMonth] = useState('');
    const [year, setYear] = useState('');
    const [age, setAge] = useState(null);
    const [showPopup, setShowPopup] = useState(false);
    const [borderColor, setBorderColor] = useState('#979797');
    const [birthDate, setBirthDate] = useState('');
    const [slideAnimatedValue] = useState(new Animated.Value(0));

    useEffect(() => {
        Animated.timing(
            slideAnimatedValue,
            {
                toValue: 1,
                duration: 1000, // Adjust duration as needed
                useNativeDriver: true,
            }
        ).start();
    }, []);

    const slideAnimation = {
        transform: [{
            translateY: slideAnimatedValue.interpolate({
                inputRange: [0, 1],
                outputRange: [-normalize(800), 0], // Adjust value based on desired initial position and final position
            }),
        }],
    };

    useEffect(() => {
        if (showPopup) {
            Keyboard.dismiss();
        }
    }, [showPopup]);

    const handleConfirmButtonPressed = () => {
        setShowPopup(false);
        if (age < 18) {
            navigation.navigate('Under18Age');
        } else {
            AsyncStorage.setItem('birthDate', birthDate);
            navigation.navigate('LocationAccess');
        }
    };

    const handleClosePopup = () => {
        setShowPopup(false);
    };

    const handleNextButtonPressed = () => {
        if (day === '' || month === '' || year === '') {
            setBorderColor('rgba(256, 0, 0, 0.5)');
            return;
        }
        setBorderColor('#979797');
        const currentDate = new Date();
        const calculatedage = currentDate.getFullYear() - parseInt(year, 10);
        setAge(calculatedage);
        const calculatedBirthDate = format(new Date(Number(year),
            Number(month - 1), Number(day)),
            'yyyy-MM-dd');
        setBirthDate(calculatedBirthDate);
        setShowPopup(true);
    };

    console.log(birthDate);

    const buttonTextStyle = {
        fontSize: 16,
        fontWeight: '600',
        color: '#4e40b3',
        lineHeight: 23.4,
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
                        <View style={styles.logoContainer}>
                            <SvgXml xml={shinkLogoImage}
                                style={{ marginRight: normalize(10) }} />
                            <SvgXml xml={shinkTitle}
                                style={styles.shinkTitleSvgStyle} />
                        </View>
                        <Text style={styles.titleTextStyle}>When is your</Text>
                        <Text style={styles.subTitleTextStyle}>Birthday?</Text>
                        <Text style={styles.textStyle}>
                            Shink shares ONLY your age. Birthdays can not be changed once
                            confirmed.
                        </Text>
                        <View style={styles.inputContainer}>
                            <View style={styles.inputSubContainer}>
                                <TextInput placeholder="DD"
                                    placeholderTextColor={'#a29bd1'}
                                    keyboardType="numeric"
                                    maxLength={2}
                                    value={day}
                                    onChangeText={(text) => setDay(text)}
                                    style={styles.textInputStyle} />
                                <TextInput placeholder="MM"
                                    placeholderTextColor={'#a29bd1'}
                                    keyboardType="numeric"
                                    maxLength={2}
                                    value={month}
                                    onChangeText={(text) => setMonth(text)}
                                    style={styles.textInputStyle} />
                            </View>
                            <TextInput placeholder="YYYY"
                                placeholderTextColor={'#a29bd1'}
                                keyboardType="numeric"
                                maxLength={4}
                                value={year}
                                onChangeText={(text) => setYear(text)}
                                style={styles.textInputStyle} />
                        </View>
                        <View style={styles.bottomButtonContainer}>
                            <TouchableOpacity onPress={() => handleNextButtonPressed()}
                                style={styles.buttonContainer}
                                disabled={(day === '' || month === '' || year === '')}>
                                <Text style={buttonTextStyle}>Next</Text>
                            </TouchableOpacity>
                        </View>
                    </KeyboardAvoidingView>
                </View>
            </Animated.View>
            <Modal animationType="slide"
                transparent={true}
                visible={showPopup}
                onRequestClose={() => setShowPopup(false)}>
                <Animated.View style={[styles.modalCircleContainer,
                    slideAnimation]}>
                    <View style={styles.firstCircleContainer} />
                    <View style={styles.secondCircleContainer} />
                    <View style={styles.thirdCircleContainer} />
                    <View style={styles.fourthCircleContainer}>
                        <View style={styles.popupContainer}>
                            <View style={styles.popupContentContainer}>
                                <Text style={styles.popupTitleTextStyle}>Are you</Text>
                                <Text style={styles.popupAgeTextStyle}>{age}</Text>
                                <Text style={styles.popupTextStyle}>years old</Text>
                                <Text style={styles.popupSubtitleTextStyle}>
                                    IMPORTANT: Birthdays can not be changed once confirmed.
                                </Text>
                                <View style={styles.popupButtonsContainer}>
                                    <TouchableOpacity onPress={() => handleClosePopup()}
                                        style={styles.popupChangeButtonContainer}>
                                        <Text style={styles.popupChangeButtonTextStyle}>Change</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={() => handleConfirmButtonPressed()}
                                        style={styles.popupButtonContainer}>
                                        <Text style={styles.popupButtonTextStyle}>Confirm</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                    </View>
                </Animated.View>
            </Modal>
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
    modalCircleContainer: {
        position: 'relative',
        marginTop: '80%',
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
        fontWeight: '400',
        color: '#4e40b3',
    },
    subTitleTextStyle: {
        fontSize: 40,
        fontWeight: '800',
        color: '#4e40b3',
    },
    textStyle: {
        marginTop: normalize(12),
        marginBottom: normalize(12),
        fontSize: 14,
        fontFamily: 'AvenirNext-Regular',
        color: '#282c3f',
        textAlign: 'left',
        lineHeight: 21,
    },
    subTextStyle: {
        marginTop: normalize(12),
        marginBottom: normalize(12),
        fontSize: 14,
        fontFamily: 'AvenirNext-Regular',
        color: '#282C3F',
        textAlign: 'left',
        lineHeight: 21,
    },
    inputContainer: {
        marginTop: normalize(10),
        marginLeft: normalize(5),
        marginBottom: normalize(80),
        width: '80%',
        flexDirection: 'row',
        gap: normalize(10),
    },
    inputSubContainer: {
        width: '60%',
        flexDirection: 'row',
        gap: normalize(10),
    },
    textInputStyle: {
        flex: 1,
        marginRight: normalize(5),
        paddingLeft: normalize(15),
        fontSize: 16,
        fontWeight: '600',
        fontFamily: 'AvenirNext-Regular',
        color: '#000000',
        lineHeight: 24,
        borderTopWidth: 0,
        borderLeftWidth: 0,
        borderRightWidth: 0,
        borderBottomWidth: 1,
        borderColor: '#4e40b3',
    },
    popupContainer: {
        flex: 1,
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#e2ebff',
        borderRadius: 1000, // Set a large value for borderRadius to create a curved border
    },
    popupContentContainer: {
        marginBottom: '50%',
        width: '40%',
        alignItems: 'left',
        justifyContent: 'center',
    },
    popupTitleTextStyle: {
        marginBottom: normalize(5),
        fontSize: 40,
        fontWeight: '600',
        color: '#4e40b3',
        textAlign: 'center',
    },
    popupAgeTextStyle: {
        marginBottom: 5,
        fontSize: 80,
        fontWeight: '800',
        color: '#4e40b3',
        textAlign: 'center',
    },
    popupTextStyle: {
        fontSize: 20,
        fontWeight: '300',
        color: '#4e40b3',
        textAlign: 'center',
    },
    popupSubtitleTextStyle: {
        marginTop: '8%',
        marginLeft: normalize(15),
        fontSize: 13,
        fontWeight: '400',
        fontFamily: 'AvenirNext-Regular',
        color: '#666666',
        textAlign: 'left',
        lineHeight: 21,
    },
    popupButtonsContainer: {
        marginTop: normalize(28),
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'center',
    },
    popupChangeButtonContainer: {
        paddingVertical: normalize(12),
        paddingHorizontal: normalize(16),
        marginRight: normalize(15),
        width: normalize(138),
        alignSelf: 'center',
        backgroundColor: 'transparent',
        borderWidth: 2,
        borderColor: '#4e40b3',
        borderRadius: normalize(5),
    },
    popupButtonContainer: {
        paddingVertical: normalize(13),
        paddingHorizontal: normalize(18),
        width: normalize(139),
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#4e40b3',
        borderRadius: 5,
    },
    popupChangeButtonTextStyle: {
        fontSize: normalize(14),
        fontWeight: '500',
        fontFamily: 'AvenirNext-Bold',
        color: '#4e40b3',
        textAlign: 'center',
        lineHeight: 16,
    },
    popupButtonTextStyle: {
        fontSize: normalize(13.5),
        fontWeight: '400',
        fontFamily: 'AvenirNext-Bold',
        color: '#ffffff',
        textAlign: 'center',
        lineHeight: 16,
    },
    bottomButtonContainer: {
        paddingHorizontal: normalize(5),
        marginTop: 'auto',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    buttonContainer: {
        padding: normalize(13),
        width: normalize(300),
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#ffffff',
        borderWidth: 2,
        borderColor: '#4e40b3',
        borderRadius: 8,
    },
});

export default EnterBirthdayScreen;
