import React, { useState, useEffect, useContext, useRef } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import axios from '../config/axios'
import { initializeSocket, receiveMessage, sendMessage } from '../config/socket'
import { UserContext } from '../context/user.context'
import Markdown from 'markdown-to-jsx'
import hljs from 'highlight.js';
import { getWebContainer } from '../config/webContainer'

function SyntaxHighlightedCode(props) {
  const ref = useRef(null)

  React.useEffect(() => {
    if (ref.current && props.className?.includes('lang-') && window.hljs) {
      window.hljs.highlightElement(ref.current)
      ref.current.removeAttribute('data-highlighted')
    }
  }, [props.className, props.children])

  return <code {...props} ref={ref} />
}

const Project = () => {
  const location = useLocation() 
  const [isSidePanelOpen, setIsSidePanelOpen] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedUserId, setSelectedUserId] = useState([])
  const [project, setProject] = useState(location.state.project)
  const [message, setMessage] = useState('')
  const { user } = useContext(UserContext)

  const messageBox = useRef(null)

  const [users, setUsers] = useState([])
  const [messages, setMessages] = useState([])
  const [fileTree, setFileTree] = useState({})

  const [currentFile, setCurrentFile] = useState(null)
  const [openFiles, setOpenFiles] = useState([])

  const [webContainer, setWebContainer] = useState(null)
  const [iframeUrl, setIframeUrl] = useState(null)

  const [runProcess, setRunProcess] = useState(null)

  const handleUserClick = (id) => {
    setSelectedUserId(prevSelectedUserId => {
      const newSelectedUserId = new Set(prevSelectedUserId);
      if (newSelectedUserId.has(id)) {
        newSelectedUserId.delete(id);
      } else {
        newSelectedUserId.add(id);
      }
      return newSelectedUserId;
    });
  }

  function addCollaborators() {
    axios.put('/api/projects/add-user', {
      projectId: location.state.project._id,
      users: Array.from(selectedUserId)
    }).then(res => {
      console.log(res.data)
      setIsModalOpen(false)
    }).catch(err => {
      console.log(err)
    })
  }

  const send = () => {
    if (!message.trim()) return;

    sendMessage('project-message', {
      message,
      sender: user
    })
    setMessages(prevMessages => [...prevMessages, { sender: user, message }])
    setMessage("")
  }

  function WriteAiMessage(message) {
    const messageObject = JSON.parse(message)
    return (
      <div className='overflow-auto break-words bg-gray-950 text-gray-300 rounded-lg p-3 border border-gray-800 shadow-inner'>
        <Markdown
          children={messageObject.text}
          options={{
            overrides: {
              code: SyntaxHighlightedCode,
            },
          }}
        />
      </div>)
  }

  useEffect(() => {
    initializeSocket(project._id)

    if (!webContainer) {
      getWebContainer().then(container => {
        setWebContainer(container)
        console.log("container started")
      })
    }

    receiveMessage('project-message', data => {
      console.log(data)
      if (data.sender._id == 'ai') {
        const message = JSON.parse(data.message)
        console.log(message)
        webContainer?.mount(message.fileTree)
        if (message.fileTree) {
          setFileTree(message.fileTree || {})
        }
        setMessages(prevMessages => [...prevMessages, data]) 
      } else {
        setMessages(prevMessages => [...prevMessages, data]) 
      }
    })

    axios.get(`/api/projects/get-project/${location.state.project._id}`).then(res => {
      console.log(res.data.project)
      setProject(res.data.project)
      setFileTree(res.data.project.fileTree || {})
    })

    axios.get('/api/users/all').then(res => {
      setUsers(res.data.users)
    }).catch(err => {
      console.log(err)
    })
  }, [])

  function saveFileTree(ft) {
    axios.put('/api/projects/update-file-tree', {
      projectId: project._id,
      fileTree: ft
    }).then(res => {
      console.log(res.data)
    }).catch(err => {
      console.log(err)
    })
  }

  function scrollToBottom() {
    if (messageBox.current) {
      messageBox.current.scrollTop = messageBox.current.scrollHeight
    }
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  return (
    <main className='min-h-screen lg:h-screen w-full flex flex-col lg:flex-row bg-gray-950 text-gray-200 font-sans antialiased overflow-x-hidden'>

      {/* LEFT SECTION - Chat & Collaborators */}
      <section className="left relative flex flex-col w-full lg:w-[320px] lg:min-w-[320px] h-[60vh] lg:h-screen bg-gray-900 border-b lg:border-b-0 lg:border-r border-gray-800 shadow-xl z-10 shrink-0">

        {/* Chat Header */}
        <header className='flex justify-between items-center p-3 px-4 w-full bg-gray-900/80 backdrop-blur-md border-b border-gray-800 absolute top-0 z-20'>
          <button
            className='flex gap-2 items-center text-sm font-medium text-gray-300 hover:text-white transition-colors bg-gray-800 hover:bg-gray-700 px-3 py-1.5 rounded-lg' 
            onClick={() => setIsModalOpen(true)}>
            <i className='ri-add-line text-lg'></i>
            <span>Add User</span>
          </button>

          <button
            onClick={() => setIsSidePanelOpen(!isSidePanelOpen)}
            className='p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors'>
            <i className='ri-group-fill text-lg'></i>
          </button>
        </header>

        {/* Chat Conversation Area */}
        <div className="conversation-area pt-16 pb-16 flex-grow flex flex-col h-full relative">
          <div
            ref={messageBox} 
            className="message-box p-4 flex-grow flex flex-col gap-4 overflow-y-auto scrollbar-hide">
            
            {messages.map((msg, index) => {
              const isAi = msg?.sender?._id === 'ai';
              const isMe = (user?._id && msg?.sender?._id && String(msg.sender._id) === String(user._id)) || 
                           (user?.email && msg?.sender?.email && msg.sender.email === user.email);

              return (
                <div key={`${msg?.sender?._id ?? 'unknown'}-${index}`} 
                     className={`${isAi ? 'max-w-[90%]' : 'max-w-[85%]'} ${isMe ? 'ml-auto' : ''} flex flex-col`}>
                  
                  <small className={`text-[11px] mb-1 opacity-70 ${isMe ? 'text-right mr-1' : 'ml-1'}`}>
                    {msg?.sender?.email || 'Unknown User'}
                  </small>
                  
                  <div className={`p-3 rounded-2xl shadow-sm text-sm break-words overflow-hidden ${isMe ? 'bg-blue-600 text-white rounded-tr-none' : 'bg-gray-800 text-gray-200 border border-gray-700 rounded-tl-none'}`}>
                    {isAi ? WriteAiMessage(msg.message) : <p className="leading-relaxed whitespace-pre-wrap break-words">{msg.message}</p>}
                  </div>
                </div>
              )
            })}
          </div>

          {/* Chat Input Field */}
          <div className="inputField w-full flex items-center gap-2 absolute bottom-0 p-3 bg-gray-900 border-t border-gray-800">
            <input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && message.trim()) send()
              }}
              className='p-2.5 px-4 w-full rounded-xl border border-gray-700 bg-gray-950 text-gray-200 placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all'
              type="text"
              placeholder='Type a message...'
            />
            
            <button
              onClick={send}
              disabled={!message.trim()}
              className={`p-3 rounded-xl flex-shrink-0 flex items-center justify-center w-12 h-12 transition-all duration-300 ${
                message.trim() 
                  ? 'bg-blue-600 text-white hover:bg-blue-500 active:scale-95 shadow-[0_0_15px_rgba(59,130,246,0.3)] cursor-pointer' 
                  : 'bg-gray-800 text-gray-600 cursor-not-allowed opacity-80'
              }`}>
              <i className='ri-send-plane-fill text-lg'></i>
            </button>
          </div>
        </div>

        {/* Side Panel (Collaborators List) */}
        <div className={`sidepanel w-full h-full flex flex-col absolute z-30 bg-gray-900 border-r border-gray-800 transition-transform duration-300 ease-in-out ${isSidePanelOpen ? 'translate-x-0' : '-translate-x-full'} top-0 left-0`}>
          <header className='flex justify-between items-center px-5 py-4 border-b border-gray-800 bg-gray-900'>
            <h1 className='font-bold text-lg text-white tracking-wide'>Collaborators</h1>
            <button
              onClick={() => setIsSidePanelOpen(!isSidePanelOpen)}
              className='p-2 rounded-full text-gray-400 hover:text-white hover:bg-gray-800 transition-colors'>
              <i className='ri-close-line text-xl'></i>
            </button>
          </header>

          <div className="users flex flex-col gap-1 p-3 overflow-y-auto">
            {project.users && project.users.map(user => {
              const userKey = String(user?._id ?? user)
              return (
                <div key={userKey} className="user p-3 flex gap-3 items-center rounded-xl hover:bg-gray-800 cursor-pointer transition-colors border border-transparent hover:border-gray-700">
                  <div className='w-10 h-10 rounded-full flex items-center justify-center text-white bg-gradient-to-br from-indigo-500 to-purple-600 shadow-inner flex-shrink-0'>
                    <i className='ri-user-fill'></i>
                  </div>
                  <h1 className='font-medium text-sm text-gray-300 truncate'>
                    {typeof user === 'object' && user != null ? user.email : 'Unknown User'}
                  </h1>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* RIGHT SECTION - Workspace */}
      <section className='right flex-grow flex flex-col md:flex-row bg-gray-950 w-full overflow-hidden'>

        {/* File Explorer */}
        <div className="explorer w-full md:w-[220px] md:min-w-[220px] h-[30vh] md:h-full bg-[#131a28] border-b md:border-b-0 md:border-r border-gray-800 flex flex-col pt-2 shrink-0">
          <div className="px-4 py-2 text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Explorer</div>
          <div className="file-tree w-full overflow-y-auto">
            {Object.keys(fileTree).map((file, index) => (
              <button
                key={index}
                onClick={() => {
                  setCurrentFile(file)
                  setOpenFiles([...new Set([...openFiles, file])])
                }}
                className={`w-full text-left cursor-pointer p-2 px-4 flex items-center gap-2 transition-colors text-sm ${currentFile === file ? 'bg-blue-600/10 text-blue-400 border-l-2 border-blue-500' : 'text-gray-400 hover:bg-gray-800 hover:text-gray-200 border-l-2 border-transparent'}`}>
                <i className="ri-file-code-line text-lg"></i>
                <span className='font-medium truncate'>{file}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Code Editor Area */}
        <div className="code-editor flex flex-col flex-grow w-full min-h-[50vh] md:h-full overflow-hidden shrink min-w-0">
          
          <div className="top flex flex-col sm:flex-row justify-between items-start sm:items-center w-full bg-[#131a28] border-b border-gray-800">
            <div className="files flex overflow-x-auto scrollbar-hide w-full sm:w-auto">
              {openFiles.map((file, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentFile(file)}
                  className={`open-file cursor-pointer px-5 py-3 flex items-center gap-2 border-r border-gray-800 transition-colors whitespace-nowrap ${currentFile === file ? 'bg-gray-950 text-blue-400 border-t-2 border-t-blue-500' : 'bg-[#131a28] text-gray-500 hover:bg-gray-900 border-t-2 border-t-transparent'}`}>
                  <span className='font-medium text-sm'>{file}</span>
                </button>
              ))}
            </div>

            <div className="actions flex gap-2 p-2 sm:p-0 sm:pr-3 w-full sm:w-auto justify-end bg-[#131a28]">
              <button
                onClick={async () => {
                  await webContainer.mount(fileTree)
                  const installProcess = await webContainer.spawn("npm", ["install"])
                  installProcess.output.pipeTo(new WritableStream({
                    write(chunk) { console.log(chunk) }
                  }))

                  if (runProcess) {
                    runProcess.kill()
                  }

                  let tempRunProcess = await webContainer.spawn("npm", ["start"]);
                  tempRunProcess.output.pipeTo(new WritableStream({
                    write(chunk) { console.log(chunk) }
                  }))

                  setRunProcess(tempRunProcess)

                  webContainer.on('server-ready', (port, url) => {
                    console.log(port, url)
                    setIframeUrl(url)
                  })
                }}
                /* YAHAN FIX KIYA HAI: Naya Blue button class hover scale ke sath */
                className='flex items-center gap-1.5 px-4 py-1.5 bg-blue-600/20 text-blue-400 border border-blue-500/50 rounded-lg hover:bg-blue-600 hover:text-white hover:scale-105 transition-all duration-300 ease-in-out text-sm font-semibold active:scale-95 whitespace-nowrap shadow-sm hover:shadow-blue-500/30'
              >
                <i className="ri-play-fill text-lg"></i> Run
              </button>
            </div>
          </div>

          <div className="bottom flex flex-grow w-full overflow-hidden bg-gray-950 relative">
            {fileTree[currentFile] ? (
              <div className="code-editor-area absolute inset-0 overflow-auto">
                <pre className="hljs min-h-full w-full font-mono text-sm leading-relaxed p-4">
                  <code
                    className="hljs outline-none text-gray-300 block"
                    contentEditable
                    suppressContentEditableWarning
                    onBlur={(e) => {
                      const updatedContent = e.target.innerText;
                      const ft = {
                        ...fileTree,
                        [currentFile]: {
                          file: { contents: updatedContent }
                        }
                      }
                      setFileTree(ft)
                      saveFileTree(ft)
                    }}
                    dangerouslySetInnerHTML={{ __html: hljs.highlight(fileTree[currentFile].file.contents, { language: 'javascript' }).value }}
                    style={{
                      whiteSpace: 'pre-wrap',
                      paddingBottom: '25rem',
                      counterSet: 'line-numbering',
                    }}
                  />
                </pre>
              </div>
            ) : (
               <div className="flex items-center justify-center w-full h-full text-gray-600 flex-col gap-3 p-4 text-center absolute inset-0">
                  <i className="ri-code-box-line text-6xl opacity-30"></i>
                  <p>Select a file from the explorer to start coding.</p>
               </div>
            )}
          </div>
        </div>

        {/* Live Preview / Iframe */}
        {iframeUrl && webContainer &&
          (<div className="flex flex-col w-full md:w-[350px] md:min-w-[350px] lg:max-w-[500px] h-[50vh] md:h-full border-t md:border-t-0 md:border-l border-gray-800 bg-white shrink-0">
            <div className="address-bar flex items-center p-2 bg-[#131a28] border-b border-gray-800 gap-2 shrink-0">
              <div className="flex gap-1.5 px-2">
                <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
                <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
              </div>
              <input type="text"
                onChange={(e) => setIframeUrl(e.target.value)}
                value={iframeUrl} 
                className="w-full p-1.5 px-3 bg-gray-900 border border-gray-700 rounded-md text-gray-300 text-sm focus:outline-none focus:border-blue-500" 
              />
            </div>
            <iframe src={iframeUrl} className="w-full flex-grow bg-white border-none"></iframe>
          </div>)
        }
      </section>

      {/* Add Collaborator Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 border border-gray-700 shadow-2xl p-6 rounded-2xl w-full max-w-md relative flex flex-col max-h-[90vh]">
            <header className='flex justify-between items-center mb-6 shrink-0'>
              <h2 className='text-xl sm:text-2xl font-bold text-white tracking-tight'>Add Collaborator</h2>
              <button onClick={() => setIsModalOpen(false)} className='p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-full transition-colors'>
                <i className="ri-close-line text-2xl"></i>
              </button>
            </header>
            
            <div className="users-list flex flex-col gap-2 mb-20 overflow-y-auto pr-2 flex-grow">
              {users.map(user => {
                const isSelected = Array.from(selectedUserId).indexOf(user._id) != -1;
                return (
                  <div key={user._id} 
                    className={`user cursor-pointer rounded-xl p-3 flex gap-4 items-center transition-all border ${isSelected ? 'bg-blue-600/10 border-blue-500 text-blue-400' : 'bg-gray-800/50 border-gray-700 hover:bg-gray-800 hover:border-gray-600'}`} 
                    onClick={() => handleUserClick(user._id)}>
                    
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white shadow-inner transition-colors flex-shrink-0 ${isSelected ? 'bg-blue-600' : 'bg-gray-600'}`}>
                      <i className="ri-user-fill"></i>
                    </div>
                    <h1 className={`font-medium text-sm sm:text-base truncate ${isSelected ? 'text-blue-400' : 'text-gray-300'}`}>{user.email}</h1>
                    
                    {isSelected && <i className="ri-check-line ml-auto text-xl text-blue-500 flex-shrink-0"></i>}
                  </div>
                )
              })}
            </div>
            
            <div className="absolute bottom-6 left-0 right-0 px-6 bg-gray-900 pt-2 shrink-0">
               <button
                 onClick={addCollaborators}
                 className='w-full py-3.5 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-xl shadow-lg shadow-blue-900/30 active:scale-[0.98] transition-all'>
                 Add Selected Users
               </button>
            </div>
          </div>
        </div>
      )}

    </main>
  )
}

export default Project 