import { Pressable, Text, Animated } from "react-native";
import { ButtonColors } from "../../../../types";

interface ButtonProps {
    title: string;
    onPress: () => void;
    theme?: ButtonColors;
}

export const Button = ({ title , onPress , theme }: ButtonProps) => {
    const themeClasses: Record<string, { bg: string; bgPressed: string; text: string }> = {
        default: { bg: "bg-gray-500", bgPressed: "bg-gray-600", text: "text-white" },
        primary: { bg: "bg-blue-600", bgPressed: "bg-blue-700", text: "text-white" },
        secondary: { bg: "bg-gray-200", bgPressed: "bg-gray-300", text: "text-black" },
        danger: { bg: "bg-red-500", bgPressed: "bg-red-700", text: "text-white" },
    };
    const current = themeClasses[theme ?? "default"];

    return (
        <Pressable onPress={onPress}>
            {({ pressed }) => (
                <Text
                    className={`
                        ${pressed ? current.bgPressed : current.bg}
                        px-4 py-6 rounded-xl w-full text-center ${current.text} text-xl font-semibold
                    `}
                >
                    {title}
                </Text>
            )}
        </Pressable>
    );
}