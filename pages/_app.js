import './style.css'
import '@hashicorp/platform-util/nprogress/style.css'

import NProgress from '@hashicorp/platform-util/nprogress'
import createConsentManager from '@hashicorp/react-consent-manager/loader'
import usePageviewAnalytics from '@hashicorp/platform-analytics'
import useAnchorLinkAnalytics from '@hashicorp/platform-util/anchor-link-analytics'
import rivetQuery from '@hashicorp/nextjs-scripts/dato/client'
import Router from 'next/router'
import HashiHead from '@hashicorp/react-head'
import AlertBanner from '@hashicorp/react-alert-banner'
import { ErrorBoundary } from '@hashicorp/platform-runtime-error-monitoring'
import Footer from 'components/footer'
import Error from './_error'
import { productName } from '../data/metadata'
import alertBannerData, { ALERT_BANNER_ACTIVE } from 'data/alert-banner'
import StandardLayout from 'layouts/standard'

NProgress({ Router })
const { ConsentManager } = createConsentManager({
  preset: 'oss',
})

function App({ Component, pageProps, layoutData }) {
  usePageviewAnalytics()
  useAnchorLinkAnalytics()

  const Layout = Component.layout ?? StandardLayout

  return (
    <ErrorBoundary FallbackComponent={Error}>
      <HashiHead
        title={`${productName} by HashiCorp`}
        siteName={`${productName} by HashiCorp`}
        description="Terraform is an open-source infrastructure as code software tool that enables you to safely and predictably create, change, and improve infrastructure."
        image="/img/og-image.png"
        stylesheet={[
          {
            href: 'https://fonts.googleapis.com/css?family=Open+Sans:300,400,600,700&display=swap',
          },
        ]}
        icon={[{ href: '/favicon.ico' }]}
      />
      {ALERT_BANNER_ACTIVE && (
        <AlertBanner {...alertBannerData} product="terraform" hideOnMobile />
      )}
      <Layout {...(layoutData && { data: layoutData })}>
        <div className="page-content">
          <Component {...pageProps} />
        </div>
      </Layout>
      <ConsentManager />
    </ErrorBoundary>
  )
}

App.getInitialProps = async ({ Component, ctx }) => {
  const layoutQuery = Component.layout
    ? Component.layout?.rivetParams ?? null
    : StandardLayout.rivetParams

  const layoutData = layoutQuery ? await rivetQuery(layoutQuery) : null

  let pageProps = {}

  if (Component.getInitialProps) {
    pageProps = await Component.getInitialProps(ctx)
  } else if (Component.isMDXComponent) {
    // fix for https://github.com/mdx-js/mdx/issues/382
    const mdxLayoutComponent = Component({}).props.originalType
    if (mdxLayoutComponent.getInitialProps) {
      pageProps = await mdxLayoutComponent.getInitialProps(ctx)
    }
  }

  return { pageProps, layoutData }
}

export default App