import axios from 'axios'

//export const baseUrl = 'http://127.0.0.1:8000' //local dev
export const baseUrl = 'https://chatterbox-django.fly.dev' //production

//helper functions

export function saveLogin(authToken, authRefresh, username) {
    localStorage.setItem("access", authToken)
    localStorage.setItem("refresh", authRefresh)
    localStorage.setItem("username", username)
    console.log("Saved login information.")
}

export function deleteLogin() {
    localStorage.removeItem("access")
    localStorage.removeItem("refresh")
    localStorage.removeItem("username")
    localStorage.removeItem("userID")
    console.log("Deleted old login information.")
}

//user auth

export const createUser = ({username, password, email, firstName, lastName}) => {
    axios({
        method: 'post',
        url: `${baseUrl}/create-user/`,
        data: {
            username,
            password,
            email,
            first_name: firstName,
            last_name: lastName,
        }
    }).then(response => {
        console.log("CREATE USER RESPONSE: ", response)
    }).catch(error => console.log('ERROR: ', error))
}

export const getToken = ({ auth, username, password }) => {
    axios.post(`${baseUrl}/token/`, {
        username,
        password,
    }).then(response => {
        auth.setAccessToken(response.data.access)
        auth.setUsername(username)
        getUserID(response.data.access, auth)
        saveLogin(response.data.access, response.data.refresh, username)
    }).catch(error => console.log("ERROR: ", error))
}

const getUserID = (accessToken, auth) => {
    axios({
        method: 'get',
        url: `${baseUrl}/user-id/`,
        headers: {
            Authorization: `Bearer ${accessToken}`
        },
    }).then(response => {
        console.log("GET USER RESPONSE: ", response)
        auth.setUserID(response.data.id)
        localStorage.setItem("userID", response.data.id)
    }).catch(error => console.log("ERROR: ", error))
}

export const fetchUser = ({ auth }) => {
    axios({
        method: 'get',
        url: `${baseUrl}/profile/`,
        headers: {
            Authorization: `Bearer ${auth.accessToken}`
        },
    }).then(response => {
        console.log('FETCH USER RESPONSE: ', response)
    }).catch(error => console.log("ERROR: ", error))
}

//post CRUD

export const getPosts = ({ auth, setPosts }) => {
    axios({
        method: 'get',
        url: `${baseUrl}/get-posts/`,
        headers: {
            Authorization: `Bearer ${auth.accessToken}`
        },
    }).then(response => {
        // console.log("FETCH POSTS RESPONSE: ", response)
        setPosts(response.data)
    }).catch(error => {
        console.log("ERROR: ", error)
    })
}

export const createTextPost = ({ auth, postText, image, setPosts }) => {

    if (!image) { //no image is undefined/false, set to null before being sent over
        image = null
    }

    axios({
        method: 'post',
        url: `${baseUrl}/create-post/`,
        headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${auth.accessToken}`
        },
        data: {
            text: postText,
            image,
        }
    }).then(response => {
        // console.log("CREATE POST RESPONSE: ", response)
        getPosts({ auth, setPosts })
    }).catch(error => {
        console.log("ERROR: ", error)
    })
}

export const editTextPost = ({ auth, id, postText, setPosts }) => {
    axios({
        method: 'put',
        url: `${baseUrl}/edit-post/`,
        headers: {
            Authorization: `Bearer ${auth.accessToken}`
        },
        data: {
            id,
            text: postText,
        }
    }).then(response => {
        // console.log("EDIT POST RESPONSE: ", response)
        getPosts({ auth, setPosts })
    }).catch(error => {
        console.log("ERROR: ", error)
    })
}

export const deleteTextPost = ({ auth, id, setPosts }) => {
    axios({
        method: 'delete',
        url: `${baseUrl}/delete-post/`,
        headers: {
            Authorization: `Bearer ${auth.accessToken}`
        },
        data: {
            id,
        },
    }).then(response => {
        // console.log("DELETE POST RESPONSE: ", response.status)
        getPosts( {auth, setPosts} )
    }).catch(error => {
        console.log("ERROR: ", error)
    })
}

// likes

export const likePost = ({ auth, id, liked }) => {
    axios({
        method: 'put',
        url: `${baseUrl}/like-post/`,
        headers: {
            Authorization: `Bearer ${auth.accessToken}`
        },
        data: {
            id,
            liked,
        },
    }).then(response => {
        console.log("LIKED POST RESPONSE: ", response.status)
    }).catch(error => {
        console.log("ERROR: ", error)
    })
}