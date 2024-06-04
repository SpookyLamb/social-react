// Must Have
    // Authorization (DONE)
        // Create account (DONE)
        // Login for functionality (DONE)
    // Multi-User - include polling for new posts
    // Text Posts
        // Full CRUD, own posts 
        // Display author name (DONE)
        // Display date posted (DONE)
        // Display text content (DONE)
    // Read other user posts (DONE)
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

import { Send } from "@mui/icons-material"
import { Delete } from "@mui/icons-material"
import { Edit } from "@mui/icons-material"

import { v4 as uuidv4 } from 'uuid';

import { useContext, useState, useEffect } from "react"
import { AuthContext } from "./authContext"
import { getPosts, createTextPost, editTextPost, deleteTextPost } from "./api"

function Buttons() {
    return (
        <>
            <Col className="col-2 text-center">
            <IconButton aria-label="edit">
                <Edit />
            </IconButton>
            </Col>
            <Col className="col-2 text-center">
                <IconButton aria-label="delete">
                    <Delete />
                </IconButton>
            </Col>
        </>
    )
}

function Post(props) {
    const id = props.id
    const author = props.author
    const text = props.text
    const date = props.date //string
    const likes = props.likes //array
    const username = props.auth.username

    function formatDate(unDate) {
        //ex date: "2024-06-04T14:11:37.347933Z"
        //this is kinda a stupid way to do it, BUT...
        let array = unDate.split("")
        let newDate = ""

        for (const char of array) { //cut out the extra fluff
            let end = false;

            switch (char) {
                case "T":
                    newDate += " "
                    break
                case ".":
                    end = true
                    break
                default:
                    newDate += char
            }

            if (end) {
                break //end loop
            }
        }

        //ex newdate: "2024-06-04 14:11:37"

        return newDate
    }

    let buttons
    if (author == username) { //own posts
        buttons = (
            <Buttons/>
        )
    } else {
        buttons = (
            <></>
        )
    }

    return (
        <Container className="border">
            <Row>
                <Col className="col-8 px-3 pt-3">
                    {"@" + author}
                </Col>
                {buttons}
            </Row>
            <Row>
                <Col className="fs-2 p-3">
                    {text}
                </Col>
            </Row>
            <Row className="pb-2">
                <Col className="col-8">
                    {formatDate(date)}
                </Col>
                <Col className="col-4">
                    HEART {likes.length}
                </Col>
            </Row>
        </Container>
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
                date={post.created_at}
                text={post.post_text}
                likes={post.likes}
                auth={auth}
                // setPosts={setPosts}
            />
        )
    }

    return (
        <div>
            <PostMaker />
            <Container id="feed">
                {postList}
            </Container>
        </div>
    )
}

export default Feed