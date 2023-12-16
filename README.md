<div align="center">

# VPM Proxy

[![爱发电](https://img.shields.io/badge/dynamic/json?url=https%3A%2F%2Fafdian.net%2Fapi%2Fuser%2Fget-profile%3Fuser_id%3D75e549844b5111ed8df552540025c377&query=%24.data.user.name&label=%E7%88%B1%E5%8F%91%E7%94%B5&color=%23946ce6)](https://afdian.net/a/gizmo)
[![Ko-fi](https://img.shields.io/badge/Ko--fi-%E2%9D%A4%EF%B8%8F-blue?logo=kofi&color=%23fff)](https://ko-fi.com/gizmo_)
[![License](https://img.shields.io/github/license/gizmo-ds/vpm-proxy.svg)](./LICENSE)

VPM(VRChat Package Manager) 的加速项目, 缓解<span title="🤡">特殊网络环境</span>下 VCC 难以更新软件包的问题.

</div>

## 原理

下载 json 格式的清单文件, 检查所有版本的文件下载链接是否为位于 GitHub 的下载链接.

如果是, 给文件的下载链接加上加速下载用的前缀, 当前兼容 [gh-proxy](https://github.com/hunshcn/gh-proxy) 以及加速使用类似形式的服务.

## 使用方法

在 vpm 的 json 清单文件链接前加上域名即可, 下面是为 Modular Avatar 添加代理的例子.

原链接: `https://vpm.nadena.dev/vpm.json`

新链接: `https://vpm-proxy.aika.dev/https://vpm.nadena.dev/vpm.json`

为了可读性去掉`https://`也是可以的: `https://vpm-proxy.aika.dev/vpm.nadena.dev/vpm.json`

在使用 VCC 添加软件包时使用新连接即可.

如果你需要使用其他的加速链接, 可以在添加软件包时设置 `x-ghproxy` 请求头(Header)来指定使用的加速链接.

> ⚠️**Important**⚠️<br>
> 因为 VCC 的 BUG, Header Value 中有符号 `:` 会导致不生效. <br>
> 假如你需要使用 `https://ghproxy.net` 的服务, 可以把原本的 `https://ghproxy.net/https://github.com` 修改为 `ghproxy.net/github.com`

## 自己部署 (免费)

| Name        | Deploy                                                                                                                     |
| ----------- | -------------------------------------------------------------------------------------------------------------------------- |
| Vercel      | [![Deploy with Vercel](https://vercel.com/button)](https://gg.gg/1821ge)                                                   |
| Cloudflare  | [Deploy to Cloudflare](https://nitro.unjs.io/deploy/providers/cloudflare)                                                  |
| Deno Deploy | [Deploy to Deno Deploy](https://nitro.unjs.io/deploy/providers/deno-deploy) / [Example](.github/workflows/deno-deploy.yml) |
| Netlify     | [Deploy to Netlify](https://nitro.unjs.io/deploy/providers/netlify)                                                        |

Check out the [deployment documentation](https://nitro.unjs.io/deploy) for more information.

环境变量:

- `DEFAULT_GHPROXY` 请求不通过 query 和 header 传递 ghproxy 参数时默认使用的值.
- `CACHE_TTL` 可选, 缓存的有效时间, 单位秒, 默认 1800 (30 分钟)
- `CACHE_CF_KV_BINDING` 可选, 当值不为空时使用 [Cloudflare KV](https://www.cloudflare.com/developer-platform/workers-kv/) 处理缓存. 仅 Preset 为 Cloudflare Worker 或 Pages 时有效. [创建方法](https://developers.cloudflare.com/kv/get-started/#3-create-a-kv-namespace)
- `CACHE_DENO_KV_ENABLE` 可选, 当值为 `true` 时使用 [Deno KV](https://deno.com/kv) 处理缓存. 仅 Runtime 为 Deno 时有效.

如果没使用上述的缓存服务, 默认将缓存储存到内存.

## Sponsors

[![Sponsors](https://afdian-connect.deno.dev/sponsor.svg)](https://afdian.net/a/gizmo)

## Contributors

![Contributors](https://contributors.liuli.lol/gizmo-ds/vpm-proxy/contributors.svg?align=left)
