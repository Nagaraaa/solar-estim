'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { supabaseBrowser } from '@/lib/supabase-browser';
import { Button } from '@/components/ui/button';
import { LayoutDashboard, Users, Settings, LogOut, Menu, X } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const [userEmail, setUserEmail] = useState<string>('Chargement...');
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const pathname = usePathname();
    const router = useRouter();

    useEffect(() => {
        const getUser = async () => {
            const { data: { user } } = await supabaseBrowser.auth.getUser();
            if (user?.email) {
                setUserEmail(user.email);
            }
        };
        getUser();
    }, []);

    const handleLogout = async () => {
        await supabaseBrowser.auth.signOut();
        // Clear manual cookie
        document.cookie = "solar-admin-auth=; path=/; max-age=0";
        router.push('/login');
        router.refresh();
    };

    const navItems = [
        { href: '/admin', label: 'Tableau de bord', icon: LayoutDashboard },
        { href: '/admin/settings', label: 'Paramètres', icon: Settings },
    ];

    return (
        <div className="min-h-screen bg-[#0B1120] text-slate-100 flex">
            {/* Mobile Sidebar Overlay */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside className={cn(
                "fixed inset-y-0 left-0 z-50 w-64 bg-slate-900 text-white transition-transform duration-300 transform lg:translate-x-0 flex flex-col shadow-xl",
                isSidebarOpen ? "translate-x-0" : "-translate-x-full"
            )}>
                {/* Logo */}
                <div className="h-16 flex items-center px-6 border-b border-slate-800 shrink-0">
                    <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-brand to-yellow-400">
                        Solar-Pulse
                    </span>
                    <button
                        onClick={() => setIsSidebarOpen(false)}
                        className="ml-auto lg:hidden text-slate-400 hover:text-white"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Nav */}
                <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                onClick={() => setIsSidebarOpen(false)}
                                className={cn(
                                    "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                                    isActive
                                        ? "bg-brand text-slate-900"
                                        : "text-slate-400 hover:text-white hover:bg-slate-800"
                                )}
                            >
                                <Icon className="w-5 h-5" />
                                {item.label}
                            </Link>
                        )
                    })}
                </nav>

                {/* Footer / User */}
                <div className="p-4 border-t border-slate-800 shrink-0">
                    <div className="flex items-center gap-3 px-3 py-2 mb-4">
                        <div className="w-8 h-8 rounded-full bg-brand/20 flex items-center justify-center text-brand font-bold text-xs">
                            AD
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-white truncate">Admin</p>
                            <p className="text-xs text-slate-500 truncate" title={userEmail}>{userEmail}</p>
                        </div>
                    </div>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleLogout}
                        className="w-full justify-start text-red-400 hover:text-red-300 hover:bg-red-950/30 gap-2"
                    >
                        <LogOut className="w-4 h-4" />
                        Déconnexion
                    </Button>
                </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col min-h-screen lg:pl-64 transition-all duration-300">
                {/* Mobile Header */}
                <header className="h-16 lg:hidden bg-white border-b border-slate-200 flex items-center px-4 justify-between sticky top-0 z-30">
                    <span className="font-bold text-slate-900">Solar-Pulse</span>
                    <Button variant="ghost" size="icon" onClick={() => setIsSidebarOpen(true)}>
                        <Menu className="w-6 h-6" />
                    </Button>
                </header>

                <main className="flex-1 p-4 lg:p-8">
                    {children}
                </main>
            </div>
        </div>
    );
}
