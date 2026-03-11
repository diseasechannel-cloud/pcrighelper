import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Hub from './pages/Hub'
import RigScan from './pages/RigScan'
import Build from './pages/Build'
import Benchmark from './pages/Benchmark'
import Compare from './pages/Compare'
import Market from './pages/Market'
import Legacy from './pages/Legacy'
import FlipMode from './pages/FlipMode'
import Regions from './pages/Regions'

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Hub />} />
        <Route path="scan" element={<RigScan />} />
        <Route path="build" element={<Build />} />
        <Route path="benchmark" element={<Benchmark />} />
        <Route path="compare" element={<Compare />} />
        <Route path="market" element={<Market />} />
        <Route path="legacy" element={<Legacy />} />
        <Route path="flip" element={<FlipMode />} />
        <Route path="regions" element={<Regions />} />
      </Route>
    </Routes>
  )
}
