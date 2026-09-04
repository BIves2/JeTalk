import { Route, Routes } from "react-router-dom";
import Home from "./Home";
import NotFound404 from "./NotFound404";
import SignUp from "./SignUp";
import Login from "./Login";
import Dashboard from "./Dashboard";

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
            <Route path="/dashboard" element={<Dashboard />}/>
            <Route path="*" element={<NotFound404 />} />
        </Routes>
    )
}
export default App  