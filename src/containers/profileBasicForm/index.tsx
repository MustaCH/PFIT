import React, { useState } from "react";
import { Text, View, } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Button } from "../../components/atoms/button";
import { Input } from "../../components/atoms/input";
import { Select } from "../../components/atoms/Select";

export const ProfileBasicForm = () => {
  const insets = useSafeAreaInsets();
  const [edad, setEdad] = useState("");
  const [sexo, setSexo] = useState("");
  const [altura, setAltura] = useState("");
  const [peso, setPeso] = useState("");
  const [fitnessGoal, setFitnessGoal] = useState("");
  const [healthConditions, setHealthConditions] = useState("");
  const [sportsActivities, setSportsActivities] = useState("");
  const [documentation, setDocumentation] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const input = {
        sex: sexo as 'male' | 'female',
        age: Number(edad),
        heightCm: Number(altura),
        weightKg: Number(peso),
        fitnessGoal,
        healthConditions: healthConditions || 'None',
        sportsActivities: sportsActivities || 'None',
        documentation: documentation || 'Sin documentación',
      };
    } catch (err: any) {
      setError(err?.message || 'Error generando rutina');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View
      className="flex-1 items-center justify-center"
      style={{
        paddingTop: insets.top,
        paddingBottom: insets.bottom,
        paddingLeft: insets.left,
        paddingRight: insets.right,
      }}
    >
      <Text className="text-3xl text-black mb-4">Cuéntanos un poco de ti</Text>
      <View className="w-full max-w-xs">
        <Text className="text-xl text-black mb-1">Edad</Text>
        <Input
          keyboardType="numeric"
          value={edad}
          onChangeText={setEdad}
          placeholder="Ingresa tu edad"
        />
        <Text className="text-xl text-black mb-1">Sexo</Text>
        <Select
          value={sexo}
          onChange={setSexo}
          options={[
            { label: "Masculino", value: "male" },
            { label: "Femenino", value: "female" },
          ]}
          placeholder="Selecciona tu sexo"
        />
        <Text className="text-xl text-black mb-1">Altura (cm)</Text>
        <Input
          keyboardType="numeric"
          value={altura}
          onChangeText={setAltura}
          placeholder="Ingresa tu altura"
        />
        <Text className="text-xl text-black mb-1">Peso (kg)</Text>
        <Input
          keyboardType="numeric"
          value={peso}
          onChangeText={setPeso}
          placeholder="Ingresa tu peso"
        />
        <Text className="text-xl text-black mb-1">Objetivo principal</Text>
        <Input
          value={fitnessGoal}
          onChangeText={setFitnessGoal}
          placeholder="Ej: Pérdida de peso, Ganar músculo, Fitness general"
        />
        <Text className="text-xl text-black mb-1">Condiciones de salud</Text>
        <Input
          value={healthConditions}
          onChangeText={setHealthConditions}
          placeholder="Ej: Ninguna, Escoliosis, Problemas cardíacos"
        />
        <Text className="text-xl text-black mb-1">Deportes y objetivo</Text>
        <Input
          value={sportsActivities}
          onChangeText={setSportsActivities}
          placeholder="Ej: Running (Mejorar rendimiento)"
        />
        <Text className="text-xl text-black mb-1">Documentación</Text>
        <Input
          value={documentation}
          onChangeText={setDocumentation}
          placeholder="Pega aquí la documentación médica o de fitness (opcional)"
        />
        <Button title={loading ? "Generando..." : "Generar rutina"} onPress={handleSubmit} theme="primary" />
        {error && <Text className="text-red-500 mt-2">{error}</Text>}
        {result && (
          <View className="mt-4 p-2 bg-gray-100 rounded">
            <Text className="text-xl font-bold mb-2">Rutina generada:</Text>
            {result.workoutRoutine && result.workoutRoutine.length > 0 ? (
              result.workoutRoutine.map((ex: any, idx: number) => (
                <View key={idx} className="mb-2">
                  <Text className="font-semibold">{ex.name}</Text>
                  <Text>Series: {ex.sets}</Text>
                  <Text>Reps: {ex.reps}</Text>
                  <Text>Grupos musculares: {ex.muscleGroups.join(', ')}</Text>
                </View>
              ))
            ) : (
              <Text>No se generó rutina de ejercicios.</Text>
            )}
            <Text className="mt-2">Notas:</Text>
            <Text>{result.notes}</Text>
          </View>
        )}
      </View>
    </View>
  );
}