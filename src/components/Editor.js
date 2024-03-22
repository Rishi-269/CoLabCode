import React, { useEffect, useRef } from 'react'

import Codemirror from "codemirror";
import 'codemirror/lib/codemirror.css'
import 'codemirror/mode/javascript/javascript'
import 'codemirror/theme/midnight.css'
import 'codemirror/addon/edit/closetag'
import 'codemirror/addon/edit/closebrackets'

function Editor({socketRef, roomID, onCodeChange}) {
  const editorRef = useRef(null)

  useEffect(() => {
    async function init() {
      editorRef.current = Codemirror.fromTextArea(document.getElementById('realTimeEditor'), {
        mode: {name: 'javascript', json: true},
        theme: 'midnight',
        autoCloseTags: true,
        autoCloseBrackets: true,
        lineNumbers: true
      })

      editorRef.current.on('change', (instance, changes) => {
        const {origin} = changes //origin = type of event
        const code = instance.getValue() //gets the text in editor

        onCodeChange(code)

        if(origin !== 'setValue'){
          socketRef.current.emit('code-change', {
            roomID,
            code
          })
        }

      })

    }

    init();
  }, []);

  useEffect(() => {

    if(socketRef.current){
      socketRef.current.on('code-change', ({code}) => {
        if(code !== null){
          editorRef.current.setValue(code)
        }
      })
    }

    return () => {
      socketRef.current.off('code-change')
    }
  
  }, [socketRef.current])
  

  return (
    <textarea id='realTimeEditor'></textarea>
  )
}

export default Editor