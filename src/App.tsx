import "./App.css";
import TabList from "./components/TabList";

function App() {
  return (
    <div className="w-96 h-[600px] bg-primary text-text-primary overflow-auto">
      <div className="p-4 border-b border-gray-700">
        <h1 className="text-2xl font-bold">DevTabs</h1>
        <p className="text-sm text-gray-400">エンジニア向けタブマネージャー</p>
      </div>
      <TabList />
    </div>
  );
}

export default App;
