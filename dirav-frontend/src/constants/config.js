// API Configuration
import { Platform } from 'react-native';

const getBaseUrl = () => {
  if (Platform.OS === 'android') {
    return 'http://10.0.2.2:8080/api/v1';
  }
  return 'http://localhost:8080/api/v1';
};

export const API_CONFIG = {
  BASE_URL: getBaseUrl(),
  TIMEOUT: 10000,
};

/* // For production or different environments
export const API_CONFIG = {
  BASE_URL: 'https://consumption-statistical-charming-happened.trycloudflare.com/api/v1',
  TIMEOUT: 10000,
}; */

export default API_CONFIG;
