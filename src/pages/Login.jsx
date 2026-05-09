import { GoogleLogin } from '@react-oauth/google'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

function Login() {
    const navigate = useNavigate()
    const handleSuccess = async (credentialResponse) => {
        try {
            const result = await axios.post(
                'https://mrmoney-api.onrender.com/api/Auth/google-login',
                {
                    token: credentialResponse.credential
                }
            )
            localStorage.setItem("token",result.data.jwtToken)
            localStorage.setItem("user",JSON.stringify(result.data.user))
            navigate("/dashboard")
        }
        catch (error) {
            console.log(error)
        }
    }
    return (

        <div
            style={{
                height: "100vh",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                background: "#f4f6f9"
            }}
        >

            <div
                style={{
                    background: "#fff",
                    padding: "40px",
                    borderRadius: "15px",
                    boxShadow: "0 0 10px rgba(0,0,0,0.1)",
                    textAlign: "center"
                }}
            >

                <p
                    style={{
                        marginBottom: "20px"
                    }}
                >
                    Continue with Google
                </p>

                <GoogleLogin
                    onSuccess={handleSuccess}
                    onError={() => console.log("Login Failed")}
                />

            </div>

        </div>
    )
}

export default Login