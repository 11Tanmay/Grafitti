import { BrowserRouter, Navigate, Routes, Route } from 'react-router-dom';
import HomePage from 'scenes/homePage';
import LoginPage from 'scenes/loginPage';
import ProfilePage from 'scenes/profilePage';
import { useMemo } from "react";
import { useSelector } from 'react-redux';
import { CssBaseline, ThemeProvider } from '@mui/material';
import { createTheme } from '@mui/material/styles';
import { themeSettings } from './theme';

function App() {
  const mode = useSelector((state) => state.mode);        //grabbing the value we have in our initial state
  const theme = useMemo(() => createTheme(themeSettings(mode)), [mode]);
  const isAuth = Boolean(useSelector((state) => state.token));              //if the user is authorized

  return (
    <div className="app">
      <BrowserRouter>
      <ThemeProvider theme={theme}>                                     {/*theme configured for material ui*/}
        <CssBaseline />                                                 {/*css reset to basic for material ui*/}
        <Routes>                                                        {/*setting up routes*/}                
          <Route path="/" element={<LoginPage />} />                    {/*loginpage route*/}
          <Route path="/home" element={isAuth ? <HomePage /> : <Navigate to ="/"></Navigate>} />                 {/*homepage route*/}
          <Route path="/profile/:userId" element={isAuth ? <ProfilePage /> : <Navigate to ="/"></Navigate>} />   {/*profilepage route*/}
        </Routes>
      </ThemeProvider>
      </BrowserRouter>
    </div>
  );  
}
export default App;
