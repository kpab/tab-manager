// src/App.tsx
import "./App.css";
import TabList from "./components/TabList";

function App() {
  return (
    <div className="flex w-[800px] h-[600px] bg-[#292d3e] text-[#a6accd] overflow-hidden rounded-lg border border-[#3b4254]">
      {/* サイドパネル */}
      <div className="w-[200px] bg-[#2d3347] border-r border-[#3b4254]">
        {/* コンテキストスイッチャー */}
        <div className="bg-[#3b4254] p-3 mb-2 flex items-center justify-between">
          <span className="text-[#a6accd] text-sm">開発モード</span>
          <div className="w-5 h-5 rounded-full bg-[#64ffda]"></div>
        </div>

        <div className="p-2 overflow-y-auto h-[560px]">
          <TabList viewMode="sidebar" />
        </div>
      </div>

      {/* メインコンテンツエリア */}
      <div className="flex-1 bg-[#20253a] flex flex-col">
        {/* タブプレビュー領域 */}
        <div className="p-3 bg-[#3b4254] border-b border-[#3b4254]">
          <h2 className="text-white font-bold text-base">タブグループビュー</h2>
        </div>

        {/* タブグループのビジュアル表示エリア */}
        <div className="p-5 bg-[#252b3b] flex-1 overflow-auto">
          <div className="grid grid-cols-3 gap-4">
            {/* モデルコードグループ */}
            <div className="bg-[#1e2132] border-2 border-[#f07178] rounded-md p-3">
              <h3 className="text-[#f07178] font-bold mb-2">Modelコード</h3>
              <div className="space-y-2">
                <div className="bg-[#252b3b] p-2 rounded text-sm">User.php</div>
                <div className="bg-[#252b3b] p-2 rounded text-sm">Auth.php</div>
                <div className="bg-[#252b3b] p-2 rounded text-sm">Role.php</div>
              </div>
            </div>

            {/* コントローラーコードグループ */}
            <div className="bg-[#1e2132] border-2 border-[#82aaff] rounded-md p-3">
              <h3 className="text-[#82aaff] font-bold mb-2">Controllerコード</h3>
              <div className="space-y-2">
                <div className="bg-[#252b3b] p-2 rounded text-sm">UserController.php</div>
                <div className="bg-[#252b3b] p-2 rounded text-sm">AuthController.php</div>
              </div>
            </div>

            {/* 仕様書グループ */}
            <div className="bg-[#1e2132] border-2 border-[#ffcb6b] rounded-md p-3">
              <h3 className="text-[#ffcb6b] font-bold mb-2">仕様書</h3>
              <div className="space-y-2">
                <div className="bg-[#252b3b] p-2 rounded text-sm">ログイン機能仕様書</div>
                <div className="bg-[#252b3b] p-2 rounded text-sm">API仕様書</div>
              </div>
            </div>
          </div>

          {/* ワークセット選択エリア */}
          <div className="mt-5 bg-[#3b4254] p-3 rounded">
            <h3 className="font-bold text-white mb-2">保存済みワークセット</h3>
            <div className="flex gap-3 mt-2">
              <button className="px-4 py-1 bg-[#1e2132] border-2 border-[#f07178] rounded-full text-[#f07178] text-sm">機能開発</button>
              <button className="px-4 py-1 bg-[#1e2132] border-2 border-[#82aaff] rounded-full text-[#82aaff] text-sm">レビュー</button>
              <button className="px-4 py-1 bg-[#1e2132] border-2 border-[#c3e88d] rounded-full text-[#c3e88d] text-sm">ミーティング</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;