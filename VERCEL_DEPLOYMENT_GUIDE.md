# Vercel デプロイメントガイド

## 問題の診断と解決方法

### 現在のエラー
`Module not found: Can't resolve '../../components/ui/button'`

### 原因の可能性
1. **ファイルシステムの大文字小文字の問題**
   - macOSは大文字小文字を区別しない
   - Linuxベースのビルド環境は区別する

2. **相対パスの解決問題**
   - Vercelのビルド環境での相対パス解決

### 解決策

#### 手順1: ローカルでテスト
```bash
# キャッシュをクリア
rm -rf .next
rm -rf node_modules
npm install

# ビルドテスト
npm run build
```

#### 手順2: Gitの設定確認
```bash
# 大文字小文字を区別するよう設定
git config core.ignorecase false

# すべてのファイルを再追加
git rm -r --cached .
git add -A
git commit -m "Fix file casing issues"
git push
```

#### 手順3: Vercelの設定
1. **環境変数**（Vercelダッシュボード）
   - `DATABASE_URL`: PostgreSQL接続文字列
   - `NEXTAUTH_SECRET`: ランダムな文字列
   - `NEXTAUTH_URL`: https://your-app.vercel.app

2. **ビルド設定**
   - Framework Preset: `Next.js`
   - Build Command: （デフォルト）
   - Output Directory: （デフォルト）

#### 手順4: クリーンデプロイ
1. Vercelダッシュボードで既存のデプロイメントを削除
2. 新しいプロジェクトとして再インポート
3. 環境変数を設定
4. デプロイ

### デバッグ用コマンド
```bash
# ファイル構造の確認
find . -name "*.tsx" -o -name "*.ts" | grep -E "(button|card|dialog|input|label|select|textarea)" | head -20

# インポートの確認
grep -r "from.*components/ui" --include="*.tsx" --include="*.ts" | head -10

# ビルド詳細ログ
NEXT_TELEMETRY_DISABLED=1 npm run build
```

### 最終手段
もし上記で解決しない場合：

1. **モノレポ構造に変更**
```json
// package.json
{
  "workspaces": ["packages/*"],
  "scripts": {
    "build": "cd packages/app && npm run build"
  }
}
```

2. **Docker化**
```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
CMD ["npm", "start"]
```

### 連絡先
問題が続く場合は、Vercelのサポートに以下の情報を提供：
- ビルドログ全文
- package.json
- tsconfig.json
- プロジェクト構造