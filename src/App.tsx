import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AppProvider } from './context/AppContext';
import AppShell from './components/layout/AppShell';

// Pages
import HomePage from './pages/Home';
import DashboardPage from './pages/Dashboard';
import WeatherPage from './pages/Weather';
import CropAdvisorPage from './pages/CropAdvisor';
import SoilHealthPage from './pages/SoilHealth';
import FertilizerPage from './pages/Fertilizer';
import DiseasePage from './pages/Disease';
import MarketPage from './pages/Market';
import IFSPage from './pages/ifs/IFSHome';
import IFSDairyPage from './pages/ifs/Dairy';
import IFSPoultryPage from './pages/ifs/Poultry';
import IFSFishPage from './pages/ifs/Fish';
import IFSCompostPage from './pages/ifs/Compost';
import IFSBiogasPage from './pages/ifs/Biogas';
import IFSAgroforestryPage from './pages/ifs/Agroforestry';
import PrecisionPage from './pages/Precision';
import IrrigationPage from './pages/Irrigation';
import FinancePage from './pages/Finance';
import ChatbotPage from './pages/Chatbot';
import VoicePage from './pages/Voice';
import NotificationsPage from './pages/Notifications';
import KnowledgePage from './pages/Knowledge';
import SettingsPage from './pages/Settings';

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<AppShell />}>
            <Route index element={<HomePage />} />
            <Route path="dashboard" element={<DashboardPage />} />
            <Route path="weather" element={<WeatherPage />} />
            <Route path="crop-advisor" element={<CropAdvisorPage />} />
            <Route path="soil-health" element={<SoilHealthPage />} />
            <Route path="fertilizer" element={<FertilizerPage />} />
            <Route path="disease" element={<DiseasePage />} />
            <Route path="market" element={<MarketPage />} />
            <Route path="ifs">
              <Route index element={<IFSPage />} />
              <Route path="dairy" element={<IFSDairyPage />} />
              <Route path="poultry" element={<IFSPoultryPage />} />
              <Route path="fish" element={<IFSFishPage />} />
              <Route path="compost" element={<IFSCompostPage />} />
              <Route path="biogas" element={<IFSBiogasPage />} />
              <Route path="agroforestry" element={<IFSAgroforestryPage />} />
            </Route>
            <Route path="precision" element={<PrecisionPage />} />
            <Route path="irrigation" element={<IrrigationPage />} />
            <Route path="finance" element={<FinancePage />} />
            <Route path="chatbot" element={<ChatbotPage />} />
            <Route path="voice" element={<VoicePage />} />
            <Route path="notifications" element={<NotificationsPage />} />
            <Route path="knowledge" element={<KnowledgePage />} />
            <Route path="settings" element={<SettingsPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#fff',
            color: '#1a1a1a',
            borderRadius: '12px',
            border: '1px solid #e5e7eb',
            boxShadow: '0 4px 24px rgba(0,0,0,0.1)',
            fontSize: '14px',
            fontFamily: 'Inter, sans-serif',
          },
          success: { iconTheme: { primary: '#176B45', secondary: '#fff' } },
          error: { iconTheme: { primary: '#ef4444', secondary: '#fff' } },
        }}
      />
    </AppProvider>
  );
}
