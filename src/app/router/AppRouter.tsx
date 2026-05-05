import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import LoginPage from '../pages/login/LoginPage'
import AppLayout from '../components/layout/AppLayout'
import HomePage from '../pages/home/HomePage'
import SearchPage from '../pages/search/SearchPage'
import AuctionsPage from '../pages/auctions/AuctionsPage'
import CreateAuctionPage from '../pages/auctions/CreateAuctionPage'
import AuctionDetailPage from '../pages/auctions/AuctionDetailPage'
import ProfilePage from '../pages/profile/ProfilePage'
import ProposalsPage from '../pages/proposals/ProposalsPage'
import ExchangesPage from '../pages/exchanges/ExchangesPage'
import PublicationDetailPage from '../pages/publications/PublicationDetailPage'
import AdminLayout from '../components/admin/AdminLayout'
import AdminRoute from '../components/admin/AdminRoute'
import AdminLoginPage from '../pages/admin/AdminLoginPage'
import AdminDashboardPage from '../pages/admin/AdminDashboardPage'
import UserRoute from '../components/layout/UserRoute'

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route element={<UserRoute />}>
          <Route element={<AppLayout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/search" element={<SearchPage />} />
            <Route path="/auctions" element={<AuctionsPage />} />
            <Route path="/auctions/create" element={<CreateAuctionPage />} />
            <Route path="/auctions/:id" element={<AuctionDetailPage />} />
            <Route path="/profile/:id" element={<ProfilePage />} />
            <Route path="/proposals" element={<ProposalsPage />} />
            <Route path="/exchanges" element={<ExchangesPage />} />
            <Route path="/publications/:id" element={<PublicationDetailPage />} />
          </Route>
        </Route>
        <Route element={<AdminLayout />}>
          <Route path="/admin/login" element={<AdminLoginPage />} />
          <Route element={<AdminRoute />}>
            <Route path="/admin" element={<AdminDashboardPage />} />
          </Route>
        </Route>
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
