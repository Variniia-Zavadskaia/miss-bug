const Router = ReactRouterDOM.BrowserRouter
const { Route, Routes } = ReactRouterDOM

import { AppHeader } from './cmps/AppHeader.jsx'
import { AppFooter } from './cmps/AppFooter.jsx'
import { Home } from './pages/Home.jsx'
import { AboutUs } from './pages/AboutUs.jsx'
import { BugIndex } from './pages/BugIndex.jsx'
import { BugDetails } from './pages/BugDetails.jsx'
// import { BugEdit } from './pages/BugEdit.jsx'
import { UserProfile } from './pages/UserProfile.jsx'
import { AdminDashboard } from './pages/AdminDashboard.jsx'

export function App() {
    return (
        <Router>
            <div>
                <AppHeader />
                <main>
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/about" element={<AboutUs />} />
                        <Route path="/bug/:bugId" element={<BugDetails />} />
                        {/* <Route path="/bug/edit/:bugId" element={<BugEdit />} /> */}
                        <Route path="/bug" element={<BugIndex />} />
                        <Route path={'/user'} element={<UserProfile />} />
                        <Route path={'/admin'} element={<AdminDashboard />} />
                    </Routes>
                </main>
                <AppFooter />
            </div>
        </Router>
    )
}
