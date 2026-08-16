import { Route, Routes } from "react-router-dom";
import Home from "./Home";
import NotFound404 from "./NotFound404";

function App(){
    return(
        <Routes>
            <Route path="/" element={<Home/>} />
            <Route path="*" element={<NotFound404/>}/>
        </Routes>
    )
}
export default App  