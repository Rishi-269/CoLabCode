import React, { useEffect, useRef, useState } from 'react'
import User from '../components/User'
import Editor from '../components/Editor'
import { initSocket } from '../socket'
import { useLocation, useNavigate, Navigate, useParams } from 'react-router-dom'
import toast from 'react-hot-toast'

function EditorPage() {

  const socketRef = useRef(null)
  const codeRef = useRef(null)
  const location = useLocation()
  const {roomID} = useParams()
  const reactNavigator = useNavigate()

  const [users, setusers] = useState([])

  useEffect(() => {
    const init = async () => {
      socketRef.current = await initSocket()
      socketRef.current.on('connect_error', (err) => handleErrors(err))
      socketRef.current.on('connect_failed', (err) => handleErrors(err))

      function handleErrors(e){
        console.log('socket error', e);
        toast.error("Socket connection failed, try again later")
        reactNavigator('/')
      }

      //emit when join
      socketRef.current.emit('join', {
        roomID,
        username: location.state?.username
      })

      //joined event listen (update user list and toast joined)
      socketRef.current.on('joined', ({users, username, socketId}) => {
          if(username !== location.state?.username){
            toast.success(`${username} joined`)
          }

          setusers(users)
          socketRef.current.emit('sync-code', {
            code: codeRef.current, 
            socketId
          })
      })

      //disconnected event listen (remove the disconnected user from list and toast left)
      socketRef.current.on('disconnected', ({socketId, username}) => {
        toast.success(`${username} left the room`)
        setusers((prev) => {
          return prev.filter((user) => (user.socketId != socketId))
        })
      })

    }

    init()

    return () => {
      socketRef.current.off('join')
      socketRef.current.off('disconnected')
      socketRef.current.disconnect()
    }

  }, [])
  
  async function copyRoomID(){
    try {
      await navigator.clipboard.writeText(roomID)
      toast.success("Room ID copied to clipboard")
    } catch(err) {
      toast.success("Couldn't copy the Room ID")
    }
  }

  function leaveRoom() {
    reactNavigator('/')
  }


  if(!location.state){
    return <Navigate to='/'/>
  }

  return (
    <div className='editorPageWrapper'>
      <div className='sideBar'>
        <div className='topSide'>
          <h1>CoLabCode</h1>

          <h3>Connected</h3>

          <div className='userList'>
            {users.map((user) => {
                return <User key={user.socketId} username={user.username}/>
              })}
          </div>
        </div>
        

        <button className='btn copyBtn btn-color2' onClick={copyRoomID}>Copy RoomID</button>
        <button className='btn leaveBtn btn-color1' onClick={leaveRoom}>Leave</button>

      </div>

      <div className='editorWrapper'>
        <Editor socketRef={socketRef} roomID={roomID} onCodeChange={(code) => {codeRef.current = code}}/>
      </div>
    </div>
  )
}

export default EditorPage