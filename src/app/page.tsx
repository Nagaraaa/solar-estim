import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle, ArrowRight, Zap, PiggyBank, Leaf } from "lucide-react";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 lg:py-32 overflow-hidden bg-slate-900 text-white">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1509391366360-2e959784a276?auto=format&fit=crop&w=2000&q=80')] bg-cover bg-center opacity-20" />
        <div className="container relative z-10 px-4 md:px-6 mx-auto text-center">
          <h1 className="text-4xl lg:text-6xl font-extrabold tracking-tight mb-6">
            Passez au solaire <span className="text-brand">en toute confiance</span>
          </h1>
          <p className="text-xl text-slate-300 max-w-2xl mx-auto mb-10">
            Calculez votre potentiel solaire en instantané avec notre simulateur certifié PVGIS.
            Précis, gratuit et sans engagement.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link href="/simulateur">
              <Button size="lg" variant="brand" className="w-full sm:w-auto text-lg font-bold px-8 h-12">
                Lancer le simulateur <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>

          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="py-12 bg-slate-50 border-b border-slate-200">
        <div className="container px-4 md:px-6 mx-auto text-center">
          <p className="text-sm font-semibold text-slate-500 uppercase tracking-widest mb-8">
            Ils nous font confiance
          </p>
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
            {/* Mock Logos */}
            <span className="text-xl font-black text-slate-800">SOLAR<span className="text-brand">TECH</span></span>
            <span className="text-xl font-bold text-slate-800">ECO<span className="text-success">ENERGY</span></span>
            <span className="text-xl font-bold text-slate-800">GREEN<span className="text-slate-600">ROOF</span></span>
            <span className="text-xl font-black text-slate-800">PV<span className="font-light">MAX</span></span>
          </div>
        </div>
      </section>

      {/* Value Props */}
      <section id="comment-ca-marche" className="py-20 bg-white">
        <div className="container px-4 md:px-6 mx-auto">
          <h2 className="text-3xl font-bold text-center mb-16 text-slate-900">Pourquoi utiliser Solar-Estim ?</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="p-4 bg-brand/10 rounded-full text-brand-foreground">
                <Zap className="h-10 w-10" />
              </div>
              <h3 className="text-xl font-bold">Précision Scientifique</h3>
              <p className="text-slate-600">
                Basé sur les données satellites PVGIS de la Commission Européenne pour une estimation fiable à 95%.
              </p>
            </div>
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="p-4 bg-success/10 rounded-full text-success">
                <PiggyBank className="h-10 w-10" />
              </div>
              <h3 className="text-xl font-bold">Calcul de Rentabilité</h3>
              <p className="text-slate-600">
                Nous analysons votre facture actuelle pour estimer vos économies réelles et votre retour sur investissement.
              </p>
            </div>
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="p-4 bg-blue-100 rounded-full text-blue-600">
                <Leaf className="h-10 w-10" />
              </div>
              <h3 className="text-xl font-bold">Installateurs Certifiés</h3>
              <p className="text-slate-600">
                Accédez à un réseau d'artisans RGE vérifiés près de chez vous pour concrétiser votre projet.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Blog Preview */}
      <section className="py-20 bg-slate-50">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="flex justify-between items-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900">Derniers articles</h2>
            <Link href="/blog" className="text-brand font-bold hover:underline">
              Voir tout le blog
            </Link>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                title: "Prix des panneaux solaires en 2025",
                category: "Marché",
                slug: "prix-panneau-solaire-2025",
                image: "https://images.unsplash.com/photo-1611365892117-00ac5ef43c90?auto=format&fit=crop&w=800&q=80"
              },
              {
                title: "Rentabilité dans le Nord : Mythe ou Réalité ?",
                category: "Guide",
                slug: "rentabilite-nord-france",
                image: "https://images.unsplash.com/photo-1624397640148-949b1732bb0a?auto=format&fit=crop&w=800&q=80"
              },
              {
                title: "Les aides de l'état décryptées",
                category: "Financement",
                slug: "aides-etat-panneaux",
                image: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=800&q=80"
              }
            ].map((post, i) => (
              <Link key={i} href={`/blog/${post.slug}`} className="group">
                <Card className="h-full hover:shadow-lg transition-shadow border-slate-200">
                  <div className="h-48 bg-slate-200 w-full object-cover rounded-t-lg bg-cover" style={{ backgroundImage: `url(${post.image})` }} />
                  <CardContent className="p-6">
                    <div className="text-xs font-semibold text-brand uppercase tracking-wider mb-2">{post.category}</div>
                    <h3 className="text-xl font-bold text-slate-900 group-hover:text-brand transition-colors">
                      {post.title}
                    </h3>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 bg-brand text-slate-900">
        <div className="container px-4 md:px-6 mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-extrabold mb-6">Prêt à passer au vert ?</h2>
          <p className="text-xl font-medium opacity-90 mb-8 max-w-2xl mx-auto">
            Découvrez combien vous pouvez économiser dès aujourd'hui. C'est gratuit et sans engagement.
          </p>
          <Link href="/simulateur">
            <Button size="lg" className="bg-slate-900 text-white hover:bg-slate-800 text-lg px-10 h-14 shadow-2xl">
              Calculer ma rentabilité maintenant
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
