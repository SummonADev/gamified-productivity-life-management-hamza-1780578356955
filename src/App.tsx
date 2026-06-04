import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { GameProvider } from '@/context/GameContext';
import Layout from '@/components/Layout';
import DashboardPage from '@/pages/DashboardPage';
import QuestsPage from '@/pages/QuestsPage';
import HabitsPage from '@/pages/HabitsPage';
import ProjectsPage from '@/pages/ProjectsPage';
import WorldPage from '@/pages/WorldPage';
import ShopPage from '@/pages/ShopPage';
import CharacterPage from '@/pages/CharacterPage';
import AchievementsPage from '@/pages/AchievementsPage';
import AnalyticsPage from '@/pages/AnalyticsPage';

const App: React.FC = () => {
  return (
    <GameProvider>
      <Layout>
        <Routes>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/quests" element={<QuestsPage />} />
          <Route path="/habits" element={<HabitsPage />} />
          <Route path="/projects" element={<ProjectsPage />} />
          <Route path="/world" element={<WorldPage />} />
          <Route path="/shop" element={<ShopPage />} />
          <Route path="/character" element={<CharacterPage />} />
          <Route path="/achievements" element={<AchievementsPage />} />
          <Route path="/analytics" element={<AnalyticsPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Layout>
    </GameProvider>
  );
};

export default App;
