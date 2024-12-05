import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, StatusBar } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

const ForgetPasswordScreen = ({ navigation }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPass, setConfirmPass] = useState('');

    return (
        <>
            <StatusBar backgroundColor={"#a53583"} />
            <View style={styles.container}>
                <LinearGradient
                    colors={['#a53583', '#fe3c76', '#fe7e68']}
                    style={styles.logoContainer}
                >
                    {/* <View style={styles.logoContainer}> */}
                    <Text style={styles.logoText}>Taste Perfect</Text>
                    {/* </View> */}
                </LinearGradient>
                {/* <View style={styles.authContainer}> */}
                <View style={styles.formContainer}>
                    <TextInput
                        style={styles.input}
                        placeholder="Email address"
                        placeholderTextColor="#888"
                        keyboardType="email-address"
                        value={email}
                        onChangeText={setEmail}
                    />

                    <TouchableOpacity onPress={() => {}}>
                        <Text style={styles.getOtp}>Get Otp</Text>
                    </TouchableOpacity>

                    <TextInput
                        style={styles.input}
                        placeholder="Enter password"
                        placeholderTextColor="#888"
                        secureTextEntry
                        value={password}
                        onChangeText={setPassword}
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="Confirm password"
                        placeholderTextColor="#888"
                        secureTextEntry
                        value={confirmPass}
                        onChangeText={setConfirmPass}
                    />

                    {/* Submit Button */}
                    <TouchableOpacity style={styles.submitButton}>
                        <Text style={styles.submitButtonText}>Change Password</Text>
                    </TouchableOpacity>
                </View>

                {/* </View> */}
            </View>
        </>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f1f2', // Background color gradient can be added
        alignItems: 'center',
        justifyContent: 'center',
    },
    logoContainer: {
        position: 'absolute',
        top: 0,
        marginBottom: 40,
        alignItems: 'center',
        height: '50%',
        width: '100%',
        borderBottomLeftRadius: 20, //
        borderBottomRightRadius: 20, //
        backgroundColor: 'red',
        justifyContent: 'center',
    },
    logoText: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#fff',
    },
    formContainer: {
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 20,
        width: '90%',
        maxWidth: 350,
        elevation: 5,
    },
    input: {
        height: 50,
        borderColor: '#ddd',
        borderBottomWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 10,
        marginBottom: 15,
        color: '#333',
    },
    getOtp: {
        textAlign: 'right',
        color: '#f75454',
        marginBottom: 5,
    },
    submitButton: {
        backgroundColor: '#e02738',
        borderRadius: 50,
        paddingVertical: 15,
        alignItems: 'center',
    },
    submitButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default ForgetPasswordScreen;
