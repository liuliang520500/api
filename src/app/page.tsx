import { redirect } from 'next/navigation';

export default function Home() {
  // 301重定向到mcp.sinataoke.cn
  redirect('https://mcp.sinataoke.cn');

  // 以下代码不会执行，因为redirect会中断执行
  return null;
}
