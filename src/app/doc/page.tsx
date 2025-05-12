import React from 'react';
import styles from './styles.module.css';

export default function DocPage() {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>API 路由使用文档</h1>

      <section className={styles.section}>
        <h2>概述</h2>
        <p>
          本API服务使用Next.js的App Router实现，支持通过环境变量配置动态路由，无需修改源代码即可添加新的API接口。
        </p>
        <p>
          您可以通过 <a href="/api/doc" target="_blank" rel="noopener noreferrer" className={styles.link}>
            /api/doc
          </a> 获取完整的API文档数据（JSON格式）。
        </p>
      </section>

      <section className={styles.section}>
        <h2>API路由结构</h2>
        <p>所有API接口都遵循以下URL格式：</p>
        <pre className={styles.code}>
          /api/[group]/[type]
        </pre>
        <p>其中：</p>
        <ul>
          <li><strong>[group]</strong>: API分组名称，例如 "mcp", "database" 等</li>
          <li><strong>[type]</strong>: 具体API接口名称，例如 "key", "secret" 等</li>
        </ul>
      </section>

      <section className={styles.section}>
        <h2>配置方式</h2>
        <p>
          API路由配置存储在环境变量 <code>API_ROUTES_CONFIG</code> 中，格式为JSON字符串。
          这样可以在不修改源代码的情况下，通过修改环境变量来添加、修改或删除API接口。
        </p>

        <h3>环境变量格式</h3>
        <pre className={styles.code}>
{`API_ROUTES_CONFIG=[
  {
    "group": "mcp",
    "routes": [
      { "path": "key", "response": "这是key的响应值" },
      { "path": "secret", "response": "这是secret的响应值" }
    ]
  },
  {
    "group": "database",
    "routes": [
      { "path": "connection", "response": "mongodb://localhost:27017" },
      { "path": "username", "response": "admin" }
    ]
  }
]`}
        </pre>
      </section>

      <section className={styles.section}>
        <h2>数据结构说明</h2>
        <p>环境变量中的JSON数据结构如下：</p>
        <pre className={styles.code}>
{`interface RouteConfig {
  path: string;         // API路径
  response: any;        // 响应值，可以是字符串、数字、布尔值或对象
}

interface GroupConfig {
  group: string;        // 分组名称
  routes: RouteConfig[]; // 该分组下的路由配置
}

// 环境变量格式为 GroupConfig[] 的JSON字符串`}
        </pre>
      </section>

      <section className={styles.section}>
        <h2>响应格式</h2>
        <p>所有API接口都返回JSON格式的响应，结构如下：</p>
        <pre className={styles.code}>
{`{
  "data": 响应值
}`}
        </pre>
        <p>其中，<code>data</code>字段的值来自路由配置中的<code>response</code>属性。</p>
      </section>

      <section className={styles.section}>
        <h2>示例</h2>
        <h3>配置示例</h3>
        <pre className={styles.code}>
{`API_ROUTES_CONFIG=[
  {
    "group": "mcp",
    "routes": [
      { "path": "key", "response": "api-key-12345" },
      { "path": "secret", "response": "secret-67890" },
      { "path": "config", "response": { "enabled": true, "timeout": 30 } }
    ]
  }
]`}
        </pre>

        <h3>请求示例</h3>
        <pre className={styles.code}>
          GET /api/mcp/key
        </pre>

        <h3>响应示例</h3>
        <pre className={styles.code}>
{`{
  "data": "api-key-12345"
}`}
        </pre>
      </section>

      <section className={styles.section}>
        <h2>如何添加新的API接口</h2>
        <p>
          要添加新的API接口，只需修改环境变量<code>API_ROUTES_CONFIG</code>的值，
          无需修改源代码。例如，添加一个新的分组和API接口：
        </p>
        <pre className={styles.code}>
{`API_ROUTES_CONFIG=[
  {
    "group": "mcp",
    "routes": [
      { "path": "key", "response": "api-key-12345" },
      { "path": "secret", "response": "secret-67890" }
    ]
  },
  {
    "group": "thirdparty",
    "routes": [
      { "path": "apikey", "response": "sk-1234567890abcdef" }
    ]
  }
]`}
        </pre>
        <p>
          添加后，可以通过<code>/api/thirdparty/apikey</code>访问新的API接口。
        </p>
      </section>

      <footer className={styles.footer}>
        <p>© {new Date().getFullYear()} MCP API 服务</p>
      </footer>
    </div>
  );
}
