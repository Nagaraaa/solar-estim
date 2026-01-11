'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabaseBrowser } from '@/lib/supabase-browser';
import Cookies from 'js-cookie';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Lock, Mail, Loader2, AlertCircle } from 'lucide-react';
import { FadeIn } from '@/components/ui/fade-in';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();

        setLoading(true);
        setError(null);

        try {


            const { data, error } = await supabaseBrowser.auth.signInWithPassword({
                email,
                password,
            });

            if (error) {
                console.error("❌ Supabase Auth Error:", error);
                throw error;
            }



            // ✅ Connexion réussie, set Secure Cookie via Server Action
            if (data.session) {
                const { setAuthCookie } = await import('@/app/actions/auth');
                await setAuthCookie(data.session.access_token);
            }

            // Force hard redirect to refresh middleware
            window.location.href = '/admin';

        } catch (err: any) {
            console.error('Login exception:', err);
            const msg = err.message || "Échec de la connexion.";
            setError(msg);
            alert("Erreur de connexion : " + msg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
            <FadeIn>
                <div className="w-full max-w-md">
                    <div className="text-center mb-8">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-brand/10 mb-4">
                            <Lock className="w-8 h-8 text-brand" />
                        </div>
                        <h1 className="text-2xl font-bold text-white">Solar-Pulse Admin</h1>
                        <p className="text-slate-400">Accès sécurisé au tableau de bord</p>
                    </div>

                    <Card className="border-slate-800 bg-slate-950/50 backdrop-blur shadow-2xl">
                        <CardHeader>
                            <CardTitle className="text-white">Connexion</CardTitle>
                            <CardDescription>Entrez vos identifiants administrateur</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleLogin} className="space-y-4">
                                {error && (
                                    <div className="bg-red-500/10 border border-red-500/50 text-red-500 p-3 rounded-md text-sm flex items-center gap-2">
                                        <AlertCircle className="w-4 h-4 shrink-0" />
                                        <span>{error}</span>
                                    </div>
                                )}

                                <div className="space-y-2">
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-3 h-5 w-5 text-slate-500" />
                                        <Input
                                            type="email"
                                            placeholder="admin@solarestim.com"
                                            className="pl-10 bg-slate-900 border-slate-700 text-white placeholder:text-slate-500 focus-visible:ring-brand"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <div className="relative">
                                        <Lock className="absolute left-3 top-3 h-5 w-5 text-slate-500" />
                                        <Input
                                            type="password"
                                            placeholder="Mot de passe"
                                            className="pl-10 bg-slate-900 border-slate-700 text-white placeholder:text-slate-500 focus-visible:ring-brand"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            required
                                        />
                                    </div>
                                </div>

                                <Button
                                    type="submit"
                                    className="w-full bg-brand hover:bg-brand/90 text-white font-bold h-11"
                                    disabled={loading}
                                >
                                    {loading ? (
                                        <div className="flex items-center gap-2">
                                            <Loader2 className="w-4 h-4 animate-spin" />
                                            Connexion...
                                        </div>
                                    ) : (
                                        "Se connecter"
                                    )}
                                </Button>
                            </form>
                        </CardContent>
                    </Card>

                    <p className="text-center text-xs text-slate-600 mt-8">
                        &copy; 2026 Solar Estim - Accès restreint
                    </p>
                </div>
            </FadeIn>
        </div>
    );
}
