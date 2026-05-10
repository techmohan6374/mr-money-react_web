import {
BrowserRouter,
Routes,
Route
}
from "react-router-dom"

import Login from "./pages/Login"
import Dashboard from "./pages/Dashboard"
import Terms from "./pages/Terms"
import DashboardOverview from "./pages/DashboardOverview"
import Accounts from "./pages/Accounts"
import Transactions from "./pages/Transactions"
import Transfer from "./pages/Transfer"
import Reports from "./pages/Reports"
import Settings from "./pages/Settings"
import Search from "./pages/Search"
import ProtectedRoute from "./ProtectedRoute"
import { Toaster } from 'react-hot-toast'

function App() {

return (

<BrowserRouter>
<Toaster containerClassName="responsive-toast" position="top-right" toastOptions={{ style: { background: '#fff', color: '#111827', borderRadius: '12px', boxShadow: '0 10px 25px rgba(0, 0, 0, 0.08)', fontWeight: '500', fontSize: '14px', border: '1px solid rgba(0, 0, 0, 0.05)', padding: '12px 16px' } }} />

<Routes>

<Route
path="/"
element={<Login />}
/>

<Route
element={
<ProtectedRoute>
<Dashboard />
</ProtectedRoute>
}
>
    <Route path="/dashboard" element={<DashboardOverview />} />
    <Route path="/accounts" element={<Accounts />} />
    <Route path="/transactions" element={<Transactions />} />
    <Route path="/transfers" element={<Transfer />} />
    <Route path="/reports" element={<Reports />} />
    <Route path="/settings" element={<Settings />} />
    <Route path="/search" element={<Search />} />
</Route>

<Route
path="/terms"
element={<Terms />}
/>

</Routes>

</BrowserRouter>

)
}

export default App