import { HeroSection } from "@/components/sections/HeroSection";
import { FeatureSection } from "@/components/sections/FeatureSection";
import { BlogPreviewSection } from "@/components/sections/BlogPreviewSection";
import { CtaSection } from "@/components/sections/CtaSection";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <HeroSection
        title={<>Estimez la rentabilité de vos panneaux solaires en <span className="text-brand">France et Belgique</span></>}
        subtitle="Un calcul précis basé sur l'ensoleillement réel de votre toiture (Données scientifiques PVGIS)."
        ctaLink="/simulateur"
      />

      <FeatureSection variant="FR" />

      <BlogPreviewSection country="FR" />

      <CtaSection ctaLink="/simulateur" />
    </div>
  );
}

