import { Route, Routes } from "react-router-dom"
import Header from "../components/Header"
import HomePage from "./client/HomePage"
import AboutPage from "./client/AboutPage"
import MyOrdersPage from "./client/MyOrderPage"
import AddOrder from "./client/AddOrder"
import PricingPage from "./client/PricingPage"
import ContactPage from "./client/ContactPage"
import EditOrder from "./client/EditOrder"
import UsersAccountDetails from "./client/UserAccountDetails"
import EditAccount from "./client/EditAccount"
import Footer from "../components/Footer"



function Home() {
  return (
    <div>
      <Header />

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/addorder" element={<AddOrder />} />
        <Route path="/myorder" element={<MyOrdersPage />} />
        <Route path="/pricing" element={<PricingPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/editorder" element={<EditOrder />} />
        <Route path="/editaccount" element={<EditAccount />} />
        <Route path="/viewaccount" element={<UsersAccountDetails />} />
      </Routes>
      <Footer />
    </div>
  );
}

export default Home;
