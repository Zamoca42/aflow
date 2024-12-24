import type { MDXComponents } from "mdx/types";
import Image, { ImageProps } from "next/image";

// This file allows you to provide custom React components
// to be used in MDX files. You can import and use any
// React component you want, including inline styles,
// components from other libraries, and more.

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    h1: (props: any) => <h1 className="my-4 text-2xl font-bold" {...props} />,
    h2: (props: any) => <h2 className="my-4 text-xl font-bold" {...props} />,
    h3: (props: any) => <h3 className="my-4 text-lg font-bold" {...props} />,
    h4: (props: any) => <h4 className="my-4 text-base font-bold" {...props} />,
    h5: (props: any) => <h5 className="my-4 text-sm font-bold" {...props} />,
    h6: (props: any) => <h6 className="my-4 text-xs font-bold" {...props} />,
    p: (props: any) => <p className="text-base" {...props} />,
    a: (props: any) => <a className="text-blue-500" {...props} />,
    ul: (props: any) => <ul className="ml-6 list-disc" {...props} />,
    ol: (props: any) => <ol className="ml-6 list-decimal" {...props} />,
    li: (props: any) => <li className="text-base" {...props} />,
    blockquote: (props: any) => (
      <blockquote className="border-l-4 border-gray-300 pl-4" {...props} />
    ),
    code: (props: any) => <code className="text-base" {...props} />,
    pre: (props: any) => <pre className="text-base" {...props} />,
    br: (props: any) => <br className="my-4" {...props} />,
    em: (props: any) => <em className="text-base" {...props} />,
    strong: (props: any) => <strong className="text-base" {...props} />,
    hr: (props: any) => <hr className="my-4" {...props} />,
    img: (props: any) => (
      // eslint-disable-next-line jsx-a11y/alt-text
      <Image
        sizes="100vw"
        style={{ width: "100%", height: "auto" }}
        {...(props as ImageProps)}
      />
    ),
    ...components,
  };
}
