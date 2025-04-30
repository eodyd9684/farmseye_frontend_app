import { View, Text, TextInput, Button, ScrollView,  StyleSheet } from 'react-native';
import React, { useState } from 'react'
import axios from 'axios';
import { Picker } from '@react-native-picker/picker';

const LuxRuleEditorScreen = () => {

  const [rules, setRules] = useState([
    { id: 1, sensor: 'LUX', condition: '=<', value: 300,  action: 'led', actionValue: 'on' },
  ]);
  
  const [status, setStatus] = useState('');
  
  const addRule = () => {
    const newRule = {
      id: Date.now(),
      sensor: 'TEMP',
      condition: '>=',
      value: 0,
      action: 'servo',
      actionValue: 0,
    };
    setRules([...rules, newRule]);
  };

  const updateRule = (id, field, value) => {
    setRules(rules.map(rule =>
      rule.id === id ? { ...rule, [field]: value } : rule
    ));
  };

  const deleteRule = (id) => {
    setRules(rules.filter(rule => rule.id !== id));
  };

  const saveRules = async () => {
    try {
      setStatus('규칙 저장 중...');
      const response = await axios.post(
        'http://192.168.30.236:5000/api/auto-control',
        rules,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      setStatus('규칙이 성공적으로 저장되었습니다.');
      console.log(response.data);
    } catch (error) {
      setStatus(`오류: ${error.message}`);
    }
  };
  

  return (
    <ScrollView style={{ padding: 16 }}>
      <Text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 8 }}>자동화 규칙</Text>
      <Text style={{ marginBottom: 16 }}>센서 데이터를 기반으로 자동 제어 규칙을 설정하세요.</Text>

      {rules.map((rule) => (
        <View key={rule.id} style={{ borderWidth: 1, borderRadius: 8, padding: 12, marginBottom: 16 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <Text style={{ fontWeight: 'bold' }}>규칙 #{rule.id}</Text>
            <Button title="삭제" onPress={() => deleteRule(rule.id)} />
          </View>

          <Text style={{ marginTop: 8 }}>센서</Text>
          <Picker
            selectedValue={rule.sensor}
            onValueChange={(value) => updateRule(rule.id, 'sensor', value)}
          >
            <Picker.Item label="조도 (ILLUMI)" value="ILLUMI" />
          </Picker>

          <Text>조건</Text>
          <Picker
            selectedValue={rule.condition}
            onValueChange={(value) => updateRule(rule.id, 'condition', value)}
          >
            <Picker.Item label="크거나 같을 때 (≥)" value=">=" />
            <Picker.Item label="작거나 같을 때 (≤)" value="<=" />
            <Picker.Item label="클 때 (>)" value=">" />
            <Picker.Item label="작을 때 (<)" value="<" />
            <Picker.Item label="같을 때 (=)" value="==" />
          </Picker>

          <Text>값</Text>
          <TextInput
            keyboardType="numeric"
            value={rule.value.toString()}
            onChangeText={(text) => updateRule(rule.id, 'value', parseFloat(text))}
            style={{ borderBottomWidth: 1, marginBottom: 12 }}
          />

          <Text>동작</Text>
          <Picker
            selectedValue={rule.action}
            onValueChange={(value) => updateRule(rule.id, 'action', value)}
          >
            <Picker.Item label="조명 제어" value="led" />
          </Picker>

          {rule.action === 'servo' ? (
            <View style={{ marginTop: 8 }}>
            <Text>조명</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 8 }}>
              <Button
                title="-"
                onPress={() =>
                  updateRule(rule.id, 'actionValue', Math.max(0, rule.actionValue - 1))
                }
              />
              <TextInput
                style={{
                  width: 60,
                  height: 40,
                  borderWidth: 1,
                  marginHorizontal: 8,
                  textAlign: 'center',
                }}
                keyboardType="numeric"
                value={rule.actionValue.toString()}
                onChangeText={(text) => {
                  const angle = parseInt(text) || 0;
                  if (angle >= 0 && angle <= 180) {
                    updateRule(rule.id, 'actionValue', angle);
                  }
                }}
              />
              <Button
                title="+"
                onPress={() =>
                  updateRule(rule.id, 'actionValue', Math.min(180, rule.actionValue + 1))
                }
              />
            </View>
            <Text>현재 온도: {rule.actionValue}°</Text>
          </View>
          ) : (
            <View>
              <Text>조명 상태</Text>
              <Picker
                selectedValue={rule.actionValue}
                onValueChange={(value) => updateRule(rule.id, 'actionValue', value)}
              >
                <Picker.Item label="켜기" value="on" />
                <Picker.Item label="끄기" value="off" />
              </Picker>
            </View>
          )}
        </View>
      ))}

      <Button title="규칙 추가" onPress={addRule} />
      <View style={{ marginTop: 12 }}>
        <Button title="규칙 저장" onPress={saveRules} />
      </View>

      {status ? <Text style={{ marginTop: 16 }}>{status}</Text> : null}
    </ScrollView>
  )
}

export default LuxRuleEditorScreen

const styles = StyleSheet.create({
  container: { padding: 16, backgroundColor: '#F9FAFB' },
  title: { fontSize: 18, fontWeight: 'bold', marginBottom: 12 },
  ruleCard: { borderWidth: 1, borderColor: '#ddd', borderRadius: 8, padding: 10, marginBottom: 16 },
  ruleTitle: { fontSize: 16, fontWeight: 'bold', marginBottom: 8 },
  inputGroup: { marginBottom: 10 },
  label: { fontSize: 13, color: '#333' },
  input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 6, padding: 8, fontSize: 14 },
  deleteButton: { alignItems: 'flex-end', marginTop: 8 },
  deleteText: { color: 'red', fontWeight: 'bold' },
  status: { marginTop: 12, fontSize: 13, color: '#007BFF' },
})