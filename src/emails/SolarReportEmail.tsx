import * as React from 'react';
import {
    Body,
    Button,
    Container,
    Head,
    Heading,
    Html,
    Img,
    Preview,
    Section,
    Text,
    Tailwind,
    Hr,
    Column,
    Row,
} from '@react-email/components';

interface SolarReportEmailProps {
    name: string;
    city: string;
    annualProduction: number;
    annualSavings: number;
    totalCostObserved: number; // Net cost
}

export const SolarReportEmail = ({
    name = "Client",
    city = "Votre Ville",
    annualProduction = 0,
    annualSavings = 0,
    totalCostObserved = 0,
}: SolarReportEmailProps) => {
    const previewText = `Votre étude solaire pour ${city} est prête ☀️`;

    return (
        <Html>
            <Head />
            <Preview>{previewText}</Preview>
            <Tailwind>
                <Body className="bg-slate-50 my-auto mx-auto font-sans">
                    <Container className="border border-solid border-[#eaeaea] rounded my-[40px] mx-auto p-[20px] max-w-[465px] bg-white text-center">
                        <Section className="mt-[32px]">
                            {/* Logo Placeholder - User can replace src later or we use a public URL if available */}
                            <Heading className="text-black text-[24px] font-normal text-center p-0 my-[30px] mx-0">
                                <strong>SolarEstim</strong>
                            </Heading>
                        </Section>

                        <Heading className="text-black text-[20px] font-normal text-center p-0 my-[30px] mx-0">
                            Votre Étude Solaire pour <strong>{city}</strong> ☀️
                        </Heading>

                        <Text className="text-black text-[14px] leading-[24px]">
                            Bonjour {name},
                        </Text>
                        <Text className="text-black text-[14px] leading-[24px]">
                            Voici le résultat de votre simulation pour votre maison à <strong>{city}</strong>.
                            Ces chiffres sont basés sur l'ensoleillement réel de votre région.
                        </Text>

                        <Section className="my-[20px] border border-solid border-[#eaeaea] rounded-lg overflow-hidden">
                            <Row className="border-b border-solid border-[#eaeaea] bg-slate-50">
                                <Column className="px-4 py-2 text-left text-xs font-bold text-slate-500 uppercase">Donnée</Column>
                                <Column className="px-4 py-2 text-right text-xs font-bold text-slate-500 uppercase">Estimation</Column>
                            </Row>
                            <Row className="border-b border-solid border-[#eaeaea]">
                                <Column className="px-4 py-3 text-left">Production estimée</Column>
                                <Column className="px-4 py-3 text-right font-bold text-amber-600">{annualProduction.toLocaleString()} kWh/an</Column>
                            </Row>
                            <Row className="border-b border-solid border-[#eaeaea]">
                                <Column className="px-4 py-3 text-left">Économies (25 ans)</Column>
                                <Column className="px-4 py-3 text-right font-bold text-emerald-600">{(annualSavings * 25).toLocaleString()} €</Column>
                            </Row>
                            <Row>
                                <Column className="px-4 py-3 text-left">Coût net estimé</Column>
                                <Column className="px-4 py-3 text-right font-bold text-slate-800">{totalCostObserved.toLocaleString()} €</Column>
                            </Row>
                        </Section>

                        <Section className="text-center mt-[32px] mb-[32px]">
                            <Button
                                className="bg-[#10b981] rounded text-white text-[12px] font-semibold no-underline text-center px-5 py-3"
                                href="https://solarestim.com" // Link to website or appointment booking
                            >
                                Demander ma mise en relation installateur
                            </Button>
                        </Section>

                        <Hr className="border border-solid border-[#eaeaea] my-[26px] mx-0 w-full" />

                        <Text className="text-[#666666] text-[12px] leading-[24px]">
                            Ceci est une estimation automatique basée sur les données PVGIS de la Commission Européenne.
                            Les devis finaux peuvent varier selon les contraintes techniques de votre toiture.
                        </Text>
                    </Container>
                </Body>
            </Tailwind>
        </Html>
    );
};

export default SolarReportEmail;
