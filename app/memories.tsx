import { useEffect, useState } from 'react';
import { api } from '../src/lib/api';
import { Link } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Icon from '@expo/vector-icons/Feather';
import * as SecureStore from 'expo-secure-store';
import { Image, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import dayjs from 'dayjs';
import ptBR from 'dayjs/locale/pt-br';

// Assets
import NlwLogo from '../src/assets/nlw-spacetime-logo.svg';

interface Memory {
  coverUrl: string;
  excerpt: string;
  createdAt: string;
  id: string;
}

dayjs.locale(ptBR);

export default function Memories() {
  const { bottom, top } = useSafeAreaInsets();

  const [memories, setMemories] = useState<Memory[]>();

  async function signOut() {
    await SecureStore.deleteItemAsync('token');
  }

  async function loadMemories() {
    const token = await SecureStore.getItemAsync('token');

    const response = await api.get('/memories', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    setMemories(response.data);
  }

  useEffect(() => {
    loadMemories();
  }, []);

  return (
    <ScrollView
      className="flex-1"
      contentContainerStyle={{ paddingBottom: bottom, paddingTop: top }}
    >
      <View className="mt-4 flex-row items-center justify-between px-8">
        <NlwLogo />

        <View className="flex-row gap-2">
          <TouchableOpacity className="h-10 w-10 items-center justify-center rounded-full bg-red-500">
            <Icon name="log-out" size={16} color="#000" />
          </TouchableOpacity>

          <Link href="/new" asChild>
            <TouchableOpacity
              onPress={signOut}
              className="h-10 w-10 items-center justify-center rounded-full bg-green-500"
            >
              <Icon name="plus" size={16} color="#000" />
            </TouchableOpacity>
          </Link>
        </View>
      </View>

      <View className="mt-6 space-y-10">
        {memories &&
          memories.map((memory) => (
            <View key={memory.id} className="space-y-4">
              <View className="flex-row items-center gap-2">
                <View className="h-px w-5 bg-gray-50" />
                <Text className="font-body text-xs text-gray-100">
                  {dayjs(memory.createdAt).format('D[ de ]MMMM[, ]YYYY')}
                </Text>
              </View>
              <View className="space-y-4 px-8">
                <Image
                  alt=""
                  source={{
                    uri:
                      memory.coverUrl ||
                      'https://www.charlotteathleticclub.com/assets/camaleon_cms/image-not-found-4a963b95bf081c3ea02923dceaeb3f8085e1a654fc54840aac61a57a60903fef.png',
                  }}
                  className="aspect-video w-full rounded-lg"
                />
                <Text className="font-body text-base leading-relaxed text-gray-100">
                  {memory.excerpt}
                </Text>
                <Link href={`/memories/${memory.id}`} asChild>
                  <TouchableOpacity className="flex-row items-center gap-2">
                    <Text className="font-body text-sm text-gray-200">
                      Ler mais
                    </Text>
                    <Icon name="arrow-right" size={16} color="#9E9EAD" />
                  </TouchableOpacity>
                </Link>
              </View>
            </View>
          ))}
      </View>
    </ScrollView>
  );
}
