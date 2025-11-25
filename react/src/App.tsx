import ProductPage from "./pages/ProductPage"
import { BrowserRouter, Routes, Route } from "react-router-dom"
import Home from "./pages/Home"
import ViewDetail from "./pages/ViewDetail"
import TopBar from "./components/TopBar"


function App() {

  return (
    <BrowserRouter>
      <TopBar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/product" element={<ProductPage />} />
        <Route path="/product/:id" element={<ViewDetail />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
