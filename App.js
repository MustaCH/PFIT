import { StatusBar } from 'expo-status-bar';
import { Home } from './src/containers/home';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import "./global.css"

export default function App() {
  return (
    <SafeAreaProvider>
      <StatusBar style="auto" />
      <Home />
    </SafeAreaProvider>
  );
}
