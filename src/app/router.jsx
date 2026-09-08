import { createBrowserRouter } from 'react-router-dom'
import { JoinRoute } from './routes/join.jsx'
import { VoteRoute } from './routes/vote.jsx'
import { AdminRoute } from './routes/admin.jsx'
import { DisplayRoute } from './routes/display.jsx'

export const router = createBrowserRouter([
  { path: '/', element: <JoinRoute /> },
  { path: '/vote', element: <VoteRoute /> },
  { path: '/admin', element: <AdminRoute /> },
  { path: '/display', element: <DisplayRoute /> },
])
