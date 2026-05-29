export const config = {
  runtime: 'edge', // 使用边缘运行时，速度极快
};

export default async function handler(request) {
  const url = new URL(request.url);
  
  // 核心逻辑：强行把插件发来的路径，拼接到 deepseek 的 anthropic 专线上
  // 比如插件请求 /v1/messages -> 转发到 api.deepseek.com/anthropic/v1/messages
  const targetUrl = 'https://api.deepseek.com/anthropic' + url.pathname + url.search;

  // 复制原始请求的 Header（包含你的 x-api-key）
  const newHeaders = new Headers(request.headers);
  newHeaders.set('Host', 'api.deepseek.com');

  // 发起后台转发
  const response = await fetch(targetUrl, {
    method: request.method,
    headers: newHeaders,
    body: request.body,
  });

  return response;
}
