import { TextInput } from "react-native";

interface InputProps {
    value: string;
    onChangeText: (value: string) => void;
    placeholder: string;
    keyboardType?: 'default' | 'number-pad' | 'decimal-pad' | 'numeric' | 'email-address' | 'phone-pad' | 'url';
}

export const Input = ({ value, onChangeText, placeholder, keyboardType }: InputProps) => {
    return (
        <TextInput
            className="border border-gray-300 bg-gray-100 rounded px-2 py-4 mb-3 text-black"
            value={value}
            onChangeText={onChangeText}
            placeholder={placeholder}
            keyboardType={keyboardType}
        />
    );
}