---
title: 如何添加自定义路由
sidebarTitle: Add custom routes
---
将代理部署到 LangSmith Deployment 时，您的服务器会自动暴露用于创建运行（runs）和线程（threads）、与长期记忆存储交互、管理可配置助手以及其他核心功能的路由（[查看所有默认 API 端点](/langsmith/server-api-ref)）。

您可以通过提供自己的 [`Starlette`](https://www.starlette.io/applications/) 应用（包括 [`FastAPI`](https://fastapi.tiangolo.com/)、[`FastHTML`](https://fastht.ml/) 和其他兼容的应用）来添加自定义路由。您可以通过在 `langgraph.json` 配置文件中提供应用的路径来让 LangSmith 感知到它。

定义自定义应用对象允许您添加任何想要的路由，因此您可以实现从添加 `/login` 端点到编写整个全栈 Web 应用的所有功能，所有这些都部署在单个 Agent Server 中。

下面是一个使用 FastAPI 的示例。

## 创建应用

从一个**现有的** LangSmith 应用开始，将以下自定义路由代码添加到您的 `webapp.py` 文件中。如果您是从头开始，可以使用 CLI 从模板创建一个新应用。

```bash
langgraph new --template=new-langgraph-project-python my_new_project
```

拥有一个 LangGraph 项目后，添加以下应用代码：

```python {highlight={4}}
# ./src/agent/webapp.py
from fastapi import FastAPI

app = FastAPI()

@app.get("/hello")
def read_root():
    return {"Hello": "World"}
```

## 配置 `langgraph.json`

将以下内容添加到您的 `langgraph.json` 配置文件中。确保路径指向您在上面创建的 `webapp.py` 文件中的 FastAPI 应用实例 `app`。

```json
{
  "dependencies": ["."],
  "graphs": {
    "agent": "./src/agent/graph.py:graph"
  },
  "env": ".env",
  "http": {
    "app": "./src/agent/webapp.py:app"
  }
  // 其他配置选项，如 auth、store 等。
}
```

## 启动服务器

在本地测试服务器：

```bash
langgraph dev --no-browser
```

如果您在浏览器中导航到 `localhost:2024/hello`（`2024` 是默认的开发端口），您应该看到 `/hello` 端点返回 `{"Hello": "World"}`。

<Note>

<strong>覆盖默认端点</strong>
您在应用中创建的路由优先级高于系统默认路由，这意味着您可以覆盖并重新定义任何默认端点的行为。

</Note>

## 部署

您可以将此应用按原样部署到 LangSmith 或您的自托管平台。

## 后续步骤

现在您已经为部署添加了自定义路由，您可以使用相同的技术进一步自定义服务器的行为，例如定义[自定义中间件](/langsmith/custom-middleware)和[自定义生命周期事件](/langsmith/custom-lifespan)。
