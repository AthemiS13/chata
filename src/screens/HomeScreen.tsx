import { Search, SquarePen } from "lucide-react-native";
import React from "react";
import {
    FlatList,
    Image,
    Pressable,
    Text,
    TextInput,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// Mock Data
const MOCK_CHATS = [
    {
        id: "1",
        name: "Alice Bowman",
        lastMessage: "Did you see the new protocol update?",
        timestamp: "10:45 AM",
        unread: true,
        avatar: "https://i.pravatar.cc/150?u=alice",
    },
    {
        id: "2",
        name: "Cipher Group",
        lastMessage: "Meeting at 1400 hours. Encrypted channel only.",
        timestamp: "9:30 AM",
        unread: true,
        avatar: "https://i.pravatar.cc/150?u=cipher",
    },
    {
        id: "3",
        name: "Bob Vance",
        lastMessage: "Can we reschedule?",
        timestamp: "Yesterday",
        unread: false,
        avatar: "https://i.pravatar.cc/150?u=bob",
    },
    {
        id: "4",
        name: "Sarah Connor",
        lastMessage: "They are coming.",
        timestamp: "Yesterday",
        unread: false,
        avatar: "https://i.pravatar.cc/150?u=sarah",
    },
    {
        id: "5",
        name: "Dev Team",
        lastMessage: "Deploying to production in 5 mins.",
        timestamp: "Mon",
        unread: false,
        avatar: "https://i.pravatar.cc/150?u=dev",
    },
    {
        id: "6",
        name: "Unknown",
        lastMessage: "Sent an attachment.",
        timestamp: "Sun",
        unread: false,
        avatar: "https://i.pravatar.cc/150?u=unknown",
    },
];

export default function HomeScreen() {
    return (
        <SafeAreaView className="flex-1 bg-black">
            {/* Header */}
            <View className="flex-row items-center justify-between px-4 py-3 border-b border-zinc-900">
                <View className="flex-row items-center gap-3">
                    <View className="h-10 w-10 rounded-full bg-zinc-800 overflow-hidden items-center justify-center">
                        <Image
                            source={{ uri: "https://i.pravatar.cc/150?u=me" }}
                            className="h-full w-full"
                        />
                    </View>
                    <Text className="text-xl font-bold text-white">Chats</Text>
                </View>
                <Pressable className="p-2 rounded-full active:bg-zinc-900">
                    <SquarePen size={24} color="#fff" />
                </Pressable>
            </View>

            {/* Search Bar */}
            <View className="px-4 py-3">
                <View className="flex-row items-center bg-zinc-900 rounded-xl px-3 py-2.5">
                    <Search size={20} color="#a1a1aa" />
                    <TextInput
                        placeholder="Search conversations..."
                        placeholderTextColor="#a1a1aa"
                        className="flex-1 ml-3 text-zinc-100 text-base"
                    />
                </View>
            </View>

            {/* Conversation List */}
            <FlatList
                data={MOCK_CHATS}
                keyExtractor={(item) => item.id}
                contentContainerClassName="pb-20"
                renderItem={({ item }) => (
                    <Pressable className="flex-row items-center px-4 py-4 border-b border-zinc-900 active:bg-zinc-900/50">
                        {/* Avatar */}
                        <View className="h-12 w-12 rounded-full bg-zinc-800 overflow-hidden mr-4">
                            <Image
                                source={{ uri: item.avatar }}
                                className="h-full w-full"
                            />
                        </View>

                        {/* Content */}
                        <View className="flex-1">
                            <View className="flex-row justify-between items-center mb-1">
                                <Text className="text-white font-bold text-base">
                                    {item.name}
                                </Text>
                                <Text className="text-xs text-zinc-500">{item.timestamp}</Text>
                            </View>
                            <Text
                                numberOfLines={1}
                                className={`text-sm ${item.unread ? "text-zinc-200 font-medium" : "text-zinc-400"
                                    }`}
                            >
                                {item.lastMessage}
                            </Text>
                        </View>

                        {/* Unread Indicator */}
                        {item.unread && (
                            <View className="h-2.5 w-2.5 rounded-full bg-blue-500 ml-3" />
                        )}
                    </Pressable>
                )}
            />
        </SafeAreaView>
    );
}
