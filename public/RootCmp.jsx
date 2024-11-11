const Router = ReactRouterDOM.HashRouter
// const Router = ReactRouterDOM.BrowserRouter
const { Route, Routes } = ReactRouterDOM

import { AppHeader } from './cmps/AppHeader.jsx'
import { AppFooter } from './cmps/AppFooter.jsx'
import { Home } from './pages/Home.jsx'
import { AboutUs } from './pages/AboutUs.jsx'
import { BugIndex } from './pages/BugIndex.jsx'
import { BugDetails } from './pages/BugDetails.jsx'
import { BugEdit } from './pages/BugEdit.jsx'

export function App() {
    return (
        <Router>
            <div>
                <AppHeader />
                <main>
                    <Routes>
                        <Route element={<Home />} path={'/'} />
                        <Route element={<BugIndex />} path={'/bug'} />
                        <Route element={<BugEdit />} path={'/bug/edit'} />
                        <Route element={<BugEdit />} path={'/bug/edit/:bugId'} />
                        <Route element={<BugDetails />} path={'/bug/:bugId'} />
                        <Route element={<AboutUs />} path={'/about'} />
                    </Routes>
                </main>
                <AppFooter />
            </div>
        </Router>
    )
}
