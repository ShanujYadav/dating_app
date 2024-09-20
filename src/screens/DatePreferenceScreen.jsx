/* eslint-disable prettier/prettier */
/* eslint-disable react-native/no-inline-styles */
import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { normalize } from '../components/theme';
import { shinkLogoImage, shinkTitle } from '../data/SvgImageData';
import { SvgXml } from 'react-native-svg';
import AsyncStorage from '@react-native-async-storage/async-storage';

const DatePreferenceScreen = ({ route }) => {
    const navigation = useNavigation();
    const [selectedOption, setSelectedOption] = useState(null);
    const { isUpdatingFromMyInfoScreen } = route.params || false;

    // Function to fetch user's date preference gender
    const fetchUserDatePreferenceGender = async () => {
        const GET_USER_DATEPREFERENCEGENDER_QUERY = `
          query GetUserDatePreferenceGender($userId: String!) {
            getShinkUser(userId: $userId) {
              DatePreferenceGender
            }
          }
        `;
        try {
            const response = await fetch('https://6zdkqxsh5nb57gljtisvt3rxre.appsync-api.ap-south-1.amazonaws.com/graphql', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-api-key': 'da2-57ucyh6ccbgonledllncb5x47e',
                },
                body: JSON.stringify({
                    query: GET_USER_DATEPREFERENCEGENDER_QUERY,
                    variables: { userId: '8' },
                }),
            });
            const data = await response.json();
            console.log('Raw API Response: ', data);
            if (data && data.data && data.data.getShinkUser !== null) {
                const userDatePreferenceGender = data.data.getShinkUser.DatePreferenceGender;
                setSelectedOption(userDatePreferenceGender);
            } else {
                console.error('Invalid data format in the API response or user not found');
            }
        } catch (error) {
            console.error('Error while fetching user date preference gender: ', error);
        }
    };

    // Fetch user's date preference gender when the component mounts
    useEffect(() => {
        fetchUserDatePreferenceGender();
    }, []);

    const handleOptionButtonPressed = (option) => {
        setSelectedOption(option);
    };

    const updateDatePreferenceGender = async () => {
        const UPDATE_USER_DATEPREFERENCEGENDER_MUTATION = `
            mutation UpdateUserDatePreferenceGender($userId: String!, $datePreferenceGender: String!) {
                updateShinkUser(input: { userId: $userId, DatePreferenceGender: $datePreferenceGender }) {
                    userId
                    DatePreferenceGender
                }
            }
        `;
        try {
            const response = await fetch('https://6zdkqxsh5nb57gljtisvt3rxre.appsync-api.ap-south-1.amazonaws.com/graphql', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-api-key': 'da2-kzjqngazhngz7blym6iljtphny',
                },
                body: JSON.stringify({
                    query: UPDATE_USER_DATEPREFERENCEGENDER_MUTATION,
                    variables: { userId: '8', DatePreferenceGender: selectedOption },
                }),
            });
            const data = await response.json();
            console.log('API Response: ', data);
        } catch (error) {
            console.error('Error while updating user date preference gender: ', error);
        }
    };

    const handleNextButtonPressed = () => {
        if (selectedOption) {
            updateDatePreferenceGender();
            AsyncStorage.setItem('datePreferenceGender', selectedOption);
            if (isUpdatingFromMyInfoScreen) {
                // If updating from MyInfoScreen, navigate back to MyInfoScreen
                navigation.navigate('MyInfo');
            } else {
                // Otherwise, navigate to RelationshipPreference
                AsyncStorage.setItem('datePreferenceGender', selectedOption);
                navigation.navigate('YourRelationship', { selectedOption });
            }
        }
    };

    const buttonTextStyle = {
        fontSize: 16,
        fontWeight: '600',
        color: '#4e40b3',
        lineHeight: 23.4,
    };

    return (
        <View style={styles.container}>
            {/* <ScrollView contentContainerStyle={styles.contentContainer}>
                {renderOption('Men')}
                {renderOption('Women')}
                {renderOption('Transgender')}
                {renderOption('Nonbinary people')}
                {renderOption('Everyone')}
            </ScrollView> */}
            {/* <View style={styles.headerButtonContainer}>
                <TouchableOpacity onPress={() => handlePreviousButtonPressed()}
                    style={styles.previousButtonContainer}>
                    <Image source={require('../assets/images/left-arrow.png')}
                        style={styles.imageStyle} />
                </TouchableOpacity>
                <View style={[styles.lineStyle, { right: 0 }]} />
            </View> */}
            {/* <View style={styles.bottomButtonContainer}>
                <TouchableOpacity onPress={() => handleNextButtonPressed()}
                    style={[styles.buttonContainer,
                    { backgroundColor: selectedOption ? '#9d4edd' : '#e0e0e0' }]}
                    disabled={!selectedOption}>
                    <Text style={buttonTextStyle}>Next</Text>
                </TouchableOpacity>
            </View> */}
            <View style={styles.circleContainer}>
                <View style={styles.firstCircleContainer} />
                <View style={styles.secondCircleContainer} />
                <View style={styles.thirdCircleContainer} />
                <View style={styles.fourthCircleContainer}>
                    <View style={styles.logoContainer}>
                        <SvgXml xml={shinkLogoImage}
                            style={{ marginRight: normalize(10) }} />
                        <SvgXml xml={shinkTitle}
                            style={styles.shinkTitleSvgStyle} />
                    </View>
                    <Text style={styles.titleTextStyle}>What is your</Text>
                    <Text style={styles.subTitleTextStyle}>Looking For?</Text>
                    {renderOption('Men')}
                    {renderOption('Women')}
                    {renderOption('Transgender')}
                    {renderOption('Nonbinary people')}
                    {renderOption('Everyone')}
                    <TouchableOpacity onPress={() => handleNextButtonPressed()}
                        style={styles.buttonContainer}>
                        <Text style={buttonTextStyle}>Next</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );

    function renderOption(option) {
        return (
            // <TouchableOpacity onPress={() => handleOptionButtonPressed(option)}
            //     style={styles.optionItemStyle}>
            //     <Text style={styles.optionItemTextStyle}>{option}</Text>
            //     <View style={styles.radioButtonContainer}>
            //         <View style={styles.radioButtonSubContainer}>
            //             {selectedOption === option &&
            //                 <View style={styles.innerCircleStyle} />}
            //         </View>
            //     </View>
            // </TouchableOpacity>
            <TouchableOpacity onPress={() => handleOptionButtonPressed(option)}
                style={[styles.optionItemStyle, selectedOption !== option ?
                    { backgroundColor: '#e0e9ff' } : { backgroundColor: '#4e40b3' }]}>
                <Text style={[styles.optionItemTextStyle, selectedOption !== option ?
                    { color: '#282c3f' } : { color: '#ffffff' }]}>{option}</Text>
                {/* {option === 'Other' ? (
                    <View style={{ marginLeft: 'auto' }}>
                        <Text style={{ color: '#000000' }}>{'>'}</Text>
                    </View>
                ) : (
                    <View style={styles.radioButtonContainer}>
                        <View style={styles.radioButtonSubContainer}>
                            {selectedOption === option &&
                                <View style={styles.innerCircleStyle} />}
                        </View>
                    </View>
                )} */}
            </TouchableOpacity>
        );
    }
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: normalize(0),
        justifyContent: 'flex-start',
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
        marginBottom: normalize(20),
        marginTop: normalize(50),
        flexDirection: 'row',
        alignSelf: 'center',
    },
    shinkTitleSvgStyle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#000000',
    },
    titleTextStyle: {
        marginRight: normalize(140),
        fontSize: normalize(30),
        fontWeight: '400',
        color: '#4e40b3',
        textAlign: 'left',
    },
    subTitleTextStyle: {
        marginTop: normalize(5),
        marginRight: normalize(70),
        fontSize: normalize(40),
        fontWeight: '800',
        fontFamily: 'AvenirNext-Regular',
        color: '#4e40b3',
        textAlign: 'left',
        lineHeight: 45,
    },
    contentContainer: {
        paddingBottom: normalize(80),
        flexGrow: 1,
        alignItems: 'center',
        justifyContent: 'flex-start',
    },
    // titleTextStyle: {
    //     marginTop: normalize(25),
    //     marginLeft: normalize(15),
    //     marginBottom: normalize(15),
    //     fontSize: 32,
    //     fontWeight: 'bold',
    //     color: '#000000',
    //     lineHeight: 42,
    // },
    headerButtonContainer: {
        position: 'absolute',
        padding: normalize(5),
        top: normalize(0),
        left: normalize(0),
        right: normalize(20),
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        backgroundColor: '#f5f7f9',
    },
    previousButtonContainer: {
        padding: normalize(10),
        backgroundColor: 'transparent',
        borderRadius: 10,
    },
    imageStyle: {
        width: normalize(18),
        height: normalize(18),
        tintColor: '#000000',
    },
    bottomButtonContainer: {
        paddingHorizontal: normalize(20),
        marginTop: 'auto',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    // buttonContainer: {
    //     padding: normalize(13),
    //     marginBottom: normalize(20),
    //     width: '100%',
    //     alignItems: 'center',
    //     justifyContent: 'center',
    //     borderRadius: 5,
    // },
    // optionItemStyle: {
    //     padding: normalize(12),
    //     // marginLeft: normalize(15),
    //     marginVertical: normalize(6),
    //     width: '90%',
    //     flexDirection: 'row',
    //     alignItems: 'center',
    //     borderWidth: 1,
    //     borderColor: '#b3b3b3',
    //     borderRadius: 5,
    // },
    radioButtonContainer: {
        flex: 1,
        alignItems: 'flex-end',
    },
    radioButtonSubContainer: {
        marginRight: normalize(10),
        height: normalize(20),
        width: normalize(20),
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 2,
        borderColor: 'grey',
        borderRadius: 12,
    },
    innerCircleStyle: {
        height: normalize(12),
        width: normalize(12),
        backgroundColor: 'grey',
        borderRadius: 6,
    },
    lineStyle: {
        top: normalize(18),
        marginRight: 'auto',
        height: normalize(8),
        width: '40%',
        backgroundColor: '#9d4edd',
        opacity: 0.8,
    },
    // optionItemTextStyle: {
    //     fontSize: 15,
    //     fontWeight: '500',
    //     // fontFamily: 'AvenirNext-Bold',
    //     color: '#282c3f',
    //     lineHeight: 21,
    // },
    optionItemStyle: {
        paddingHorizontal: normalize(10),
        paddingVertical: normalize(13),
        marginVertical: normalize(6),
        width: normalize(310),
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 8,
    },
    optionItemTextStyle: {
        fontSize: 16,
        fontWeight: '500',
        // fontFamily: 'AvenirNext-Bold',
        lineHeight: 21,
    },
    buttonContainer: {
        padding: normalize(12),
        marginTop: normalize(15),
        width: normalize(310),
        alignItems: 'center',
        alignSelf: 'center',
        justifyContent: 'center',
        backgroundColor: '#ffffff',
        borderWidth: 2,
        borderColor: '#4e40b3',
        borderRadius: 8,
    },
});

export default DatePreferenceScreen;
