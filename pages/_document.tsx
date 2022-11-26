import { NextPageContext } from "next";
import {
  ComponentsEnhancer,
  DocumentContext,
  RenderPageResult,
} from "next/dist/shared/lib/utils";
import Document from "next/document";
import { ServerStyleSheet } from "styled-components";

export interface CustomContext extends NextPageContext {
  renderPage: (
    enhanceApp: ComponentsEnhancer | undefined
  ) => RenderPageResult | Promise<RenderPageResult>;
}

export default class MyDocument extends Document {
  static async getInitialProps(ctx: CustomContext) {
    const sheet = new ServerStyleSheet();

    const originalRenderPage = ctx.renderPage;

    try {
      ctx.renderPage = (): RenderPageResult | Promise<RenderPageResult> =>
        originalRenderPage({
          enhanceApp: (App: any) => (props: any) =>
            sheet.collectStyles(<App {...props} />),
        });

      const initialProps = await Document.getInitialProps(
        ctx as DocumentContext
      );
      return {
        ...initialProps,
        styles: (
          <>
            {initialProps.styles}
            {sheet.getStyleElement()}
          </>
        ),
      };
    } finally {
      sheet.seal();
    }
  }
}
