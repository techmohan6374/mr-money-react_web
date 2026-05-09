import {
BrowserRouter,
Routes,
Route
}
from "react-router-dom"

import Login from "./pages/Login"
import Dashboard from "./pages/Dashboard"
import Terms from "./pages/Terms"
import ProtectedRoute from "./ProtectedRoute"

function App() {

return (

<BrowserRouter>

<Routes>

<Route
path="/"
element={<Login />}
/>

<Route
path="/dashboard"
element={
<ProtectedRoute>
<Dashboard />
</ProtectedRoute>
}
/>

<Route
path="/terms"
element={<Terms />}
/>

</Routes>

</BrowserRouter>

)
}

export default App