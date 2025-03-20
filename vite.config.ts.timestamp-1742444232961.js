// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { crx } from "@crxjs/vite-plugin";

// public/manifest.json
var manifest_default = {
  manifest_version: 3,
  name: "DevTabs - \u30A8\u30F3\u30B8\u30CB\u30A2\u5411\u3051\u30BF\u30D6\u30DE\u30CD\u30FC\u30B8\u30E3\u30FC",
  version: "0.1.0",
  description: "\u30A8\u30F3\u30B8\u30CB\u30A2\u306E\u30EF\u30FC\u30AF\u30D5\u30ED\u30FC\u306B\u6700\u9069\u5316\u3057\u305F\u30BF\u30D6\u7BA1\u7406\u30C4\u30FC\u30EB",
  permissions: ["tabs", "storage"],
  action: {
    default_popup: "index.html",
    default_icon: {
      "16": "icons/icon16.png",
      "48": "icons/icon48.png",
      "128": "icons/icon128.png"
    }
  },
  icons: {
    "16": "icons/icon16.png",
    "48": "icons/icon48.png",
    "128": "icons/icon128.png"
  },
  side_panel: {
    default_path: "index.html"
  }
};

// vite.config.ts
var vite_config_default = defineConfig({
  plugins: [react(), crx({ manifest: manifest_default })]
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImltcG9ydCB7IGRlZmluZUNvbmZpZyB9IGZyb20gXCJ2aXRlXCI7XG5pbXBvcnQgcmVhY3QgZnJvbSBcIkB2aXRlanMvcGx1Z2luLXJlYWN0XCI7XG5pbXBvcnQgeyBjcnggfSBmcm9tIFwiQGNyeGpzL3ZpdGUtcGx1Z2luXCI7XG5pbXBvcnQgbWFuaWZlc3QgZnJvbSBcIi4vcHVibGljL21hbmlmZXN0Lmpzb25cIjtcblxuZXhwb3J0IGRlZmF1bHQgZGVmaW5lQ29uZmlnKHtcbiAgcGx1Z2luczogW3JlYWN0KCksIGNyeCh7IG1hbmlmZXN0IH0pXSxcbn0pO1xuIl0sCiAgIm1hcHBpbmdzIjogIjtBQUFBLFNBQVMsb0JBQW9CO0FBQzdCLE9BQU8sV0FBVztBQUNsQixTQUFTLFdBQVc7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFHcEIsSUFBTyxzQkFBUSxhQUFhO0FBQUEsRUFDMUIsU0FBUyxDQUFDLE1BQU0sR0FBRyxJQUFJLEVBQUUsMkJBQVMsQ0FBQyxDQUFDO0FBQ3RDLENBQUM7IiwKICAibmFtZXMiOiBbXQp9Cg==
