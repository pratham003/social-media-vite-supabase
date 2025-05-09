import { Routes, Route, Outlet } from "react-router-dom";
import { Home } from "./pages/Home";
import { Navbar } from "./components/Navbar";
import { CreatePostPage } from "./pages/CreatePostPage";
import { PostPage } from "./pages/PostPage";
import { CreateCommunityPage } from "./pages/CreateCommunityPage";
import { CommunitiesPage } from "./pages/CommunitiesPage";
import { CommunityPage } from "./pages/CommunityPage";
import { ChatbotProvider } from "./context/ChatbotContext";
import { ChatbotWidget } from "./components/chatbot/ChatbotWidget";

// Layout component with chatbot functionality
const Layout = () => {
  return (
    <ChatbotProvider>
      <div className="min-h-screen bg-black text-gray-100 transition-opacity duration-700 pt-20">
        <Navbar />
        <div className="container mx-auto px-4 py-6">
          <Outlet />
        </div>
        <ChatbotWidget />
      </div>
    </ChatbotProvider>
  );
};

function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/create" element={<CreatePostPage />} />
        <Route path="/post/:id" element={<PostPage />} />
        <Route path="/community/create" element={<CreateCommunityPage />} />
        <Route path="/communities" element={<CommunitiesPage />} />
        <Route path="/community/:id" element={<CommunityPage />} />
      </Route>
    </Routes>
  );
}

export default App;
