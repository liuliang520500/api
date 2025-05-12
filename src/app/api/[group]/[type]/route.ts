import { NextResponse } from 'next/server';

/**
 * API路由映射表
 *
 * 结构:
 * [
 *   {
 *     group: '分组名',
 *     routes: [
 *       { path: '路由路径', response: '直接响应值' }
 *     ]
 *   }
 * ]
 *
 * 添加新的API接口时，只需在此处添加新的映射即可
 * 可以添加新的分组或在现有分组中添加新的路由
 */
interface RouteConfig {
  path: string;
  response: string | number | boolean | object; // 支持多种响应值类型
}

interface GroupConfig {
  group: string;
  routes: RouteConfig[];
}

// 默认API路由配置，当环境变量未设置时使用
const DEFAULT_API_ROUTES: GroupConfig[] = [
  // MCP分组
  {
    group: 'mcp',
    routes: [
      { path: 'key', response: '这是key的响应值' },
      { path: 'secret', response: '这是secret的响应值' },
    ],
  },
];

/**
 * 从环境变量获取API路由配置
 * 环境变量API_ROUTES_CONFIG应该是一个JSON字符串，格式与GroupConfig[]相同
 * 例如:
 * [
 *   {
 *     "group": "mcp",
 *     "routes": [
 *       { "path": "key", "response": "这是key的响应值" },
 *       { "path": "secret", "response": "这是secret的响应值" }
 *     ]
 *   },
 *   {
 *     "group": "database",
 *     "routes": [
 *       { "path": "connection", "response": "mongodb://localhost:27017" },
 *       { "path": "username", "response": "admin" }
 *     ]
 *   }
 * ]
 */
function getApiRoutesFromEnv(): GroupConfig[] {
  try {
    // 从环境变量获取API路由配置
    const apiRoutesEnv = process.env.API_ROUTES_CONFIG;

    // 如果环境变量存在，则解析JSON字符串
    if (apiRoutesEnv) {
      const parsedRoutes = JSON.parse(apiRoutesEnv) as GroupConfig[];

      // 验证解析后的数据结构是否符合要求
      if (Array.isArray(parsedRoutes) && parsedRoutes.every(isValidGroupConfig)) {
        return parsedRoutes;
      } else {
        console.warn('环境变量API_ROUTES_CONFIG格式不正确，使用默认配置');
      }
    }
  } catch (error) {
    console.error('解析环境变量API_ROUTES_CONFIG时出错:', error);
  }

  // 如果环境变量不存在或解析失败，则使用默认配置
  return DEFAULT_API_ROUTES;
}

/**
 * 验证对象是否符合GroupConfig接口
 */
function isValidGroupConfig(obj: any): obj is GroupConfig {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    typeof obj.group === 'string' &&
    Array.isArray(obj.routes) &&
    obj.routes.every(
      (route: any) =>
        typeof route === 'object' &&
        route !== null &&
        typeof route.path === 'string' &&
        route.response !== undefined
    )
  );
}

// 获取API路由配置
const API_ROUTES: GroupConfig[] = getApiRoutesFromEnv();

/**
 * GET /api/[group]/[type] - 根据group和type参数返回不同的响应值
 */
export async function GET(
  _request: Request,
  context: { params: Promise<{ group: string; type: string }> }
) {
  // 使用await获取params的值
  const { group, type } = await context.params;

  // 查找请求的分组
  const groupConfig = API_ROUTES.find(g => g.group === group);

  if (groupConfig) {
    // 查找请求的路由
    const routeConfig = groupConfig.routes.find(r => r.path === type);

    if (routeConfig) {
      // 直接获取响应值
      const responseValue = routeConfig.response;

      // 返回JSON响应，key值为data
      return NextResponse.json({
        data: responseValue
      });
    }
  }

  // 如果请求的分组或路由不存在，返回404
  return NextResponse.json(
    { error: '未找到请求的API接口' },
    { status: 404 }
  );
}

// 设置为动态路由，确保每次请求都能获取最新的响应配置
export const dynamic = 'force-dynamic';
