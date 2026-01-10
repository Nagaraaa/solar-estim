import * as React from 'react';
import {
    Body,
    Button,
    Container,
    Head,
    Heading,
    Html,
    Preview,
    Section,
    Text,
    Hr,
    Column,
    Row,
    Link,
} from '@react-email/components';

interface SolarReportEmailProps {
    name: string;
    city: string;
    annualProduction: number;
    annualSavings: number;
    totalCostObserved: number;
    selfConsumptionRate?: number; // 0.35 etc
    adminContactEmail?: string;
}

export const SolarReportEmail = ({
    name = "Partenaire Solaire",
    city = "Votre Ville",
    annualProduction = 0,
    annualSavings = 0,
    totalCostObserved = 0,
    selfConsumptionRate = 0.35,
    adminContactEmail = "contact@solarestim.com",
}: SolarReportEmailProps) => {
    const previewText = `☀️ Votre rapport solaire pour ${city} : ${annualSavings * 25}€ d'économies potentielles.`;
    const isBatteryRecommended = selfConsumptionRate < 0.50;

    return (
        <Html lang="fr">
            <Head />
            <Preview>{previewText}</Preview>
            <Body style={main}>
                <Container style={container}>

                    {/* Header Branding */}
                    <Section style={header}>
                        <Text style={brandText}>Solar Estim</Text>
                        <Text style={subBrandText}>Simulateur Officiel & Indépendant</Text>
                    </Section>

                    {/* Hero Hello */}
                    <Section style={sectionPadding}>
                        <Heading style={heading}>Bonjour {name},</Heading>
                        <Text style={paragraph}>
                            Bonne nouvelle ! Votre toiture à <span style={{ fontWeight: 'bold', color: '#0f172a' }}>{city}</span> possède un excellent potentiel solaire.
                            Voici votre rapport de rentabilité personnalisé.
                        </Text>
                    </Section>

                    {/* KPI Grid */}
                    <Section style={sectionPadding}>
                        <Row>
                            <Column style={{ width: '50%', paddingRight: '8px' }}>
                                <div style={kpiBoxAmber}>
                                    <Text style={kpiLabelAmber}>Production</Text>
                                    <Text style={kpiValueAmber}>
                                        {annualProduction.toLocaleString()} <span style={{ fontSize: '14px', fontWeight: 500, opacity: 0.7 }}>kWh/an</span>
                                    </Text>
                                </div>
                            </Column>
                            <Column style={{ width: '50%', paddingLeft: '8px' }}>
                                <div style={kpiBoxEmerald}>
                                    <Text style={kpiLabelEmerald}>Économies (25 ans)</Text>
                                    <Text style={kpiValueEmerald}>
                                        {(annualSavings * 25).toLocaleString()} <span style={{ fontSize: '14px', fontWeight: 500, opacity: 0.7 }}>€</span>
                                    </Text>
                                </div>
                            </Column>
                        </Row>
                    </Section>

                    {/* Main Stats Table */}
                    <Section style={sectionPadding}>
                        <div style={tableContainer}>
                            <Row style={tableRowHeader}>
                                <Column style={tableHeaderColLeft}>Indicateur</Column>
                                <Column style={tableHeaderColRight}>Résultat</Column>
                            </Row>
                            <Row style={tableRow}>
                                <Column style={tableColLeft}>Autoconsommation Estimée</Column>
                                <Column style={tableColRight}>{Math.round(selfConsumptionRate * 100)} %</Column>
                            </Row>
                            <Row style={tableRow}>
                                <Column style={tableColLeft}>Économie Annuelle Moyenne</Column>
                                <Column style={{ ...tableColRight, color: '#059669', fontWeight: 'bold' }}>~ {annualSavings.toLocaleString()} € / an</Column>
                            </Row>
                            <Row>
                                <Column style={tableColLeft}>Coût Net Installation (Est.)</Column>
                                <Column style={tableColRight}>{totalCostObserved.toLocaleString()} €</Column>
                            </Row>
                        </div>
                    </Section>

                    {/* Battery Optimization Card (Conditional) */}
                    {isBatteryRecommended && (
                        <Section style={sectionPadding}>
                            <div style={batteryCard}>
                                <Heading style={batteryHeading}>⚡ Boostez votre indépendance</Heading>
                                <Text style={batteryText}>
                                    Votre taux d'autoconsommation est inférieur à 50%.
                                    L'ajout d'une <strong>batterie domestique</strong> pourrait doubler vos économies en stockant le surplus solaire pour le soir.
                                </Text>
                                <Text style={batteryLink}>Parlez-en à votre expert &rarr;</Text>
                            </div>
                        </Section>
                    )}

                    {/* CTA */}
                    {/* Footer - No CTA for now */}
                    <Hr style={divider} />

                    {/* Footer */}
                    <Section style={footer}>
                        <Text style={copyright}>
                            © 2026 Solar Estim. Tous droits réservés.<br />
                            Ce rapport est une estimation automatique basée sur les données d'ensoleillement PVGIS (Commission Européenne).
                        </Text>
                    </Section>

                </Container>
            </Body>
        </Html>
    );
};

// Styles
const main = {
    backgroundColor: '#f8fafc',
    fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
    padding: '40px 0',
};

const container = {
    backgroundColor: '#ffffff',
    border: '1px solid #e2e8f0',
    borderRadius: '12px',
    boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    margin: '0 auto',
    maxWidth: '600px',
    overflow: 'hidden',
};

const header = {
    backgroundColor: '#0f172a',
    padding: '24px',
    textAlign: 'center' as const,
};

const brandText = {
    color: '#f59e0b',
    fontSize: '24px',
    fontWeight: 900,
    letterSpacing: '-0.025em',
    margin: 0,
    textTransform: 'uppercase' as const,
};

const subBrandText = {
    color: '#94a3b8',
    fontSize: '10px',
    letterSpacing: '0.1em',
    marginTop: '4px',
    textTransform: 'uppercase' as const,
    opacity: 0.8,
};

const sectionPadding = {
    padding: '0 32px 24px 32px',
};

const heading = {
    fontSize: '24px',
    fontWeight: 'bold',
    color: '#0f172a',
    margin: '32px 0 0 0',
    textAlign: 'center' as const,
};

const paragraph = {
    color: '#475569',
    fontSize: '16px',
    lineHeight: '24px',
    margin: '16px 0 0 0',
    textAlign: 'center' as const,
};

const kpiBoxAmber = {
    backgroundColor: '#fffbeb',
    border: '1px solid #fef3c7',
    borderRadius: '8px',
    padding: '16px',
    textAlign: 'center' as const,
    height: '100%',
};

const kpiLabelAmber = {
    color: '#92400e',
    fontSize: '10px',
    fontWeight: 'bold',
    letterSpacing: '0.05em',
    margin: '0 0 4px 0',
    textTransform: 'uppercase' as const,
};

const kpiValueAmber = {
    color: '#d97706',
    fontSize: '24px',
    fontWeight: 900,
    margin: 0,
};

const kpiBoxEmerald = {
    backgroundColor: '#ecfdf5',
    border: '1px solid #d1fae5',
    borderRadius: '8px',
    padding: '16px',
    textAlign: 'center' as const,
    height: '100%',
};

const kpiLabelEmerald = {
    color: '#065f46',
    fontSize: '10px',
    fontWeight: 'bold',
    letterSpacing: '0.05em',
    margin: '0 0 4px 0',
    textTransform: 'uppercase' as const,
};

const kpiValueEmerald = {
    color: '#059669',
    fontSize: '24px',
    fontWeight: 900,
    margin: 0,
};

const tableContainer = {
    border: '1px solid #e2e8f0',
    borderRadius: '8px',
    overflow: 'hidden',
};

const tableRowHeader = {
    backgroundColor: '#f8fafc',
    borderBottom: '1px solid #e2e8f0',
};

const tableHeaderColLeft = {
    padding: '12px 16px',
    textAlign: 'left' as const,
    fontSize: '10px',
    fontWeight: 'bold',
    color: '#64748b',
    textTransform: 'uppercase' as const,
};

const tableHeaderColRight = {
    padding: '12px 16px',
    textAlign: 'right' as const,
    fontSize: '10px',
    fontWeight: 'bold',
    color: '#64748b',
    textTransform: 'uppercase' as const,
};

const tableRow = {
    borderBottom: '1px solid #e2e8f0',
};

const tableColLeft = {
    padding: '12px 16px',
    textAlign: 'left' as const,
    fontSize: '14px',
    color: '#334155',
};

const tableColRight = {
    padding: '12px 16px',
    textAlign: 'right' as const,
    fontSize: '14px',
    fontWeight: 'bold',
    color: '#0f172a',
};

const batteryCard = {
    backgroundColor: '#eef2ff',
    border: '1px solid #e0e7ff',
    borderRadius: '8px',
    padding: '20px',
};

const batteryHeading = {
    color: '#312e81',
    fontSize: '16px',
    fontWeight: 'bold',
    margin: '0 0 8px 0',
};

const batteryText = {
    color: '#3730a3',
    fontSize: '14px',
    margin: 0,
    lineHeight: '20px',
};

const batteryLink = {
    color: '#4f46e5',
    fontSize: '12px',
    fontWeight: 'bold',
    marginTop: '12px',
    margin: '12px 0 0 0',
    textTransform: 'uppercase' as const,
    cursor: 'pointer',
};

const button = {
    backgroundColor: '#f59e0b',
    color: '#0f172a',
    borderRadius: '9999px',
    fontSize: '14px',
    fontWeight: 'bold',
    textDecoration: 'none',
    textAlign: 'center' as const,
    padding: '16px 32px',
    display: 'inline-block',
    boxShadow: '0 10px 15px -3px rgba(245, 158, 11, 0.2)',
};

const footerNote = {
    color: '#94a3b8',
    fontSize: '12px',
    marginTop: '16px',
    margin: '16px auto 0 auto',
    maxWidth: '320px',
    lineHeight: '1.25',
};

const divider = {
    border: 'none',
    borderTop: '1px solid #e2e8f0',
    margin: '0 32px',
};

const footer = {
    backgroundColor: '#f8fafc',
    padding: '24px',
    textAlign: 'center' as const,
};

const footerText = {
    color: '#64748b',
    fontSize: '12px',
    margin: '0 0 8px 0',
};

const link = {
    color: '#334155',
    fontWeight: 600,
    fontSize: '14px',
    textDecoration: 'none',
};

const copyright = {
    color: '#94a3b8',
    fontSize: '10px',
    marginTop: '24px',
    padding: '0 16px',
    lineHeight: '1.5',
};

export default SolarReportEmail;
