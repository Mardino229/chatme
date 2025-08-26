
import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Chat from "./components/chat.tsx";
import LoginPage from "./pages/login.tsx";
import SignupPage from "./pages/signup.tsx";
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";
import {UserContextProvider} from "@/components/layout/userContextProvider.tsx";
import PrivateRoute from "./components/layout/privateRoute.tsx";
const queryClient = new QueryClient();

function App() {

  return (
      <QueryClientProvider client={queryClient} >
          <UserContextProvider>
              <Router>
                  <Routes>
                      <Route element={<PrivateRoute/>}>
                          <Route path="/" element={<Chat/>}/> {/* Page d'accueil */}
                          <Route path="/:id/:pseudo" element={<Chat/>}/> {/* Page d'accueil */}
                      </Route>
                      <Route path="/login" element={<LoginPage/>}/> {/* Page de connexion */}
                      <Route path="/register" element={<SignupPage/>}/> {/* Page d'inscription */}
                  </Routes>
              </Router>
          </UserContextProvider>
      </QueryClientProvider>
  )
}

export default App
