import { useState } from 'react';
import { useAuth } from '../AuthContext/AuthContext';

export default function useToken() {
  const { user, login, logout } = useAuth();
  
  const getToken = () => {
    return user?.token
  };

  const [token, setToken] = useState(getToken());

  const saveToken = userData => {
    login({
        username: userData[0],
        token: userData[1].token
    })
    setToken(userData[1].token);
  };

  return {
    setToken: saveToken,
    token
  }
}