import './App.css'
import { Button } from "@/components/ui/button"
import { createBrowserRouter , RouterProvider } from 'react-router-dom'
import Login from './components/Login'
import Home from './components/Home'
import Register from './components/Register'
import { Toaster } from "@/components/ui/sonner"
import { useSelector } from 'react-redux'

const appRouter = createBrowserRouter([
  {
    path: '/',
    element: <Home />,
  },
  {
    path: '/login',
    element: <Login />
  },
  {
    path: '/register',
    element: <Register />
  }
])

function App() {
  const authState = useSelector((state) => state.auth);  // ✅ Check `auth` state
  const expenseState = useSelector((state) => state.expense);  // ✅ Check `expense` state

  console.log("Auth State:", authState);
  console.log("Expense State:", expenseState);

  return (
    <>
     <RouterProvider router={appRouter}></RouterProvider>
     <Toaster />
    </>
  )
}

export default App
