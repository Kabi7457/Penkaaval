import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import ApplicationForm from './components/ApplicationForm'
import VisionMission from './components/VisionMission'
import AboutUs from './components/AboutUs'
import ContactUs from './components/ContactUs'
import Footer from './components/Footer'
import AdminDashboard from './components/AdminDashboard'

function LandingPage() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <ApplicationForm />
        <VisionMission />
        <AboutUs />
        <ContactUs />
      </main>
      <Footer />
    </>
  )
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/jesus-admin" element={<AdminDashboard />} />
    </Routes>
  )
}
