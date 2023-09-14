import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { ReactNode } from 'react'

//データの保管庫
const queryClient = new QueryClient()

function TanStackProvider({ children }: { children: ReactNode }) {
  return (
    // reduxと同じでこのchildrenの全てからqueryClientにアクセスできる様になる
    <QueryClientProvider client={queryClient}>
      {children}
      {/* 開発者ツール */}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  )
}

export default function App({ Component, pageProps }: AppProps) {
  return (
    <TanStackProvider>
      <Component {...pageProps} />
    </TanStackProvider>
  )
}
