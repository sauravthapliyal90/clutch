import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { createBrowserRouter, RouterProvider } from 'react-router'
import Home from './pages/Home.jsx'
import Meets from './pages/Meets.jsx'
import MyGarage from './pages/MyGarage.jsx'
import { QueryClientProvider, QueryClient } from "@tanstack/react-query"
import { AuthProvider } from './context/AuthProvider.jsx'
import RequestOtp from './pages/RequestOtp.jsx'
import VerifyOtp from './pages/VerifyOtp.jsx'
import CompleteProfile from './pages/CompleteProfile.jsx'
import MeetDetail from './pages/MeetDetail.jsx'
import "leaflet/dist/leaflet.css";
import CreateMeets from './pages/CreateMeets.jsx'
import AdminDashboard from './pages/AdminDashboard.jsx'
import AdminLogin from './pages/AdminLogin.jsx'
import ProtectedRoute from "./components/ProtectedRoute.jsx"

const router = createBrowserRouter([
  {
    path: "/",
    Component: App,
    children: [
      {
        index: true,
        Component: Home,
      },
      {
        path: "/request-otp",
        Component: RequestOtp,
      },
      {
        path: "/request-otp/verify",
        Component: VerifyOtp
      },
      {
        path: "/request-otp/verify/complete-profile",
        Component: CompleteProfile
      },

      {
        path: "/meets",
        Component: Meets
      },
      {
        path: "/meets/:id",
        Component: MeetDetail,
      },
       {
        element: <ProtectedRoute allowedRoles={["HOST", "ADMIN"]} />,
        children: [
          {
            path: "/create-meet",
            Component: CreateMeets,
          },
        ],
      },
      {
        path:"/dashboard",
        Component: AdminDashboard
      },
      {
        path: "/garage",
        Component: MyGarage
      }

    ]
  },
      {
        path: "/admin",
        Component: AdminLogin
      }
])

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 10_000,
    },
  },
})

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <RouterProvider router={router}>
          <App />
        </RouterProvider>
      </AuthProvider>
    </QueryClientProvider>
  </StrictMode>
)
