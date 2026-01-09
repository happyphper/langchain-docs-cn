---
title: 追踪生成器函数
sidebarTitle: Trace generator functions
---
在大多数 LLM 应用中，您会希望流式传输输出，以最小化用户看到第一个 token 所需的时间。

LangSmith 的追踪功能通过 `generator` 函数原生支持流式输出。以下是一个示例。

::: code-group

```python [Python]
from langsmith import traceable
@traceable
def my_generator():
  for chunk in ["Hello", "World", "!"]:
      yield chunk
# Stream to the user
for output in my_generator():
  print(output)
# It also works with async functions
import asyncio
@traceable
async def my_async_generator():
  for chunk in ["Hello", "World", "!"]:
      yield chunk
# Stream to the user
async def main():
  async for output in my_async_generator():
      print(output)
asyncio.run(main())
```

```typescript [TypeScript]
import { traceable } from "langsmith/traceable";
const myGenerator = traceable(function* () {
  for (const chunk of ["Hello", "World", "!"]) {
      yield chunk;
  }
});
for (const output of myGenerator()) {
  console.log(output);
}
```

:::

## 聚合结果[](#aggregate-results "Direct link to Aggregate Results")

默认情况下，被追踪函数的 `outputs` 在 LangSmith 中会被聚合成一个单一的数组。如果您想自定义其存储方式（例如，将输出连接成一个字符串），可以使用 `aggregate` 选项（在 Python 中是 `reduce_fn`）。这对于聚合流式 LLM 输出尤其有用。

<Note>

聚合输出<strong>仅</strong>影响追踪表示中的输出。它不会改变您的函数返回的值。

</Note>

::: code-group

```python [Python]
from langsmith import traceable
def concatenate_strings(outputs: list):
  return "".join(outputs)
@traceable(reduce_fn=concatenate_strings)
def my_generator():
  for chunk in ["Hello", "World", "!"]:
      yield chunk
# Stream to the user
for output in my_generator():
  print(output)
# It also works with async functions
import asyncio
@traceable(reduce_fn=concatenate_strings)
async def my_async_generator():
  for chunk in ["Hello", "World", "!"]:
      yield chunk
# Stream to the user
async def main():
  async for output in my_async_generator():
      print(output)
asyncio.run(main())
```

```typescript [TypeScript]
import { traceable } from "langsmith/traceable";
const concatenateStrings = (outputs: string[]) => outputs.join("");
const myGenerator = traceable(function* () {
  for (const chunk of ["Hello", "World", "!"]) {
      yield chunk;
  }
}, { aggregator: concatenateStrings });
for (const output of await myGenerator()) {
  console.log(output);
}
```

:::

