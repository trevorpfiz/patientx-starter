import * as SecureStore from "expo-secure-store";

const key = "session_token";
export const getToken = () => SecureStore.getItemAsync(key);
export const deleteToken = () => SecureStore.deleteItemAsync(key);
export const setToken = (v: string) => SecureStore.setItemAsync(key, v);

// store patientId
const patientIdKey = "patient_id";
export const getPatientId = () => SecureStore.getItemAsync(patientIdKey);
export const deletePatientId = () => SecureStore.deleteItemAsync(patientIdKey);
export const setPatientId = (v: string) =>
  SecureStore.setItemAsync(patientIdKey, v);
