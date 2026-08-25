import { api } from '../Api';
import RNFS from 'react-native-fs';
import { Platform } from 'react-native';
import { saveToken, saveUsername } from '../../utils/storage';

export const Register = async (
  name: string,
  email: string,
  password: string,
  // uri alone isn't enough on native — RN's multipart builder needs
  // name and type too, or it fails before the request is even sent
  // (surfaces as a generic "Network request failed").
  file?: { uri: string; name: string; type: string } | File,
) => {
  try {
    const formData = new FormData();
    const userJson = JSON.stringify({ username: name, email, password });
    const userFilePath = `${RNFS.CachesDirectoryPath}/user-${Date.now()}.json`;
    await RNFS.writeFile(userFilePath, userJson, 'utf8');

    formData.append('user', {
      uri: Platform.OS === 'android' ? `file://${userFilePath}` : userFilePath,
      name: 'user.json',
      type: 'application/json',
    } as any);

    if (file) {
      formData.append('file', file as any);
    }

    let response: Response;
    try {
      // Double-check `api` doesn't already end in "/api" — logging the
      // final URL here is the fastest way to catch a malformed base
      // URL, which also produces "Network request failed" (bad host).
      const url = `${api}/api/auth/register`;
      console.log('Register URL:', url);

      response = await fetch(url, {
        method: 'POST',
        // Do NOT set Content-Type manually — fetch sets the multipart
        // boundary automatically when the body is FormData. Setting
        // it yourself breaks the boundary and the backend can't parse
        // the parts.
        body: formData,
      });
    } finally {
      // Remove the temp file regardless of outcome, so these don't
      // accumulate in the cache directory across registration attempts.
      RNFS.unlink(userFilePath).catch(() => {});
    }

    console.log('Register response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Register error body:', errorText);
      throw new Error(`Failed to register (${response.status})`);
    }

    const data = await response.json();
    await saveToken(data.token);
    await saveUsername(name);
    return data;
  } catch (error) {
    console.error('Error during registration:', error);
    throw error;
  }
};