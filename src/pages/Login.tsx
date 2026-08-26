import { useEffect } from 'react';
import { login } from '../services/auth.service';
import { setLocalStorageToken } from '../utils/functions';

export default function Login() {
  async function handleLogin() {
    const result = await login('101010', '1234');
    console.log(result);
    setLocalStorageToken(result?.token)
  }

  handleLogin();

  useEffect(() => {
    async function executeLogin() {
      const result = await handleLogin();
    }
    executeLogin()
  }, []);

  return <></>;
}
