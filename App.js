import React, { useState, useEffect } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import TelaInicial from './src/screens/TelaInicial';
import TelaCerebro from './src/screens/TelaCerebro';
import TelaEditor from './src/screens/TelaEditor';
import { inicializarBanco } from './src/utils/armazenamento';
import { colors } from './src/theme';

const Pilha = createNativeStackNavigator();

const estiloHeader = {
  headerStyle: { backgroundColor: colors.surface },
  headerTintColor: colors.textPrimary,
  headerShadowVisible: false,
  contentStyle: { backgroundColor: colors.bg },
};

export default function App() {
  const [bancoPronto, setBancoPronto] = useState(false);

  useEffect(() => {
    inicializarBanco()
      .then(() => setBancoPronto(true))
      .catch(e => {
        console.warn('erro ao inicializar banco:', e);
        setBancoPronto(true); // tenta carregar mesmo assim
      });
  }, []);

  if (!bancoPronto) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.bg }}>
        <ActivityIndicator color={colors.accent} />
      </View>
    );
  }

  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Pilha.Navigator initialRouteName="Inicio" screenOptions={estiloHeader}>
          <Pilha.Screen
            name="Inicio"
            component={TelaInicial}
          options={{ headerShown: false }}
        />
        <Pilha.Screen
          name="Cerebro"
          component={TelaCerebro}
          options={({ route }) => ({
            title: route.params?.cerebro?.name ?? 'Vault',
            headerBackTitle: 'Voltar',
          })}
        />
        <Pilha.Screen
          name="Editor"
          component={TelaEditor}
          options={{
            title: '',
            headerBackTitle: 'Notas',
          }}
        />
      </Pilha.Navigator>
    </NavigationContainer>
  </SafeAreaProvider>
  );
}
