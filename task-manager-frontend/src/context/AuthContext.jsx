import { createContext, useState, useContext, useEffect } from 'react';
import { authAPI } from '../services/api';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // ✅ İlk yüklemede token kontrolü
  useEffect(() => {
    const initAuth = () => {
      try {
        const token = localStorage.getItem('token');
        const userData = localStorage.getItem('user');
        
        if (token && userData) {
          setUser(JSON.parse(userData));
        }
      } catch (err) {
        console.error('Auth init error:', err);
        // Hatalı data varsa temizle
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  // ✅ Login - Success/Error return eder
  const login = async (username, password) => {
    try {
      const response = await authAPI.login(username, password);
      
      if (response.data && response.data.token) {
        const { token, username, email, fullName } = response.data;
        
        // Token ve user data kaydet
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify({ username, email, fullName }));
        
        setUser({ username, email, fullName });
        
        // ✅ Başarı durumu
        return { success: true };
      } else {
        // ✅ Beklenmeyen response
        return { success: false, error: 'Geçersiz sunucu yanıtı' };
      }
    } catch (error) {
      console.error('Login error:', error);
      
      // ✅ Hata durumu - Backend'den gelen mesajı kullan
      const errorMessage = error.response?.data?.message 
        || error.response?.data 
        || 'Kullanıcı adı veya şifre hatalı';
      
      return { success: false, error: errorMessage };
    }
  };

  // ✅ Register - Success/Error return eder
  const register = async (username, email, password, fullName) => {
    try {
      const response = await authAPI.register(username, email, password, fullName);
      
      if (response.data && response.data.token) {
        const { token, username, email, fullName } = response.data;
        
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify({ username, email, fullName }));
        
        setUser({ username, email, fullName });
        
        return { success: true };
      } else {
        return { success: false, error: 'Geçersiz sunucu yanıtı' };
      }
    } catch (error) {
      console.error('Register error:', error);
      
      const errorMessage = error.response?.data?.message 
        || error.response?.data 
        || 'Kayıt işlemi başarısız oldu';
      
      return { success: false, error: errorMessage };
    }
  };

  // ✅ Logout
  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};