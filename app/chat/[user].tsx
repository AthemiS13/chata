import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { Image } from 'expo-image';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { FlatList, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { KeyboardGestureArea, KeyboardStickyView, useReanimatedKeyboardAnimation } from 'react-native-keyboard-controller';
import Animated, { useAnimatedStyle } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MOCK_USERS } from '../../data/mockUsers';

import { useAuth } from '../../ctx/AuthContext';
import { useChat } from '../../ctx/ChatContext';

export default function ChatScreen() {
    const { user } = useLocalSearchParams();
    const [message, setMessage] = useState('');
    const { messages, sendMessage, getMessages } = useChat();
    const { session } = useAuth();
    const router = useRouter();
    const insets = useSafeAreaInsets();

    // Keyboard animation
    const { height, progress } = useReanimatedKeyboardAnimation();

    const currentUser = MOCK_USERS.find(u => u.username === user);
    const displayName = currentUser ? currentUser.name : user;
    const avatarUrl = currentUser ? currentUser.avatar : 'https://ui-avatars.com/api/?name=User&background=random';

    const chatMessages = getMessages(user as string);

    const handleSend = async () => {
        if (message.trim()) {
            await sendMessage(user as string, message);
            setMessage('');
        }
    };

    const animatedListStyle = useAnimatedStyle(() => ({
        marginBottom: height.value,
    }));

    const animatedInputContainerStyle = useAnimatedStyle(() => {
        return {
            // Keep padding constant to avoid jumps.
            // The offset in KeyboardStickyView will handle the positioning.
            paddingBottom: insets.bottom + 10,
        };
    });

    return (
        <View style={styles.container}>
            <Stack.Screen options={{
                headerTitle: () => (
                    <View style={styles.headerTitleContainer}>
                        <Image source={{ uri: avatarUrl }} style={styles.headerAvatar} />
                        <Text style={styles.headerName}>{displayName}</Text>
                    </View>
                ),
                headerLeft: () => (
                    <TouchableOpacity onPress={() => router.back()} style={{ paddingRight: 10, backgroundColor: 'transparent' }}>
                        <Ionicons name="chevron-back" size={28} color="#FFFFFF" />
                    </TouchableOpacity>
                ),
            }} />

            <KeyboardGestureArea style={{ flex: 1 }} interpolator="ios">
                <Animated.View style={[{ flex: 1 }, animatedListStyle]}>
                    <FlatList
                        data={chatMessages}
                        keyExtractor={(item: any) => item.id}
                        renderItem={({ item }: { item: any }) => (
                            <View style={[
                                styles.messageBubble,
                                item.sender === session ? styles.myMessage : styles.theirMessage
                            ]}>
                                <Text style={styles.messageText}>{item.text}</Text>
                                <Text style={styles.timestampText}>
                                    {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </Text>
                            </View>
                        )}
                        contentContainerStyle={styles.messageList}
                        inverted={false}
                        keyboardDismissMode="interactive"
                        keyboardShouldPersistTaps="handled"
                    />
                </Animated.View>
            </KeyboardGestureArea>

            <KeyboardStickyView offset={{ closed: 0, opened: insets.bottom }}>
                <Animated.View style={[styles.inputContainer, animatedInputContainerStyle]}>
                    <BlurView intensity={80} tint="dark" style={StyleSheet.absoluteFill} />
                    <TextInput
                        style={styles.input}
                        placeholder="Message..."
                        placeholderTextColor="#666"
                        value={message}
                        onChangeText={setMessage}
                    />
                    <TouchableOpacity onPress={handleSend} style={styles.sendButton}>
                        <Ionicons name="send" size={24} color="#FFFFFF" />
                    </TouchableOpacity>
                </Animated.View>
            </KeyboardStickyView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#0A0A0A',
    },
    keyboardAvoidingView: {
        flex: 1,
    },
    messageList: {
        padding: 20,
        paddingBottom: 10,
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 50,
    },
    placeholderText: {
        color: '#666',
        fontSize: 14,
    },
    messageBubble: {
        maxWidth: '80%',
        padding: 12,
        borderRadius: 20,
        marginBottom: 10,
    },
    myMessage: {
        alignSelf: 'flex-end',
        backgroundColor: '#27272A', // Dark Grey
        borderBottomRightRadius: 4,
    },
    theirMessage: {
        alignSelf: 'flex-start',
        backgroundColor: '#3F3F46', // Lighter Grey
        borderBottomLeftRadius: 4,
    },
    messageText: {
        color: '#FFFFFF',
        fontSize: 16,
    },
    timestampText: {
        color: '#A1A1AA',
        fontSize: 10,
        alignSelf: 'flex-end',
        marginTop: 5,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
    },
    headerTitleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    headerAvatar: {
        width: 30,
        height: 30,
        borderRadius: 15,
        marginRight: 10,
    },
    headerName: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: 'bold',
    },
    input: {
        flex: 1,
        backgroundColor: '#262626', // Instagram Dark Grey
        color: '#FFFFFF',
        borderRadius: 25, // Pill shape
        paddingHorizontal: 20,
        paddingVertical: 10,
        marginRight: 10,
        fontSize: 16,
    },
    sendButton: {
        backgroundColor: '#262626', // Dark themed button
        width: 44,
        height: 44,
        borderRadius: 22,
        justifyContent: 'center',
        alignItems: 'center',
    },
});
