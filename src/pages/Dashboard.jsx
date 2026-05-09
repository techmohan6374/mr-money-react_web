import { useNavigate } from "react-router-dom"

function Dashboard() {

const navigate = useNavigate()

const userData =
localStorage.getItem("user")

if (!userData) {
navigate("/")
return null
}

const user = JSON.parse(userData)

const logout = () => {

localStorage.clear()

navigate("/")
}

return (

<div
style={{
padding:"40px"
}}
>

<h1>
Dashboard
</h1>

<div
style={{
padding:"20px",
border:"1px solid #ddd",
borderRadius:"12px",
width:"300px"
}}
>

<img
src={user.picture}
alt=""
style={{
width:"80px",
height:"80px",
borderRadius:"50%"
}}
/>

<h2>{user.name}</h2>

<p>{user.email}</p>

<button
onClick={logout}
style={{
padding:"10px 20px",
background:"red",
color:"#fff",
border:"none",
borderRadius:"8px"
}}
>
Logout
</button>

</div>

</div>
)
}

export default Dashboard