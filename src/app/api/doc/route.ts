import { NextResponse } from 'next/server';

/**
 * 路由配置接口
 */
interface RouteConfig {
  path: string;
  response: string | number | boolean | object;
}

/**
 * 分组配置接口
 */
interface GroupConfig {
  group: string;
  routes: RouteConfig[];
}

/**
 * 从环境变量获取API路由配置
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
      }
    }
  } catch (error) {
    console.error('解析环境变量API_ROUTES_CONFIG时出错:', error);
  }
  
  // 如果环境变量不存在或解析失败，则使用默认配置
  return [
    {
      group: 'mcp',
      routes: [
        { path: 'key', response: '这是key的响应值' },
        { path: 'secret', response: '这是secret的响应值' },
      ],
    },
  ];
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

/**
 * 生成API文档数据
 */
function generateApiDocumentation() {
  const routes = getApiRoutesFromEnv();
  
  // 生成API端点列表
  const endpoints = routes.flatMap(group => 
    group.routes.map(route => ({
      url: `/api/${group.group}/${route.path}`,
      method: 'GET',
      group: group.group,
      path: route.path,
      responseType: typeof route.response,
    }))
  );
  
  // 生成文档数据
  return {
    apiVersion: '1.0.0',
    description: 'MCP API服务',
    baseUrl: '/api',
    endpoints,
    groups: routes.map(group => ({
      name: group.group,
      routeCount: group.routes.length,
    })),
    configFormat: {
      type: 'JSON',
      source: 'Environment Variable (API_ROUTES_CONFIG)',
      example: JSON.stringify(routes, null, 2),
    },
  };
}

/**
 * GET /api/doc - 返回API文档数据
 */
export async function GET() {
  const documentation = generateApiDocumentation();
  
  return NextResponse.json({
    data: documentation
  });
}

// 设置为动态路由，确保每次请求都能获取最新的文档数据
export const dynamic = 'force-dynamic';
