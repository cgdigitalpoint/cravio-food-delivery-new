// ─── PasswordInput ────────────────────────────────────────────────────────────
import React, { useState } from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { Eye, EyeOff, Lock } from 'lucide-react-native';
import { InputField } from './InputField';

interface Props {
  label?: string;
  value: string;
  onChangeText: (v: string) => void;
  placeholder?: string;
  error?: string;
}

export function PasswordInput({
  label = 'Password',
  value,
  onChangeText,
  placeholder = 'Enter your password',
  error,
}: Props) {
  const [visible, setVisible] = useState(false);

  return (
    <InputField
      label={label}
      value={value}
      onChangeText={onChangeText}
      placeholder={placeholder}
      secureTextEntry={!visible}
      autoCapitalize="none"
      error={error}
      leftIcon={<Lock size={18} color="#9CA3AF" strokeWidth={1.8} />}
      rightIcon={
        <TouchableOpacity onPress={() => setVisible((v) => !v)} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
          {visible ? (
            <EyeOff size={18} color="#9CA3AF" strokeWidth={1.8} />
          ) : (
            <Eye size={18} color="#9CA3AF" strokeWidth={1.8} />
          )}
        </TouchableOpacity>
      }
    />
  );
}

const _styles = StyleSheet.create({});
