import React, {useState} from 'react'
import { v4 } from "uuid";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

function Home() {
  const navigate = useNavigate()

  const [roomID, setroomID] = useState('')
  const [username, setusername] = useState('')


  const createNewRoom = () => {
    const id = v4()
    setroomID(id)
    toast.success("New room created")

  }

  const joinRoom = () => {
    if(!roomID){
      toast.error("Room ID is required")
    }
    else if(!username){
      toast.error("Username is required")
    }
    else{
      navigate(`/editor/${roomID}`, {
        state: {
          username
        }
      })
    }
  }

  const handleEnter = (e) => {
    if (e.code === "Enter") {
      joinRoom()
    }
  }

  return (
    <div className='homeWrapper'>
      <div className='formWrapper'>
        <h1>CoLabCode</h1>
        <h3 className='mainLabel'>Paste invitation Room ID</h3>
        <div className='inputField'>
          <input
            type='text'
            className='inputBox'
            placeholder='ROOM ID'
            value={roomID}
            onChange={(e) => setroomID(e.target.value)}
            onKeyUp={handleEnter}
          />

          <input
            type='text'
            className='inputBox'
            placeholder='USERNAME'
            value={username}
            onChange={(e) => setusername(e.target.value)}
            onKeyUp={handleEnter}
          />

          <button className='btn joinBtn btn-color1' onClick={joinRoom}>Join</button>
          <div className='createRoom'>
            If you don't have an invite create <span className='createRoomBtn' onClick={createNewRoom}>new room</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home