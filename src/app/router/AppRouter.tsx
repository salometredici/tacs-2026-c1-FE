import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import LoginPage from '../pages/login/LoginPage'
import AppLayout from '../components/layout/AppLayout'
import HomePage from '../pages/home/HomePage'
import SearchPage from '../pages/SearchPage'
import AuctionsPage from '../pages/Auctions/AuctionsPage'
import CreateAuctionPage from '../pages/Auctions/CreateAuctionPage'
import ProfilePage from '../pages/profile/ProfilePage'
import ProposalsPage from '../pages/proposals/ProposalsPage'
import ExchangesPage from '../pages/exchanges/ExchangesPage'

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route element={<AppLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/auctions" element={<AuctionsPage />} />
          <Route path="/auctions/create" element={<CreateAuctionPage />} />
          <Route path="/profile/:id" element={<ProfilePage />} />
          <Route path="/proposals" element={<ProposalsPage />} />
          <Route path="/exchanges" element={<ExchangesPage />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
