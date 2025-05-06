import { StatusBar } from 'expo-status-bar';
import { ProfileBasicForm } from './src/containers/profileBasicForm';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import "./global.css"

export default function App() {
  return (
    <SafeAreaProvider>
      <StatusBar style="auto" />
      {/* <Home /> */}
      <ProfileBasicForm />
    </SafeAreaProvider>
  );
}
