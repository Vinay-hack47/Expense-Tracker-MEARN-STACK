import './App.css'
import { Button } from "@/components/ui/button"
import { createBrowserRouter , RouterProvider } from 'react-router-dom'
import Login from './components/Login'
import Home from './components/Home'
import Register from './components/Register'
import { Toaster } from "@/components/ui/sonner"
import { useSelector } from 'react-redux'
import GroupManagement from './components/GroupManagement'
import Groups from './components/group/Groups'
import GroupDetails from './components/group/GroupDetails'
import GroupExpensePage from './components/group/GroupExpensePage'

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
  },
  {
    path: "/groups",
    element : <Groups></Groups>
  },
  {
    path: "/groups/:groupId",
    element : <GroupDetails></GroupDetails>
  },
  {
    path: "/expenses/group/:groupId",
    element : <GroupExpensePage></GroupExpensePage>
  },
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
