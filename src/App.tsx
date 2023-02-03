import { BrowserRouter, Route, Routes } from 'react-router-dom';

import { Home } from "./pages/Home";
import { NewRoom } from "./pages/NewRoom";
import { Room } from "./pages/Room";
import { AdminRoom } from "./pages/AdminRoom";

import { AuthContextProvider } from "./contexts/AuthContext";
import {Toaster} from "react-hot-toast";

function App() {

    return (
        <BrowserRouter>
            <Toaster
                position="top-right"
                reverseOrder={false}
            />
            <AuthContextProvider>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/rooms/new" element={<NewRoom />} />
                    <Route path="/rooms/:id" element={<Room />} />
                    <Route path="/admin/rooms/:id" element={<AdminRoom />} />
                </Routes>
            </AuthContextProvider>
        </BrowserRouter>
    )
}

export default App
