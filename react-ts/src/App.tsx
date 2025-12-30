import { BrowserRouter, Routes, Route } from "react-router-dom"


function App() {

  return (
    <div className="w-full">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<h1>Hello Spring Security</h1>}/>
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App
