# template-nextjs-shadcn

一个基于 Next.js 14 (App Router) + shadcn/ui 的管理后台模板项目。

## 快速开始

### 方式一：使用 degit（推荐）

```bash
# 使用 npx degit 克隆模板（不包含 git 历史）
npx degit Mereithhh/template-nextjs-shadcn my-project

# 进入项目目录
cd my-project

# 初始化 git
git init

# 安装依赖
pnpm install

# 启动开发服务器
pnpm dev
```

### 方式二：使用 git clone

```bash
# 克隆仓库
git clone --depth=1 https://github.com/Mereithhh/template-nextjs-shadcn.git my-project

# 进入项目目录
cd my-project

# 删除原有 git 历史
rm -rf .git

# 重新初始化 git
git init

# 安装依赖
pnpm install

# 启动开发服务器
pnpm dev
```

### 方式三：GitHub Template

直接在 GitHub 上点击 "Use this template" 按钮创建新仓库。

## 技术栈

- **框架**: Next.js 14 (App Router)
- **UI 组件库**: shadcn/ui (new-york 风格)
- **样式方案**: Tailwind CSS
- **图标库**: lucide-react
- **语言**: TypeScript
- **包管理器**: pnpm

## 开发命令

```bash
# 启动开发服务器
pnpm dev

# 构建生产版本
pnpm build

# 启动生产服务器
pnpm start

# 代码检查
pnpm lint

# 添加 shadcn/ui 组件
bunx --bun shadcn@latest add [component-name]
```

## 项目结构

```
├── app/                # Next.js App Router 页面
├── components/         # 全局共享组件
│   └── ui/            # shadcn/ui 组件
├── hooks/             # 自定义 Hooks
├── lib/               # 工具函数和配置
├── public/            # 静态资源
└── scripts/           # 构建脚本
```

## License

MIT
