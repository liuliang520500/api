# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 开发命令

```bash
npm run dev      # 启动开发服务器（使用Turbopack）
npm run build    # 生产环境构建
npm run start    # 启动生产服务器
npm run lint     # ESLint代码检查
```

## 项目架构

这是一个基于 Next.js 15 App Router 的动态 API 服务，核心特性是**通过环境变量配置API接口，无需修改代码**。

### 核心模块

- `src/app/api/[group]/[type]/route.ts` - 动态API路由处理器，根据环境变量 `API_ROUTES_CONFIG` 返回配置的响应
- `src/app/api/doc/route.ts` - API文档生成端点，返回所有可用端点的JSON描述
- `src/app/doc/page.tsx` - API使用文档的Web UI页面

### API路由模式

```
GET /api/[group]/[type]  ->  返回 { data: responseValue }
GET /api/doc             ->  返回API文档JSON
GET /doc                 ->  文档页面
```

### 环境变量配置

通过 `API_ROUTES_CONFIG` 环境变量配置API接口：

```json
[
  {
    "group": "mcp",
    "routes": [
      { "path": "key", "response": "your-api-key" },
      { "path": "config", "response": { "enabled": true } }
    ]
  }
]
```

当环境变量缺失或格式错误时，会回退到默认配置（mcp/key 和 mcp/secret）。

### 类型定义

```typescript
interface RouteConfig {
  path: string;
  response: string | number | boolean | object;
}

interface GroupConfig {
  group: string;
  routes: RouteConfig[];
}
```

## 技术栈

- Next.js 15.3.2 + React 19 + TypeScript 5
- 路径别名: `@/*` -> `./src/*`
- 严格模式TypeScript
