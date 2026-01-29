import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Home, ArrowLeft } from 'lucide-react';

export default function NotFound() {
    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 text-center space-y-8 py-20">
            <div className="space-y-4">
                <div className="rounded-full bg-slate-100 p-4 w-20 h-20 mx-auto flex items-center justify-center">
                    <span className="text-4xl">🤔</span>
                </div>
                <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">
                    Page introuvable
                </h1>
                <p className="max-w-md mx-auto text-lg text-slate-600">
                    Oups ! La page que vous recherchez semble avoir disparu ou n'a jamais existé.
                </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/">
                    <Button variant="default" size="lg" className="w-full sm:w-auto font-bold gap-2">
                        <Home className="w-4 h-4" />
                        Retour à l'accueil
                    </Button>
                </Link>
                <Link href="/simulateur">
                    <Button variant="outline" size="lg" className="w-full sm:w-auto font-bold gap-2">
                        <ArrowLeft className="w-4 h-4" />
                        Lancer une simulation
                    </Button>
                </Link>
            </div>
        </div>
    );
}
