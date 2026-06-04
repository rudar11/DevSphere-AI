// import React, { useState, useContext } from 'react'
// import { Link, useNavigate } from 'react-router-dom'
// import axios from '../config/axios'
// import { UserContext } from '../context/user.context'
// const Login = () => {

//     const [email, setEmail] = useState('')
//     const [password, setPassword] = useState('')



//     const { setUser } = useContext(UserContext)

//     const navigate = useNavigate()

//     function submitHandler(e) {
//         e.preventDefault()
//         axios.post('/api/users/login', {
//             email, password
//         }).then((res) => {
//             console.log(res.data)

//             localStorage.setItem('token', res.data.token)
//             setUser(res.data.user)

//             navigate('/')
//         }).catch((err) => {
//             console.log(err.response.data)
//         })
//     }


//     return (
//         <div className="min-h-screen flex items-center justify-center bg-gray-900">
//             <div className="bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-md">
//                 <h2 className="text-2xl font-bold text-white mb-6">Login</h2>
//                 <form
//                     onSubmit={submitHandler}
//                 >
//                     <div className="mb-4">
//                         <label className="block text-gray-400 mb-2" htmlFor="email">Email</label>
//                         <input

//                             onChange={(e) => setEmail(e.target.value)}
//                             type="email"
//                             id="email"
//                             className="w-full p-3 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
//                             placeholder="Enter your email"
//                         />
//                     </div>
//                     <div className="mb-6">
//                         <label className="block text-gray-400 mb-2" htmlFor="password">Password</label>
//                         <input
//                             onChange={(e) => setPassword(e.target.value)}
//                             type="password"
//                             id="password"
//                             className="w-full p-3 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
//                             placeholder="Enter your password"
//                         />
//                     </div>
//                     <button
//                         type="submit"
//                         className="w-full p-3 rounded bg-blue-500 text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
//                     >
//                         Login
//                     </button>
//                 </form>
//                 <p className="text-gray-400 mt-4">
//                     Don't have an account? <Link to="/register" className="text-blue-500 hover:underline">Create one</Link>
//                 </p>
//             </div>
//         </div>
//     )
// }

// export default Login






import React, { useState, useContext } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from '../config/axios'
import { UserContext } from '../context/user.context'

const Login = () => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const { setUser } = useContext(UserContext)
    const navigate = useNavigate()

    function submitHandler(e) {
        e.preventDefault()
        axios.post('/api/users/login', {
            email, password
        }).then((res) => {
            console.log(res.data)
            localStorage.setItem('token', res.data.token)
            setUser(res.data.user)
            navigate('/')
        }).catch((err) => {
            console.log(err.response.data)
        })
    }

    return (
        // Main container matching Register page
        <div className="min-h-screen flex items-center justify-center bg-gray-950 p-4 font-sans antialiased">
            
            {/* Card: Same premium 3D shadow and subtle border */}
            <div className="bg-gray-900 p-8 sm:p-12 rounded-3xl shadow-[0_20px_50px_rgba(8,_112,_184,_0.1)] border border-gray-800 w-full max-w-md transition-all duration-300 ease-in-out hover:border-gray-700">
                
                {/* Header: Consistent typography */}
                <div className="text-center mb-10">
                    <h2 className="text-4xl font-extrabold text-white tracking-tight">Login</h2>
                    <p className="text-gray-500 mt-2 text-sm">Welcome back! Please enter your details.</p>
                </div>

                <form onSubmit={submitHandler} className="space-y-6">
                    {/* Email Input Field */}
                    <div className="relative">
                        <label className="text-sm font-medium text-gray-300 block mb-2" htmlFor="email">
                            Email Address
                        </label>
                        <input
                            onChange={(e) => setEmail(e.target.value)}
                            type="email"
                            id="email"
                            required
                            className="w-full px-4 py-3.5 rounded-xl bg-gray-800/50 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition duration-200"
                            placeholder="Enter your email"
                        />
                    </div>

                    {/* Password Input Field */}
                    <div className="relative">
                        <label className="text-sm font-medium text-gray-300 block mb-2" htmlFor="password">
                            Password
                        </label>
                        <input
                            onChange={(e) => setPassword(e.target.value)}
                            type="password"
                            id="password"
                            required
                            className="w-full px-4 py-3.5 rounded-xl bg-gray-800/50 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition duration-200"
                            placeholder="Enter your password"
                        />
                    </div>

                    {/* Submit Button with the exact same light hover & subtle glow effect */}
                    <div className="pt-2">
                        <button
                            type="submit"
                            className="w-full p-4 rounded-xl bg-blue-600 text-white font-bold text-lg hover:bg-blue-500 active:scale-[0.98] transition-all duration-200 ease-in-out hover:shadow-[0_0_20px_3px_rgba(59,130,246,0.3)] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900"
                        >
                            Login
                        </button>
                    </div>
                </form>

                {/* Footer Link: Matches Register page structure */}
                <div className="mt-8 text-center pt-6 border-t border-gray-800">
                    <p className="text-gray-400 text-sm">
                        Don't have an account?{' '}
                        <Link to="/register" className="text-blue-400 font-semibold hover:text-blue-300 hover:underline transition-colors duration-200">
                            Create one
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    )
}

export default Login