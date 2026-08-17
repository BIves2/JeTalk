import { Route, Routes } from "react-router-dom";
import Home from "./Home";
import NotFound404 from "./NotFound404";
import SignUp from "./SignUp";

function App(){
    return(
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="*" element={<NotFound404 />} />
        </Routes>
    )
}
export default App  