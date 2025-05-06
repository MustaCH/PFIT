import { Text, View, Pressable } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Button } from "../../components/atoms/button";

export const Home = () => {
    const insets = useSafeAreaInsets();

    return (
        <View className="flex-1 items-center justify-center" style={{ paddingTop: insets.top , paddingBottom: insets.bottom , paddingLeft: insets.left , paddingRight: insets.right }}>
            <View className="flex flex-col items-center justify-between gap-8">
                <View className="flex flex-col items-center justify-center gap-2">
                    <Text className="text-3xl text-black">💪 ¡Bienvenidx!</Text>
                    <Text className="text-xl text-gray-500">A tu entrenador personal</Text>
                </View>
                <View className="flex flex-col items-center justify-center gap-4">
                    <Button title="Registrarse" onPress={() => {}} theme="primary"/>
                    <Button title="Iniciar sesión" onPress={() => {}} theme="secondary"/>
                </View>
            </View>
        </View>
    );
}