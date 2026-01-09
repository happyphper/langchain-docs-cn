### 2. 部署到 LangSmith

<Steps>

<Step title="导航到 LangSmith 部署">

登录 [LangSmith](https://smith.langchain.com/)。在左侧边栏中，选择 <strong>Deployments</strong>。

</Step>

<Step title="创建新部署">

点击 <strong>+ New Deployment</strong> 按钮。将打开一个窗格，您可以在其中填写必填字段。

</Step>

<Step title="关联代码仓库">

如果您是首次使用，或者要添加一个之前未连接过的私有仓库，请点击 <strong>Add new account</strong> 按钮，并按照说明连接您的 GitHub 账户。

</Step>

<Step title="部署仓库">

选择您应用程序的仓库。点击 <strong>Submit</strong> 进行部署。此过程可能需要大约 15 分钟才能完成。您可以在 <strong>Deployment details</strong> 视图中查看状态。

</Step>

</Steps>

### 3. 在 Studio 中测试您的应用程序

一旦您的应用程序部署完成：

1.  选择您刚刚创建的部署以查看更多详情。
2.  点击右上角的 **Studio** 按钮。Studio 将打开并显示您的图。

### 4. 获取部署的 API URL

1.  在 LangGraph 的 **Deployment details** 视图中，点击 **API URL** 将其复制到剪贴板。
2.  点击 `URL` 将其复制到剪贴板。

### 5. 测试 API

您现在可以测试 API：

<Tabs>

<Tab title="JavaScript">

1.  安装 LangGraph JS：

```shell
npm install @langchain/langgraph-sdk
```
2.  向代理发送消息：

```ts
const { Client } = await import("@langchain/langgraph-sdk");

const client = new Client({ apiUrl: "your-deployment-url", apiKey: "your-langsmith-api-key" });

const streamResponse = client.runs.stream(
    null,    // Threadless run
    "agent", // Name of agent. Defined in langgraph.json.
    {
        input: {
            "messages": [
                { "role": "user", "content": "What is LangGraph?"}
            ]
        },
        streamMode: "messages",
    }
);

for await (const chunk of streamResponse) {
    console.log(`Receiving new event of type: ${chunk.event}...`);
    console.log(JSON.stringify(chunk.data));
    console.log("\n\n");
}
```

</Tab>

<Tab title="Rest API">

```bash
curl -s --request POST \
    --url <DEPLOYMENT_URL>/runs/stream \
    --header 'Content-Type: application/json' \
    --header "X-Api-Key: <LANGSMITH API KEY> \
    --data "{
        \"assistant_id\": \"agent\", `# Name of agent. Defined in langgraph.json.`
        \"input\": {
            \"messages\": [
                {
                    \"role\": \"human\",
                    \"content\": \"What is LangGraph?\"
                }
            ]
        },
        \"stream_mode\": \"updates\"
    }"
```

</Tab>

</Tabs>

<Tip>

LangSmith 提供额外的托管选项，包括自托管和混合托管。更多信息，请参阅 [平台设置概述](/langsmith/platform-setup)。

</Tip>

