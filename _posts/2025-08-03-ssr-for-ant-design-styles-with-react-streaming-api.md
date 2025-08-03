---
title: Server-Side Rendering for Ant Design Styles with React's Streaming API
excerpt: Implementing server-side rendering for Ant Design styles with React's streaming API
layout: post
category: blog
---

I recently had reasons to use the Ant design component library with a remix run project mostly because of the well-documented, practical
components the library provides. However, support for integrating ant design with any framework (remix in my case) that 
encourages rendering through streaming, is non-existent. While Ant Design's documentation outlines steps for Vite (Remix's build tool of choice),
however, this approach resulted in FOUC[^1]. I wanted something better than what was suggested 
that particularly catered to the streaming rendering paradigm remix run uses.

I couldn't find any guidance on how one might go about integrating ant design, that is till I stumbled on a post[^2] that discussed how one 
might go about supporting serverside rendering of ant design styles if one was rendering React to string. This then inspired me to adapt the principles suggested in the post to support React's streaming paradigm.

We'll want to create a helper class that will consolidate everything that relates to injecting server rendered styles
into the document.

```typescript
// @errors: 2307 1108
// @ts-expect-error -- this import errors becuase @ant-design/cssinjs is not installed
import { extractStyle } from '@ant-design/cssinjs';

export class InjectAntDSSRStyles {
  static stylesSigill = '__ANTD__';

  constructor(private stylesToInject: ReturnType<typeof extractStyle>) {
    this.stylesToInject = stylesToInject;
  }

  createTransformStream() {
    const transformer: Transformer = {
      start() {},
      transform: (chunk, controller) => {
        const text = new TextDecoder().decode(chunk);
        const replaced = text.replace(
          InjectAntDSSRStyles.stylesSigill,
          this.stylesToInject
        );
        controller.enqueue(new TextEncoder().encode(replaced));
      },
      flush(controller) {
        controller.terminate();
      },
    };

    return new TransformStream(transformer);
  }
}
```

In our `root.tsx` (or equivalent) file, we would then use the static property `stylesSigill` on our predefined `InjectAntDSSRStyles` class to create a placeholder in the 
html document that would get streamed to the user from the server like so;

```typescript
// @ts-expect-error -- this errors because InjectAntDSSRStyles is expected to be imported
typeof document === 'undefined' ? InjectAntDSSRStyles.stylesSigill : '' // [!code ++]
```
Given we've followed the steps above, next we use the `InjectAntDSSRStyles` class in our server's `handleRequest` (or equivalent) function to inject the styles extracted from the document 
to be rendered into the response stream that will be sent to the user, below is a diff of how the `handleRequest` function would look like after we've integrated our helper class;

```tsx
// @errors: 2307 2304 2552 1005 2345 2874 2686
import React from 'react';
import { renderToReadableStream } from 'react-dom/server';
// @ts-expect-error -- this import returns an becuase @ant-design/cssinjs is not installed
import { createCache, extractStyle, StyleProvider } from '@ant-design/cssinjs'; // [!code ++]

export default async function handleRequest(
  request: Request,
  responseStatusCode: number,
  responseHeaders: Headers,
  ...rest: unknown[] // other parameters specific to your remix run setup
) {
  // we'd want to create this cache before constructing the
  // react tree that'll be rendered
  const antDStyleCache = createCache(); // [!code ++]
  
  const body = await renderToReadableStream(
    // we include the cache in the StyleProvider component
    <StyleProvider cache={antDStyleCache}> // [!code ++]
      ...
    </StyleProvider>, // [!code ++]
  );

  // @ts-expect-error -- this errors because InjectAntDSSRStyles is expected to be imported
  const injectAntdStyles = new InjectAntDSSRStyles( // [!code ++]
    extractStyle(antDStyleCache) // [!code ++]
  ).createTransformStream(); // [!code ++]

  // finally we pipe the stream response through the util we created
  return new Response(body.pipeThrough(injectAntdStyles), {// [!code ++]
    headers: responseHeaders,
    status: responseStatusCode,
  });
}
```

### References

[^1]: [FOUC](https://webkit.org/blog/66/the-fouc-problem/){:target="\_blank"}
[^2]: [Remix 集成 antd 和 pro-components](https://juejin.cn/post/7213923957823995960){:target="\_blank"}
