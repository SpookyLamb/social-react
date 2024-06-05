// Must Have
    // Authorization (DONE)
        // Create account (DONE)
        // Login for functionality (DONE)
    // Multi-User - poll for new posts (DONE)
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

function Buttons(props) {
    const onEdit = props.onEdit
    const onDelete = props.onDelete

    return (
        <>
            <Col className="col-2 text-center">
            <IconButton aria-label="edit" onClick={() => {onEdit()}}>
                <Edit />
            </IconButton>
            </Col>
            <Col className="col-2 text-center">
                <IconButton aria-label="delete" onClick={() => {onDelete()}}>
                    <Delete />
                </IconButton>
            </Col>
        </>
    )
}

function Post(props) {
    const { auth } = useContext(AuthContext)

    const id = Number(props.id)
    const author = props.author
    const date = props.date //string
    const likes = props.likes //array
    const username = props.auth.username
    const setPosts = props.setPosts

    const [editing, setEditing] = useState(false)
    const [text, setText] = useState(props.text)

    function onEdit() {
        setEditing(!editing)
    }

    function onDelete() {
        deleteTextPost( {auth, id, setPosts} )
    }

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
            <Buttons onEdit={onEdit} onDelete={onDelete}/>
        )
    } else { //other people's posts, no buttons
        buttons = (
            <></>
        )
    }

    let content
    if (editing) {
        content = (
            <TextField value={text} multiline fullWidth
            onChange={(e) => {
                setText(e.target.value)
            }}
            onKeyDown={(e) => {
                if (e.key === "Enter") {
                    editTextPost({ auth, id, postText: text, setPosts })
                }
            }}
            />
        )
    } else {
        content = text
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
                    {content}
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
    const auth = props.auth
    const setPosts = props.setPosts

    const [postContent, setPostContent] = useState("")
    const [charCount, setCharCount] = useState(0)

    function submit() {
        createTextPost({auth, postText: postContent, setPosts})
    }

    return (
        <Row className="border py-3">
            <Container>
                <Row>
                    <h2>Create A New Post!</h2>
                </Row>
                <Row>
                    <Col className="text-center">
                        <TextField id="post-field" multiline fullWidth onChange={(e) => {
                            let text = e.target.value

                            if (text.length < 281) {
                                setPostContent(text)
                                setCharCount(text.length)
                            } else {
                                e.target.value = postContent
                            }
                        }}/>
                    </Col>
                </Row>
                <Row className="py-2">
                    <Col className="text-start">
                        {charCount + "/280"}
                    </Col>
                    <Col className="text-end">
                        <Button variant="contained" endIcon={<Send/>} onClick={() => {
                            submit()
                            //reset
                            const postField = document.getElementById("post-field")
                            postField.value = ""
                            setPostContent("")
                            setCharCount(0)
                        }}>
                            Send
                        </Button>
                    </Col>
                </Row>
            </Container>
        </Row>
    )
}

function Feed() {
    const { auth } = useContext(AuthContext)
    const [posts, setPosts] = useState({})
    let queuedPosts = {}

    function poll() {

        function setQPosts(obj) {
            queuedPosts = obj
        }

        getPosts( {auth, setPosts: setQPosts} ) //queue the new posts instead of updating them constantly
    }

    useEffect( () => {
        getPosts( {auth, setPosts} )
        setInterval(poll, 10000)
    }, [])

    let keys = Object.keys(posts)
    let postList = []

    for (let i = 0; i < keys.length; i++) {
        let post = posts[keys[i]]
        let postID = post.id

        postList.push(
            <Row className="py-2" key={uuidv4()}>
                <Post 
                    id={postID}
                    author={post.user}
                    date={post.created_at}
                    text={post.post_text}
                    likes={post.likes}
                    auth={auth}
                    setPosts={setPosts}
                />
            </Row>
        )
    }

    postList.reverse() //newest posts first

    return (
        <div>
            <Container id="feed" className="feed">
                <PostMaker auth={auth} setPosts={setPosts}/>
                {postList}
            </Container>
        </div>
    )
}

export default Feed