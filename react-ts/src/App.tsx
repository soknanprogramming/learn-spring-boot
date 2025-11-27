import ProductPage from "./pages/ProductPage"
import { BrowserRouter, Routes, Route } from "react-router-dom"
import Home from "./pages/Home"
import ViewDetail from "./pages/ViewDetail"
import TopBar from "./components/TopBar"
import EditProduct from "./pages/EditProduct"
import AddProduct from "./pages/AddProduct"


function App() {

  return (
    <BrowserRouter>
      <TopBar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/product" element={<ProductPage />} />
        <Route path="/product/:id" element={<ViewDetail />} />
        <Route path="/product/:id/edit" element={<EditProduct />} />
        <Route path="/add_new_product" element={<AddProduct />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
