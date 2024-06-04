// Must Have
    // Authorization
        // Create account
        // Login for functionality
    // Multi-User - include polling for new posts
    // Text Posts - full CRUD (only for your own posts)
        // Display author name
        // Display date posted
        // Display text content
    // Read other user posts
// Should Have
    // Image Posts - full CRUD (only for your own posts)
    // Deploy to production - Vercel for client (React) and Fly for server (Django)
    // Some sort of interaction with another user’s post (Like/Comment/Share/Repost)
// Could Have
    // Public facing user profile
    // View user information 
    // Edit user information - full CRUD (only for your own)
    // Link to user profile from author name on posts
    // User avatars (image displayed for user) - full CRUD (only for your own)
// Wish List
    // Block user (their posts aren’t visible)
    // Use a date library to manage date functionality on the frontend - Date-FNS or Moment
    // Overwrite one of the CRUD methods on a viewset class
    // Private chat (direct messaging another user)

import Container from "react-bootstrap/Container"
import Row from "react-bootstrap/Row"
import Col from "react-bootstrap/Col"

import { TextField } from "@mui/material"
import { Button } from "@mui/material"
import { IconButton } from "@mui/material"

// import { Send } from "@mui/icons-material"
// import { Delete } from "@mui/icons-material"

import { v4 as uuidv4 } from 'uuid';

import { useContext, useState, useEffect } from "react"
import { AuthContext } from "./authContext"
import { getPosts, createTextPost, editTextPost, deleteTextPost } from "./api"


function Post(props) {
    const id = props.id
    const author = props.author
    const text = props.text
    const date = props.date
    const likes = props.likes

    return (
        <div>
            <div>
                {author}
            </div>
            <div>
                {text}
            </div>
            <div>
                {date}
            </div>
            <div>
                {likes}
            </div>
        </div>
    )
}

function PostMaker(props) {
    return (
        <div>

        </div>
    )
}

function Feed() {
    const { auth } = useContext(AuthContext)
    const [posts, setPosts] = useState({})

    useEffect( () => {
        getPosts( {auth, setPosts} )
    }, [])

    let keys = Object.keys(posts)
    let postList = []

    for (let i = 0; i < keys.length; i++) {
        let post = posts[keys[i]]
        let postID = post.id

        postList.push(
            <Post 
                id={postID}
                key={uuidv4()}
                author={post.user}
                text={post.post_text}
                likes={post.likes}
                // setPosts={setPosts}
            />
        )
    }

    return (
        <div>
            <PostMaker />
            {postList}
        </div>
    )
}

export default Feed