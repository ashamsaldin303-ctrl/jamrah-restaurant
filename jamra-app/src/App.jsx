import { Component } from "react";
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

class ErrorBoundary extends Component {
  constructor(p) { super(p); this.state = { err: false }; }
  static getDerivedStateFromError() { return { err: true }; }
  render() {
    if (this.state.err) return (
      <div className="err-boundary" role="alert">
        <h1>انطفأت جمرةٌ هنا</h1>
        <p>حدث خطأٌ غير متوقع — أعد تحميل الصفحة لتعود النار.</p>
        <button className="btn btn-ember" onClick={() => location.reload()}><span>إعادة التحميل</span></button>
      </div>
    );
    return this.props.children;
  }
}

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
      <a className="skip-link" href="#main-content">تخطَّ إلى المحتوى</a>
      <main id="main-content">
      <ErrorBoundary>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/menu" element={<MenuPage />} />
        <Route path="/gallery" element={<GalleryPage />} />
        <Route path="/reserve" element={<ReservePage />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      </ErrorBoundary>
      </main>
      <Footer />
      <FabTop />
      <MobileTabBar />
    </ToastProvider>
  );
}
