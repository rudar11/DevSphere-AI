// import React, { useContext, useState, useEffect } from 'react'
// import { UserContext } from '../context/user.context'
// import axios from '../config/axios'
// import { useNavigate } from 'react-router-dom'
// const Home = () => {

//     const { user } = useContext(UserContext)

//     const [isModalOpen, setIsModalOpen] = useState(false)
//     // const [projectName, setProjectName] = useState(null)
//     const [projectName, setProjectName] = useState("")
//     const [project, setProject] = useState([])


//     const navigate = useNavigate()


//     function createProject(e) {
//         e.preventDefault()
//         console.log({ projectName })

//         axios.post('/api/projects/create', {
//             name: projectName,
//         }).then((res) => {
//             console.log(res)
//             setIsModalOpen(false)
//         })
//             .catch((error) => {
//                 console.log(error)
//             })
//     }



//     useEffect(() => {

//         axios.get('/api/projects/all').then((res) => {


//             setProject(res.data.projects)


//         }).catch(err => {
//             console.log(err)
//         })



//     }, [])

//     return (
//         <main className='p-4'>
//             <div className='projects flex flex-wrap gap-4'>

//                 <button

//                     onClick={() => setIsModalOpen(true)}
//                     className='project p-4 border border-slate-400 rounded-md'>
//                     New Project
//                     <i className="ri-link ml-2"></i>
//                 </button>

//                 {

//                     project.map((project) => (

//                         <div key={project._id}

//                             onClick={() => {
//                                 navigate(`/project`, {

//                                     state: { project }

//                                 })
//                             }}

//                             className='project flex flex-col gap-2 p-4 border border-slate-300 cursor-pointer rounded-md min-w-52 hover:bg-slate-200'>
//                             <h2 className='font-medium'>{project.name}</h2>

//                             <div className='flex gap-2'>
//                                 <p><small><i className='ri-user-line'></i>Collaborators</small></p>
//                                 {project.users.length}
//                             </div>



//                         </div>
//                     ))
//                 }


//             </div>

//             {isModalOpen && (
//                 <div className="fixed inset-0 flex items-center justify-center bg-black/20">
//                     <div className="bg-white p-6 rounded-md shadow-md w-1/3">
//                         <h2 className="text-xl mb-4">Create New Project</h2>
//                         <form onSubmit={createProject}>
//                             <div className="mb-4">
//                                 <label className="block text-sm font-medium text-gray-700">Project Name</label>
//                                 <input
//                                     onChange={(e) => setProjectName(e.target.value)}
//                                     value={projectName}
//                                     type="text" className="mt-1 block w-full p-2 border border-gray-300 rounded-md" required />
//                             </div>
//                             <div className="flex justify-end">
//                                 <button type="button" className="mr-2 px-4 py-2 bg-gray-300 rounded-md" onClick={() => setIsModalOpen(false)}>Cancel</button>
//                                 <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-md">Create</button>
//                             </div>
//                         </form>
//                     </div>
//                 </div>
//             )}

//         </main>
//     )
// }

// export default Home









import React, { useContext, useState, useEffect } from 'react'
import { UserContext } from '../context/user.context'
import axios from '../config/axios'
import { useNavigate } from 'react-router-dom'

const Home = () => {
    const { user } = useContext(UserContext)

    const [isModalOpen, setIsModalOpen] = useState(false)
    const [projectName, setProjectName] = useState("")
    const [project, setProject] = useState([])

    const navigate = useNavigate()

    function createProject(e) {
        e.preventDefault()
        console.log({ projectName })

        axios.post('/api/projects/create', {
            name: projectName,
        }).then((res) => {
            console.log(res)
            setIsModalOpen(false)
            // Optional: Agar tum chaho toh yahan api dubara call kara sakte ho takki naya project turant list ho jaye
        })
            .catch((error) => {
                console.log(error)
            })
    }

    useEffect(() => {
        axios.get('/api/projects/all').then((res) => {
            setProject(res.data.projects)
        }).catch(err => {
            console.log(err)
        })
    }, [])

    return (
        // Main container with premium dark background
        <main className='min-h-screen bg-gray-950 text-gray-200 p-6 md:p-10 font-sans antialiased'>
            
            <div className="max-w-7xl mx-auto">
                <header className="mb-10">
                    <h1 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">Projects</h1>
                    <p className="text-gray-500 mt-2 text-sm md:text-base">Manage and access all your workspaces here.</p>
                </header>

                {/* Responsive Grid System: 1 col on mobile, 2 on tablet, 3-4 on desktop */}
                <div className='projects grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'>

                    {/* New Project Button (Dashed Card Style) */}
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className='project flex flex-col items-center justify-center gap-3 p-8 border-2 border-dashed border-gray-700 rounded-3xl bg-gray-900/30 hover:bg-gray-800/80 hover:border-gray-500 transition-all duration-300 ease-in-out cursor-pointer group min-h-[160px]'
                    >
                        <div className="w-12 h-12 rounded-full bg-gray-800 flex items-center justify-center group-hover:bg-blue-600 transition-colors">
                            <i className="ri-add-line text-2xl text-gray-400 group-hover:text-white"></i>
                        </div>
                        <span className='font-semibold text-gray-400 group-hover:text-white transition-colors'>New Project</span>
                    </button>

                    {/* Mapped Project Cards */}
                    {
                        project.map((projectItem) => (
                            <div key={projectItem._id}
                                onClick={() => {
                                    navigate(`/project`, {
                                        state: { project: projectItem }
                                    })
                                }}
                                className='project flex flex-col gap-4 p-6 bg-gray-900 border border-gray-800 cursor-pointer rounded-3xl min-h-[160px] hover:border-blue-500/50 hover:shadow-[0_8px_30px_rgba(59,130,246,0.1)] transition-all duration-300 ease-in-out group'
                            >
                                <div className="flex justify-between items-start">
                                    <h2 className='text-xl font-bold text-gray-100 group-hover:text-blue-400 transition-colors line-clamp-2'>
                                        {projectItem.name}
                                    </h2>
                                    <i className="ri-arrow-right-up-line text-gray-600 group-hover:text-blue-500 transition-colors text-xl"></i>
                                </div>

                                <div className='mt-auto flex items-center gap-2'>
                                    <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-950 border border-gray-800 rounded-lg text-sm text-gray-400 w-fit">
                                        <i className='ri-group-line text-blue-500'></i>
                                        <span>Collaborators: <span className="font-semibold text-gray-300">{projectItem.users.length}</span></span>
                                    </div>
                                </div>
                            </div>
                        ))
                    }
                </div>
            </div>

            {/* Premium Create Project Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm z-50 p-4">
                    {/* Width adjusted for mobile (w-full max-w-md) instead of fixed w-1/3 */}
                    <div className="bg-gray-900 border border-gray-700 p-8 rounded-3xl shadow-2xl w-full max-w-md relative animate-fade-in">
                        
                        <header className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-bold text-white tracking-tight">Create New Project</h2>
                            <button onClick={() => setIsModalOpen(false)} className='p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-full transition-colors'>
                                <i className="ri-close-line text-xl"></i>
                            </button>
                        </header>

                        <form onSubmit={createProject}>
                            <div className="mb-8 relative">
                                <label className="block text-sm font-medium text-gray-300 mb-2">Project Name</label>
                                <input
                                    onChange={(e) => setProjectName(e.target.value)}
                                    value={projectName}
                                    type="text" 
                                    placeholder="e.g. My Awesome App"
                                    className="w-full px-4 py-3.5 rounded-xl bg-gray-950 border border-gray-700 text-white placeholder-gray-600 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all duration-200" 
                                    required 
                                />
                            </div>
                            
                            <div className="flex justify-end gap-3">
                                <button 
                                    type="button" 
                                    className="px-5 py-2.5 bg-transparent hover:bg-gray-800 text-gray-400 hover:text-white font-medium rounded-xl transition-colors duration-200" 
                                    onClick={() => setIsModalOpen(false)}>
                                    Cancel
                                </button>
                                <button 
                                    type="submit" 
                                    disabled={!projectName.trim()}
                                    className={`px-6 py-2.5 font-semibold rounded-xl transition-all duration-200 ${
                                        projectName.trim() 
                                        ? 'bg-blue-600 text-white hover:bg-blue-500 active:scale-95 shadow-lg shadow-blue-900/30' 
                                        : 'bg-gray-800 text-gray-500 cursor-not-allowed'
                                    }`}>
                                    Create Project
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

        </main>
    )
}

export default Home