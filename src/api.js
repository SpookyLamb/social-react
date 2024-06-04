import axios from 'axios'

const baseUrl = 'http://127.0.0.1:8000'

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
        console.log("GET TOKEN RESPONSE: ", response)
        auth.setAccessToken(response.data.access)
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
        console.log("FETCH POSTS RESPONSE: ", response)
        setPosts(response.data)
    }).catch(error => {
        console.log("ERROR: ", error)
    })
}

export const createTextPost = ({ auth, postText, setPosts }) => {
    axios({
        method: 'post',
        url: `${baseUrl}/create-post/`,
        headers: {
            Authorization: `Bearer ${auth.accessToken}`
        },
        data: {
            text: postText,
        }
    }).then(response => {
        console.log("CREATE POST RESPONSE: ", response)
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
        console.log("EDIT POST RESPONSE: ", response)
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
        console.log("DELETE BOOK RESPONSE: ", response.status)
        getPosts( {auth, setPosts} )
    }).catch(error => {
        console.log("ERROR: ", error)
    })
}
