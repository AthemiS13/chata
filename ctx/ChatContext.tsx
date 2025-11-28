import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { MOCK_USERS } from '../data/mockUsers';
import { useAuth } from './AuthContext';

type Message = {
    id: string;
    text: string;
    sender: string;
    receiver: string;
    timestamp: number;
};

type ChatContextType = {
    messages: Message[];
    sendMessage: (receiver: string, text: string) => Promise<void>;
    getMessages: (otherUser: string) => Message[];
    getConversations: () => any[];
};

const ChatContext = createContext<ChatContextType>({
    messages: [],
    sendMessage: async () => { },
    getMessages: () => [],
    getConversations: () => [],
});

export const useChat = () => useContext(ChatContext);

export function ChatProvider({ children }: { children: React.ReactNode }) {
    const { session } = useAuth(); // session is the username
    const [messages, setMessages] = useState<Message[]>([]);

    useEffect(() => {
        loadMessages();
    }, []);

    const loadMessages = async () => {
        const stored = await AsyncStorage.getItem('chat_messages');
        if (stored) {
            setMessages(JSON.parse(stored));
        }
    };

    const sendMessage = async (receiver: string, text: string) => {
        if (!session) return;

        const newMessage: Message = {
            id: Date.now().toString(),
            text,
            sender: session,
            receiver,
            timestamp: Date.now(),
        };

        const updatedMessages = [...messages, newMessage];
        setMessages(updatedMessages);
        await AsyncStorage.setItem('chat_messages', JSON.stringify(updatedMessages));
    };

    const getMessages = (otherUser: string) => {
        if (!session) return [];
        return messages.filter(
            m => (m.sender === session && m.receiver === otherUser) ||
                (m.sender === otherUser && m.receiver === session)
        ).sort((a, b) => a.timestamp - b.timestamp);
    };

    const getConversations = () => {
        if (!session) return [];

        const conversations: { [key: string]: Message } = {};

        messages.forEach(m => {
            if (m.sender === session || m.receiver === session) {
                const otherUser = m.sender === session ? m.receiver : m.sender;
                // Keep the latest message
                if (!conversations[otherUser] || m.timestamp > conversations[otherUser].timestamp) {
                    conversations[otherUser] = m;
                }
            }
        });

        return Object.keys(conversations).map(username => {
            const user = MOCK_USERS.find(u => u.username === username);
            const lastMsg = conversations[username];
            return {
                user: user || { username, name: username, avatar: '' },
                lastMessage: lastMsg.text,
                time: new Date(lastMsg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                timestamp: lastMsg.timestamp,
            };
        }).sort((a, b) => b.timestamp - a.timestamp);
    };

    return (
        <ChatContext.Provider value={{ messages, sendMessage, getMessages, getConversations }}>
            {children}
        </ChatContext.Provider>
    );
}
