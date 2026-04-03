import { Navigate, Route, Routes } from 'react-router-dom';
import { AppShell } from './components/AppShell';
import { LeaveRequestPage } from './pages/LeaveRequestPage';
import { MaintenanceRequestPage } from './pages/MaintenanceRequestPage';
import { RoomGridPage } from './pages/RoomGridPage';

function App() {
  return (
    <Routes>
      <Route element={<AppShell />}>
        <Route index element={<Navigate replace to="/rooms" />} />
        <Route path="/rooms" element={<RoomGridPage />} />
        <Route path="/maintenance" element={<MaintenanceRequestPage />} />
        <Route path="/leave-request" element={<LeaveRequestPage />} />
      </Route>
    </Routes>
  );
}

export default App;
