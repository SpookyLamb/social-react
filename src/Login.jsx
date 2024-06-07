import Container from "react-bootstrap/Container"
import Row from "react-bootstrap/Row"
import Col from "react-bootstrap/Col"

import { TextField } from "@mui/material"
import { Button } from "@mui/material"

import { useContext, useState } from "react"
import { AuthContext } from "./authContext"
import { createUser, getToken } from "./api"
import { Create } from "@mui/icons-material"

function CreateUser() {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [passwordConf, setPasswordConf] = useState('')
    const [email, setEmail] = useState('')
    const [firstName, setFirstName] = useState('')
    const [lastName, setLastName] = useState('')

    const submit = () => {
        if (username.length < 4) {
            alert("Your username must be at least 4 characters long!")
        }
    
        if (password.length < 8) {
            alert("Your password must be at least 8 characters long!")
            return
        }
    
        if (password !== passwordConf) {
            alert("Passwords didn't match! Please try again.")
            return
        }

        if (email.length < 3) {
            alert("Please enter a valid email address!")
            return
        }

        if (firstName.length < 1) {
            alert("Please enter a first name!")
            return
        }

        if (lastName.length < 1) {
            alert("Please enter a last name!")
            return
        }
    
        createUser({username, password, email, firstName, lastName})

        //reset
        setUsername('')
        setPassword('')
        setPasswordConf('')
        setEmail('')
        setFirstName('')
        setLastName('')
    }
  
    return (
        <div className="py-2">
            <h2>Register</h2>
            <div>
            <Col>
                <TextField
                    label="Username"
                    variant="standard"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />
            </Col>
            <Col>
                <TextField
                    label="Password"
                    variant="standard"
                    type='password'
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
            </Col>
            <Col>
                <TextField
                    label="Confirm Password"
                    variant="standard"
                    type='password'
                    value={passwordConf}
                    onChange={(e) => setPasswordConf(e.target.value)}
                />
            </Col>
            <Col>
                <TextField
                    label="Email"
                    variant="standard"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
            </Col>
            <Col>
                <TextField
                    label="First Name"
                    variant="standard"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                />
            </Col>
            <Col>
                <TextField
                    label="Last Name"
                    variant="standard"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                />
            </Col>
            </div>
    
            <div className="pt-4">
            <Button className="mybutton" variant="contained" onClick={() => submit()}>Register!</Button>
            </div>
        </div>
    )
}

function LoginField() {
    const { auth } = useContext(AuthContext)
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')

    async function submit() {
      getToken({auth, username, password})
    }

    return (
        <div className="py-2">
            <h2>Login</h2>
            <Col className="p-1">
                <TextField
                    label="Username"
                    variant="standard"
                    className="loggedin"
                    id="userlogin"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />
            </Col>
            <Col className="p-1">
                <TextField
                    label="Password"
                    variant="standard"
                    className="loggedin"
                    id="passwordlogin"
                    type='password'
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
            </Col>
    
            <div className="pt-4">
                <Button className="mybutton" variant="contained" onClick={() => submit()}>Login!</Button>
            </div>
        </div>
    )
}

function Login() {
    const [registering, setRegistering] = useState(false)

    let display
    let buttonText
    if (registering) {
        display = (<CreateUser/>)
        buttonText = "Have an account?"
    } else {
        display = (<LoginField/>)
        buttonText = "Need an account?"
    }

    return (
        <Container className="p-5 text-center border rounded foreground-box">
            <h1 className="text-center p-3 pt-1">Chatterbox</h1>
            <hr className="pb-2" />
            {display}
            <Button className="mybutton pt-3" variant="text" onClick={() => {
                setRegistering(!registering)
            }}> {buttonText} </Button>
        </Container>
    )
}

export default Login