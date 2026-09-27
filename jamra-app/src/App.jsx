import { Routes, Route } from "react-router-dom";
import { ToastProvider } from "./context/ToastContext";
import Icons from "./components/Icons";
import Magnetizer from "./components/Magnetizer";
import Preloader from "./components/Preloader";
import Cursor from "./components/Cursor";
import Sparks from "./components/Sparks";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import FabTop from "./components/FabTop";
import MobileTabBar from "./components/MobileTabBar";
import PageCurtain from "./components/PageCurtain";
import ScrollManager from "./components/ScrollManager";
import Home from "./pages/Home";
import About from "./pages/About";
import MenuPage from "./pages/MenuPage";
import GalleryPage from "./pages/GalleryPage";
import ReservePage from "./pages/ReservePage";
import NotFound from "./pages/NotFound";

export default function App() {
  return (
    <ToastProvider>
      <Icons />
      <Magnetizer />
      <ScrollManager />
      <Preloader />
      <Cursor />
      <Sparks />
      <PageCurtain />
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/menu" element={<MenuPage />} />
        <Route path="/gallery" element={<GalleryPage />} />
        <Route path="/reserve" element={<ReservePage />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Footer />
      <FabTop />
      <MobileTabBar />
    </ToastProvider>
  );
}
