import { Link, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import ChataLogo from '../../assets/images/chata_logo.svg';
import { useAuth } from '../../ctx/AuthContext';

export default function LoginScreen() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const { signIn } = useAuth();
    const router = useRouter();

    async function handleSignIn() {
        setLoading(true);
        try {
            await signIn(username, password);
        } catch (error) {
            Alert.alert('Error', 'Invalid credentials');
        } finally {
            setLoading(false);
        }
    }

    return (
        <View style={styles.container}>
            <View style={styles.logoContainer}>
                {/* Using the logo asset provided by the user */}
                <ChataLogo width={120} height={120} />
            </View>

            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.input}
                    placeholder="Username"
                    placeholderTextColor="#666"
                    value={username}
                    onChangeText={setUsername}
                    autoCapitalize="none"
                />
                <TextInput
                    style={styles.input}
                    placeholder="Password"
                    placeholderTextColor="#666"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                />
            </View>

            <TouchableOpacity style={styles.button} onPress={handleSignIn} disabled={loading}>
                <Text style={styles.buttonText}>{loading ? 'Loading...' : 'Log In'}</Text>
            </TouchableOpacity>

            <Link href="/forgot-password" asChild>
                <TouchableOpacity style={styles.linkButton}>
                    <Text style={styles.linkText}>Forgot Password?</Text>
                </TouchableOpacity>
            </Link>

            <View style={styles.footer}>
                <Text style={styles.footerText}>Don't have an account? </Text>
                <Link href="/sign-up" asChild>
                    <TouchableOpacity>
                        <Text style={styles.signUpText}>Sign Up</Text>
                    </TouchableOpacity>
                </Link>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#0A0A0A',
        justifyContent: 'center',
        padding: 20,
    },
    logoContainer: {
        alignItems: 'center',
        marginBottom: 50,
    },
    appName: {
        color: '#FFFFFF',
        fontSize: 24,
        fontWeight: 'bold',
        marginTop: 10,
        letterSpacing: 2,
    },
    inputContainer: {
        marginBottom: 20,
    },
    input: {
        backgroundColor: '#18181B',
        color: '#FFFFFF',
        padding: 15,
        borderRadius: 10,
        marginBottom: 15,
        fontSize: 16,
    },
    button: {
        backgroundColor: '#FFFFFF',
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
        marginBottom: 15,
    },
    buttonText: {
        color: '#000000',
        fontSize: 16,
        fontWeight: 'bold',
    },
    linkButton: {
        alignItems: 'center',
        marginBottom: 30,
    },
    linkText: {
        color: '#888888',
        fontSize: 14,
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'center',
    },
    footerText: {
        color: '#888888',
        fontSize: 14,
    },
    signUpText: {
        color: '#FFFFFF',
        fontSize: 14,
        fontWeight: 'bold',
    },
});
