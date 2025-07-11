
import ProviderComponent from '@/components/layouts/ProviderComponent';
import 'react-perfect-scrollbar/dist/css/styles.css';
import '../styles/tailwind.css';
import '../styles/global.css';
import { Metadata } from 'next';
import { JetBrains_Mono, Figtree } from 'next/font/google';
import localfont from 'next/font/local';
import NextAuthProvider from '@/components/layouts/NextAuthProvider';
import Script from 'next/script';

export const metadata: Metadata = {
    title: {
        template: '%s | HYPE3',
        default: 'HYPE3',
    },
    description: 'First on-chain IP agent framework on Solana',
    openGraph: {
        title: 'HYPE3',
        description: 'First on-chain IP agent framework on Solana',
        url: 'https://hype3.cool',
        images: [
          {
            url:  `${process.env.NEXT_PUBLIC_HOST}/assets/images/hype3-cover.png?v=20250109`,
            width: 256,
            height: 256,
            alt: 'Hype3',
          },
        ],
        siteName: 'Hype3.Cool',
      },
    icons: {
        icon: '/favicon.ico',
    },
    viewport: {
        width: 'device-width',
        initialScale: 1,
        maximumScale: 1,
        userScalable: false,
    },
};

const jetbrains = JetBrains_Mono({
    weight: ['400', '500', '600', '700'],
    subsets: ['latin', 'latin-ext'],
    display: 'swap',
    variable: '--font-jetbrains',
});

const figtree = Figtree({
    weight: ['300', '400', '500', '600', '700', '800', '900'],
    subsets: ['latin', 'latin-ext'],
    display: 'swap',
    variable: '--font-figtree',
});

const neopixel = localfont({
    src: '../public/fonts/neopixel-regular.otf',
    variable: '--font-neopixel',
});


export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en" style={{ backgroundColor: '#000000' }}>
            {/* <head>
                <Script src="https://terminal.jup.ag/main-v3.js" data-preload />
            </head> */}
            <body className={`${neopixel.variable} ${jetbrains.variable} ${figtree.variable}`}>
                <link rel="icon" href="/favicon.ico" sizes="any" />
                <NextAuthProvider>
                    <ProviderComponent>
                        {children}
                    </ProviderComponent>
                </NextAuthProvider>
            </body>
        </html>
    );
}
