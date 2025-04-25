import { Routes, Route } from "react-router-dom"
import { Layout } from "./components/layout/Layout"
import { PhoneGrid } from "./components/phone/PhoneGrid"
import PhoneDetail from "./components/PhoneDetail"

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<PhoneGrid />} />
        <Route path="/phones/:id" element={<PhoneDetail />} />
      </Routes>
    </Layout>
  )
}

export default App
