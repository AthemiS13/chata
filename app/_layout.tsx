import { Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { View } from 'react-native';
import { KeyboardProvider } from 'react-native-keyboard-controller';
import { AuthProvider, useAuth } from '../ctx/AuthContext';

function RootLayoutNav() {
  const { session, isLoading } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;

    const inAuthGroup = segments[0] === '(auth)';

    if (!session && !inAuthGroup) {
      router.replace('/(auth)/login');
    } else if (session && inAuthGroup) {
      router.replace('/(tabs)');
    }
  }, [session, segments, isLoading]);

  return (
    <View style={{ flex: 1, backgroundColor: '#0A0A0A' }}>
      <StatusBar style="light" />
      <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: '#0A0A0A' } }}>
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="chat/[user]" options={{
          headerShown: true,
          headerTitle: '',
          headerStyle: { backgroundColor: '#18181B' },
          headerShadowVisible: false, // Remove shadow/border
          headerTintColor: '#fff',
        }} />
      </Stack>
    </View>
  );
}

import { ChatProvider } from '../ctx/ChatContext';

// ...

export default function RootLayout() {
  return (
    <AuthProvider>
      <ChatProvider>
        <KeyboardProvider>
          <RootLayoutNav />
        </KeyboardProvider>
      </ChatProvider>
    </AuthProvider>
  );
}
