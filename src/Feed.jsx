// Own Goals:
    // Add some limit to posts viewed instead of grabbing them all - Lazy Loading?

// Must Have
    // Authorization (DONE)
        // Create account (DONE)
        // Login for functionality (DONE)
    // Multi-User - poll for new posts (DONE)
    // Text Posts (DONE)
        // Full CRUD, own posts (DONE)
        // Display author name (DONE)
        // Display date posted (DONE)
        // Display text content (DONE)
    // Read other user posts (DONE)
// Should Have (DONE)
    // Ability to "like" another user's post (DONE)
    // Image Posts - full CRUD (only for your own posts) (DONE minus image editing)
    // Deploy to production - Vercel for client (React) and Fly for server (Django) (DONE)
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
import Image from "react-bootstrap/Image"

import { TextField } from "@mui/material"
import { Button } from "@mui/material"
import { IconButton } from "@mui/material"

import { Send } from "@mui/icons-material"
import { Delete } from "@mui/icons-material"
import { Edit } from "@mui/icons-material"
import { Favorite } from "@mui/icons-material"
import { FavoriteBorder } from "@mui/icons-material"

import { v4 as uuidv4 } from 'uuid';

import { useContext, useState, useEffect } from "react"
import { AuthContext } from "./authContext"
import { baseUrl, getPosts, createTextPost, editTextPost, deleteTextPost, likePost, deleteLogin } from "./api"

function FeedHeader(props) {
    const { auth } = useContext(AuthContext)
    const [newPostCount, setNewPostCount] = useState(0)
    const [queuedPosts, setQueuedPosts] = useState({})

    const posts = props.posts
    const setPosts = props.setPosts

    useEffect( () => {
        let qCount = Object.keys(queuedPosts).length
        let pCount = Object.keys(posts).length

        if (qCount > pCount) {
            setNewPostCount(qCount - pCount)
        }
    }, [queuedPosts])

    function poll() {
        getPosts( {auth, setPosts: setQueuedPosts} ) //queue the new posts instead of updating them constantly
    }

    useEffect( () => {
        setInterval(poll, 60000) //checks every minute for new posts = 60000
    }, [])

    function logout() {
        deleteLogin()
        auth.setUsername("")
        auth.setUserID("")
        auth.setAccessToken("")
    }

    function updatePosts() {
        if (Object.keys(queuedPosts).length > 0) {
            setPosts(queuedPosts)
            setNewPostCount(0)
        }
    }

    return (
        <Row className="pb-3">
            <Col className="text-start">
                <Button variant="contained" onClick={() => { updatePosts() }}>
                    {newPostCount + " New Posts"}
                </Button>
            </Col>
            <Col className="text-end">
                <Button variant="contained" onClick={() => { logout() }} >
                    Logout
                </Button>
            </Col>
        </Row>
    )
}

function Buttons(props) {
    const onEdit = props.onEdit
    const onDelete = props.onDelete

    return (
        <>
            <Col className="col-4 text-end pt-2">
                <IconButton size="small" aria-label="edit" onClick={() => {onEdit()}}>
                    <Edit />
                </IconButton>
                <IconButton size="small" aria-label="delete" onClick={() => {onDelete()}}>
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
    const setPosts = props.setPosts
    const imagePath = props.image

    const username = props.auth.username
    const userID = props.auth.userID

    const [editing, setEditing] = useState(false)
    const [text, setText] = useState(props.text)
    const [userLiked, setUserLiked] = useState(false)

    if (likes.includes(userID) && !userLiked) { //user previously liked the post, not yet liked
        setUserLiked(true)
    }

    function onEdit() {
        setEditing(!editing)
    }

    function onDelete() {
        deleteTextPost( {auth, id, setPosts} )
    }

    function onLike() {
        const status = !userLiked

        if (status) {
            likes.push(userID) //add like
        } else {
            likes.splice(likes.indexOf(userID), 1) //remove like
        }

        setUserLiked(status)
        likePost( { auth, id, liked: status} )
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
        array = newDate.split(" ") //split again, ex: ["2024-06-04", "14:11:37"]
        
        let calendar = array[0]
        let time = array[1]
        
        let calendarArray = calendar.split("-") //split AGAIN, ex ["2024", "06", "04"], aka year, month, day
        let timeArray = time.split(":") //split AGAIN AGAIN, ex: ["14", "11", "37"], aka hours, minutes, seconds
        
        let year = calendarArray[0]
        let month = calendarArray[1]
        let day = calendarArray[2]
        
        let hours = timeArray[0]
        let minutes = timeArray[1] //we don't care about seconds

        const monthLookup = {
            "01": "January",
            "02": "February",
            "03": "March",
            "04": "April",
            "05": "May",
            "06": "June",
            "07": "July",
            "08": "August",
            "09": "September",
            "10": "October",
            "11": "November",
            "12": "December",
        }

        newDate = hours + ":" + minutes + " - " + monthLookup[month] + " " + day + ", " + year

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

    let likeButton
    if (userLiked) {
        likeButton = (<Favorite />)
    } else {
        likeButton = (<FavoriteBorder />)
    }

    let imageContent
    if (imagePath) { //valid image
        imageContent = (
            <Row>
                <Col>
                    <Image src={`${baseUrl}${imagePath}`} fluid rounded className="p-2 pb-3" />
                </Col>
            </Row>
        )
    } else { //no image
        imageContent = (<></>)
    }

    return (
        <Container className="border rounded foreground-box roboto-regular">
            <Row>
                <Col className="col-8 px-3 pt-3 roboto-regular-italic">
                    {"@" + author}
                </Col>
                {buttons}
            </Row>
            <Row>
                <Col className="fs-3 p-3">
                    {content}
                </Col>
            </Row>
            
            {imageContent}

            <Row className="pb-2">
                <Col className="col-8 roboto-light">
                    {formatDate(date)}
                </Col>
                <Col className="col-4 text-end">
                    <IconButton aria-label="like" size="small" onClick={() => {
                        onLike()
                    }}>
                        {likeButton}
                        &nbsp;
                        {likes.length}
                    </IconButton>
                </Col>
            </Row>
        </Container>
    )
}

function PostMaker(props) {
    const auth = props.auth
    const setPosts = props.setPosts

    const [postContent, setPostContent] = useState("")
    const [image, setImage] = useState(undefined)
    const [charCount, setCharCount] = useState(0)

    function submit() {
        createTextPost({auth, postText: postContent, image, setPosts})
    }

    return (
        <Row className="border rounded py-3 foreground-box roboto-regular">
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

                <Row>
                    <Col>
                        <input
                            accept='image/*'
                            type='file'
                            onChange={e => setImage(e.target.files[0])}
                        />
                    </Col>
                </Row>

            </Container>
        </Row>
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
            <Row className="py-2" key={uuidv4()}>
                <Post 
                    id={postID}
                    author={post.user}
                    date={post.created_at}
                    text={post.post_text}
                    image={post.image}
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
                <FeedHeader key={uuidv4()} posts={posts} setPosts={setPosts} />
                <PostMaker auth={auth} setPosts={setPosts}/>
                {postList}
            </Container>
        </div>
    )
}

export default Feed