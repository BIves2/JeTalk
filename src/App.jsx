import { Route, Routes } from "react-router-dom";
import Home from "./Home";
import NotFound404 from "./NotFound404";
import SignUp from "./SignUp";
import Login from "./Login";
import Dashboard from "./Dashboard";
import ProtectedRoutes from "./routes/ProtectedRoutes";
import UserInfosContext from "./context/UserInfosContext";
import TranslationSpace from "./TranslationSpace";

/**
 * file for global app views routes
 * @returns routes of the app
 */
function App(){
    return(
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/login" element={<Login />} />
            <Route path="*" element={<NotFound404 />} />
            <Route element={<ProtectedRoutes />}>
                <Route element={<UserInfosContext />}>
                    <Route path="/dashboard" element={<Dashboard />}/>
                    <Route path="/translation" element={<TranslationSpace />}/>
                </Route>
            </Route>
        </Routes>
    )
}
export default App  