'use client';

import { usePathname } from 'next/navigation';

interface AdminAwareLayoutProps {
    children: React.ReactNode;
    header: React.ReactNode;
    footer: React.ReactNode;
    mobileCta: React.ReactNode;
    others?: React.ReactNode;
}

export function AdminAwareLayout({ children, header, footer, mobileCta, others }: AdminAwareLayoutProps) {
    const pathname = usePathname();
    const isAdmin = pathname?.startsWith('/admin');

    if (isAdmin) {
        return <>{children}</>;
    }

    return (
        <>
            {header}
            {others}
            <main className="flex-1 px-4">{children}</main>
            {footer}
            {mobileCta}
        </>
    );
}
