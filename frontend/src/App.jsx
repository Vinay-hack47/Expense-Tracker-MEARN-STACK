import './App.css'
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { Toaster } from "@/components/ui/sonner"

import Login from './components/Login'
import Home from './components/Home'
import Register from './components/Register'
import Groups from './components/group/Groups'
import GroupDetails from './components/group/GroupDetails'
import GroupExpensePage from './components/group/GroupExpensePage'
import ProtectedRoute from './components/ProtectedRoute' // ✅ import

const appRouter = createBrowserRouter([
  // redirect root to login or home depending on auth
  {
    path: '/',
    element: (
      <ProtectedRoute>
        <Home />
      </ProtectedRoute>
    ),
  },
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/register',
    element: <Register />,
  },
  {
    path: '/groups',
    element: (
      <ProtectedRoute>
        <Groups />
      </ProtectedRoute>
    ),
  },
  {
    path: '/groups/:groupId',
    element: (
      <ProtectedRoute>
        <GroupDetails />
      </ProtectedRoute>
    ),
  },
  {
    path: '/expenses/group/:groupId',
    element: (
      <ProtectedRoute>
        <GroupExpensePage />
      </ProtectedRoute>
    ),
  },
]);

function App() {
  const authState = useSelector((state) => state.auth);
  const expenseState = useSelector((state) => state.expense);
  const groupState = useSelector((state) => state.group);
  const groupExpenseState = useSelector((state) => state.groupExpense)

  console.log("Auth State:", authState);
  console.log("Expense State:", expenseState);
  console.log("Group State:", groupState);
  console.log("Group Expense State:", groupExpenseState);
  


  return (
    <>
      <RouterProvider router={appRouter} />
      <Toaster />
    </>
  );
}

export default App;
