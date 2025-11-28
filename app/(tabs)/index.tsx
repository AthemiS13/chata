import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useFocusEffect, useRouter } from 'expo-router';
import { useCallback, useState } from 'react';
import { FlatList, Modal, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MOCK_USERS } from '../../data/mockUsers';

import { useChat } from '../../ctx/ChatContext';

export default function MessagesScreen() {
    const [modalVisible, setModalVisible] = useState(false);
    const [recipient, setRecipient] = useState('');
    const router = useRouter();
    const { getConversations } = useChat();

    const [activeChats, setActiveChats] = useState<any[]>([]);

    useFocusEffect(
        useCallback(() => {
            setActiveChats(getConversations());
        }, [getConversations])
    );

    const startChat = () => {
        const trimmedRecipient = recipient.trim().toLowerCase();
        if (trimmedRecipient) {
            const userExists = MOCK_USERS.find(u => u.username.toLowerCase() === trimmedRecipient);

            if (userExists) {
                setModalVisible(false);
                router.push(`/chat/${userExists.username}`);
                setRecipient('');
                // In a real app, you'd add this user to activeChats if not already there
            } else {
                alert('User not found');
            }
        }
    };

    const openChat = (username: string) => {
        router.push(`/chat/${username}`);
    };

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <View style={styles.header}>
                <Text style={styles.title}>Messages</Text>
                <TouchableOpacity onPress={() => setModalVisible(true)}>
                    <Ionicons name="add-circle-outline" size={28} color="#FFFFFF" />
                </TouchableOpacity>
            </View>

            <FlatList
                data={activeChats}
                keyExtractor={(item) => item.user?.username || 'unknown'}
                renderItem={({ item }) => (
                    <TouchableOpacity style={styles.chatItem} onPress={() => openChat(item.user?.username || '')}>
                        <Image source={{ uri: item.user?.avatar }} style={styles.avatar} />
                        <View style={styles.chatInfo}>
                            <View style={styles.chatHeader}>
                                <Text style={styles.chatName}>{item.user?.name}</Text>
                                <Text style={styles.chatTime}>{item.time}</Text>
                            </View>
                            <Text style={styles.lastMessage} numberOfLines={1}>{item.lastMessage}</Text>
                        </View>
                    </TouchableOpacity>
                )}
                contentContainerStyle={styles.listContent}
                ListEmptyComponent={
                    <View style={styles.emptyContent}>
                        <Text style={styles.text}>No messages yet</Text>
                    </View>
                }
            />

            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalView}>
                        <Text style={styles.modalTitle}>New Chat</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Enter Username or Email"
                            placeholderTextColor="#666"
                            value={recipient}
                            onChangeText={setRecipient}
                            autoCapitalize="none"
                            autoFocus={true}
                        />
                        <View style={styles.modalButtons}>
                            <TouchableOpacity
                                style={[styles.button, styles.buttonCancel]}
                                onPress={() => setModalVisible(false)}
                            >
                                <Text style={styles.buttonTextCancel}>Cancel</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.button, styles.buttonStart]}
                                onPress={startChat}
                            >
                                <Text style={styles.buttonTextStart}>Start Chat</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#0A0A0A',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 15,
    },
    title: {
        color: '#FFFFFF',
        fontSize: 32,
        fontWeight: 'bold',
    },
    listContent: {
        paddingHorizontal: 20,
    },
    emptyContent: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 50,
    },
    text: {
        color: '#888888',
        fontSize: 16,
    },
    chatItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#333',
    },
    avatar: {
        width: 50,
        height: 50,
        borderRadius: 25,
        marginRight: 15,
    },
    chatInfo: {
        flex: 1,
    },
    chatHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 5,
    },
    chatName: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: 'bold',
    },
    chatTime: {
        color: '#888',
        fontSize: 12,
    },
    lastMessage: {
        color: '#888',
        fontSize: 14,
    },
    modalOverlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
    },
    modalView: {
        width: '80%',
        backgroundColor: '#18181B',
        borderRadius: 20,
        padding: 20,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: 'white',
        marginBottom: 15,
    },
    input: {
        width: '100%',
        backgroundColor: '#0A0A0A',
        color: 'white',
        padding: 15,
        borderRadius: 10,
        marginBottom: 20,
    },
    modalButtons: {
        flexDirection: 'row',
        width: '100%',
        justifyContent: 'space-between',
    },
    button: {
        borderRadius: 10,
        padding: 10,
        elevation: 2,
        width: '45%',
        alignItems: 'center',
    },
    buttonCancel: {
        backgroundColor: '#333',
    },
    buttonStart: {
        backgroundColor: '#FFFFFF',
    },
    buttonTextCancel: {
        color: 'white',
        fontWeight: 'bold',
    },
    buttonTextStart: {
        color: 'black',
        fontWeight: 'bold',
    },
});
