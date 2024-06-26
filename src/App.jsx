import React, { useEffect } from "react"
import axios from "axios"
import { useState } from "react"
import { useContext } from "react"
import { AuthContext } from "./authContext"
import { baseUrl, deleteLogin } from "./api"

import Login from "./Login"
import Feed from "./Feed"

const checkToken = ({ auth, setPageData }) => {
  //console.log("Access token: ", typeof auth.accessToken, auth.accessToken)

  if (typeof auth.accessToken !== "string") { //ignore bad accessTokens during page load
    return
  }

  axios({
      method: 'get',
      url: `${baseUrl}/profile/`,
      headers: {
          Authorization: `Bearer ${auth.accessToken}`
      },
  }).then(response => {
      console.log('CHECK TOKEN RESPONSE: ', response)
      setPageData(<Feed/>)
  }).catch(error => {
      console.log("ERROR: ", error)
      setPageData(<Login />)
  })
}

function App() {
  const {auth} = useContext(AuthContext)
  const [pageData, setPageData] = useState(<Login />)

  useEffect( () => {
    checkToken({ auth, setPageData })
  }, [auth.accessToken])

  return (
      <div className="p-4">
        {pageData}
      </div>
  )
}

export default App