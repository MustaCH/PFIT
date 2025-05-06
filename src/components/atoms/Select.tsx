import React from 'react';
import { View, Text, Pressable, Modal, FlatList } from 'react-native';

interface SelectOption {
  label: string;
  value: string;
}

interface SelectProps {
  value: string;
  onChange: (value: string) => void;
  options: SelectOption[];
  placeholder?: string;
}

export const Select: React.FC<SelectProps> = ({ value, onChange, options, placeholder }) => {
  const [modalVisible, setModalVisible] = React.useState(false);
  const selectedLabel = options.find(o => o.value === value)?.label || '';

  return (
    <View>
      <Pressable
        className="border border-gray-300 bg-gray-100 rounded px-2 py-4 mb-3"
        onPress={() => setModalVisible(true)}
      >
        <Text className={value ? 'text-black' : 'text-gray-400'}>
          {selectedLabel || placeholder || 'Selecciona una opción'}
        </Text>
      </Pressable>
      <Modal
        visible={modalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <Pressable style={{ flex: 1 }} onPress={() => setModalVisible(false)}>
          <View style={{ margin: 40, backgroundColor: 'white', borderRadius: 8, padding: 12 }}>
            <FlatList
              data={options}
              keyExtractor={item => item.value}
              renderItem={({ item }) => (
                <Pressable
                  style={{ padding: 12 }}
                  onPress={() => {
                    onChange(item.value);
                    setModalVisible(false);
                  }}
                >
                  <Text style={{ color: item.value === value ? 'blue' : 'black' }}>{item.label}</Text>
                </Pressable>
              )}
            />
          </View>
        </Pressable>
      </Modal>
    </View>
  );
};
