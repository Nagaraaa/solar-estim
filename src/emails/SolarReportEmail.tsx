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
    Img,
} from '@react-email/components';

interface SolarReportEmailProps {
    name: string;
    city: string;
    annualProduction: number;
    annualSavings: number;
    totalCostObserved: number;
    selfConsumptionRate?: number;
    adminContactEmail?: string;
    evModel?: string;
    evKwh?: number;
}

export const SolarReportEmail = ({
    name = "Partenaire Solaire",
    city = "Votre Ville",
    annualProduction = 0,
    annualSavings = 0,
    totalCostObserved = 0,
    selfConsumptionRate = 0.35,
    adminContactEmail = "contact@solarestim.com",
    evModel,
    evKwh,
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
                    <Section style={sectionWrapper}>
                        <Heading style={heading}>Bonjour {name},</Heading>
                        <Text style={paragraph}>
                            Bonne nouvelle ! Votre toiture à <span style={{ fontWeight: 'bold', color: '#0f172a' }}>{city}</span> possède un excellent potentiel solaire.
                            Voici votre rapport de rentabilité personnalisé.
                        </Text>
                    </Section>

                    {/* KPI Grid */}
                    <Section style={sectionWrapper}>
                        <Row>
                            <Column style={{ width: '50%', paddingRight: '8px' }}>
                                <div style={kpiBoxAmber}>
                                    <Text style={kpiLabelAmber}>Production</Text>
                                    <Text style={kpiValueAmber}>
                                        {annualProduction.toLocaleString('fr-FR')} <span style={{ fontSize: '14px', fontWeight: 500, opacity: 0.7 }}>kWh/an</span>
                                    </Text>
                                </div>
                            </Column>
                            <Column style={{ width: '50%', paddingLeft: '8px' }}>
                                <div style={kpiBoxEmerald}>
                                    <Text style={kpiLabelEmerald}>Économies (25 ans)</Text>
                                    <Text style={kpiValueEmerald}>
                                        {(annualSavings * 25).toLocaleString('fr-FR')} <span style={{ fontSize: '14px', fontWeight: 500, opacity: 0.7 }}>€</span>
                                    </Text>
                                </div>
                            </Column>
                        </Row>
                    </Section>

                    {/* EV Section (Conditional) */}
                    {evModel && (
                        <Section style={sectionWrapper}>
                            <div style={evCard}>
                                <Heading style={evHeading}>
                                    🚗 Focus Mobilité Électrique
                                </Heading>
                                <Text style={evText}>
                                    Votre simulation inclut la recharge de votre <strong>{evModel}</strong>.
                                </Text>
                                <div style={evStatsContainer}>
                                    <Row>
                                        <Column style={{ width: '50%' }}>
                                            <Text style={evStatLabel}>Consommation VE</Text>
                                            <Text style={evStatValue}>{evKwh?.toLocaleString('fr-FR')} kWh/an</Text>
                                        </Column>
                                        <Column style={{ width: '50%' }}>
                                            <Text style={evStatLabel}>Coût "Carburant" Solaire</Text>
                                            <Text style={evStatValueGreen}>0 € / 100km</Text>
                                        </Column>
                                    </Row>
                                </div>
                                <Text style={evNote}>
                                    Grâce à vos panneaux, vous roulez gratuitement une grande partie de l'année.
                                </Text>
                            </div>
                        </Section>
                    )}

                    {/* Main Stats Table */}
                    <Section style={sectionWrapper}>
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
                                <Column style={{ ...tableColRight, color: '#059669', fontWeight: 'bold' }}>~ {annualSavings.toLocaleString('fr-FR')} € / an</Column>
                            </Row>
                            <Row>
                                <Column style={tableColLeft}>Coût Net Installation (Est.)</Column>
                                <Column style={tableColRight}>{totalCostObserved.toLocaleString('fr-FR')} €</Column>
                            </Row>
                        </div>
                    </Section>

                    {/* Battery Optimization Card (Conditional) */}
                    {isBatteryRecommended && (
                        <Section style={sectionWrapper}>
                            <div style={batteryCard}>
                                <Heading style={batteryHeading}>⚡ Boostez votre indépendance</Heading>
                                <Text style={batteryText}>
                                    Votre taux d'autoconsommation est inférieur à 50%.
                                    L'ajout d'une <strong>batterie domestique</strong> pourrait doubler vos économies.
                                </Text>
                            </div>
                        </Section>
                    )}

                    <Hr style={divider} />

                    {/* Footer */}
                    <Section style={footer}>
                        <Text style={footerText}>
                            Besoin d'aide ? Contactez-nous à <Link href={`mailto:${adminContactEmail}`} style={link}>{adminContactEmail}</Link>
                        </Text>
                        <Text style={copyright}>
                            © 2026 Solar Estim. Tous droits réservés.<br />
                            Données PVGIS (Commission Européenne).
                        </Text>
                    </Section>

                </Container>
            </Body>
        </Html>
    );
};

export default SolarReportEmail;

// --- STYLES (Inline Objects) ---

const main: React.CSSProperties = {
    backgroundColor: '#f8fafc',
    fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
    padding: '40px 0',
};

const container: React.CSSProperties = {
    backgroundColor: '#ffffff',
    border: '1px solid #e2e8f0',
    borderRadius: '12px',
    boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    margin: '0 auto',
    maxWidth: '600px',
    overflow: 'hidden',
};

const header: React.CSSProperties = {
    backgroundColor: '#0f172a',
    padding: '24px',
    textAlign: 'center',
};

const brandText: React.CSSProperties = {
    color: '#f59e0b',
    fontSize: '24px',
    fontWeight: 900,
    letterSpacing: '-0.025em',
    margin: 0,
    textTransform: 'uppercase',
};

const subBrandText: React.CSSProperties = {
    color: '#94a3b8',
    fontSize: '10px',
    letterSpacing: '0.1em',
    marginTop: '4px',
    textTransform: 'uppercase',
    opacity: 0.8,
};

const sectionWrapper: React.CSSProperties = {
    padding: '0 32px 24px 32px',
};

const heading: React.CSSProperties = {
    fontSize: '24px',
    fontWeight: 'bold',
    color: '#0f172a',
    margin: '32px 0 0 0',
    textAlign: 'center',
};

const paragraph: React.CSSProperties = {
    color: '#475569',
    fontSize: '16px',
    lineHeight: '24px',
    margin: '16px 0 0 0',
    textAlign: 'center',
};

// KPI BOXES
const kpiBoxAmber: React.CSSProperties = {
    backgroundColor: '#fffbeb',
    border: '1px solid #fef3c7',
    borderRadius: '8px',
    padding: '16px',
    textAlign: 'center',
    height: '100%',
};

const kpiLabelAmber: React.CSSProperties = {
    color: '#92400e',
    fontSize: '10px',
    fontWeight: 'bold',
    letterSpacing: '0.05em',
    margin: '0 0 4px 0',
    textTransform: 'uppercase',
};

const kpiValueAmber: React.CSSProperties = {
    color: '#d97706',
    fontSize: '24px',
    fontWeight: 900,
    margin: 0,
};

const kpiBoxEmerald: React.CSSProperties = {
    backgroundColor: '#ecfdf5',
    border: '1px solid #d1fae5',
    borderRadius: '8px',
    padding: '16px',
    textAlign: 'center',
    height: '100%',
};

const kpiLabelEmerald: React.CSSProperties = {
    color: '#065f46',
    fontSize: '10px',
    fontWeight: 'bold',
    letterSpacing: '0.05em',
    margin: '0 0 4px 0',
    textTransform: 'uppercase',
};

const kpiValueEmerald: React.CSSProperties = {
    color: '#059669',
    fontSize: '24px',
    fontWeight: 900,
    margin: 0,
};

// EV SECTION STYLES
const evCard: React.CSSProperties = {
    backgroundColor: '#EFF6FF', // blue-50
    border: '1px solid #DBEAFE', // blue-100
    borderRadius: '8px',
    padding: '20px',
    marginTop: '10px',
};

const evHeading: React.CSSProperties = {
    color: '#1E3A8A', // blue-900
    fontSize: '16px',
    fontWeight: 'bold',
    margin: '0 0 8px 0',
};

const evText: React.CSSProperties = {
    color: '#1E40AF', // blue-800
    fontSize: '14px',
    margin: 0,
    lineHeight: '20px',
    marginBottom: '10px',
};

const evStatsContainer: React.CSSProperties = {
    marginTop: '12px',
    paddingTop: '12px',
    borderTop: '1px solid #BFDBFE', // blue-200
};

const evStatLabel: React.CSSProperties = {
    fontSize: '10px',
    color: '#60A5FA', // blue-400
    fontWeight: 'bold',
    textTransform: 'uppercase',
    marginBottom: '4px',
};

const evStatValue: React.CSSProperties = {
    fontSize: '16px',
    color: '#1E40AF',
    fontWeight: 'bold',
    margin: 0,
};

const evStatValueGreen: React.CSSProperties = {
    fontSize: '16px',
    color: '#059669', // emerald-600
    fontWeight: 'bold',
    margin: 0,
};

const evNote: React.CSSProperties = {
    fontSize: '12px',
    color: '#60A5FA',
    marginTop: '12px',
    fontStyle: 'italic',
};

// TABLE STYLES
const tableContainer: React.CSSProperties = {
    border: '1px solid #e2e8f0',
    borderRadius: '8px',
    overflow: 'hidden',
};

const tableRowHeader: React.CSSProperties = {
    backgroundColor: '#f8fafc',
    borderBottom: '1px solid #e2e8f0',
};

const tableHeaderColLeft: React.CSSProperties = {
    padding: '12px 16px',
    textAlign: 'left',
    fontSize: '10px',
    fontWeight: 'bold',
    color: '#64748b',
    textTransform: 'uppercase',
};

const tableHeaderColRight: React.CSSProperties = {
    padding: '12px 16px',
    textAlign: 'right',
    fontSize: '10px',
    fontWeight: 'bold',
    color: '#64748b',
    textTransform: 'uppercase',
};

const tableRow: React.CSSProperties = {
    borderBottom: '1px solid #e2e8f0',
};

const tableColLeft: React.CSSProperties = {
    padding: '12px 16px',
    textAlign: 'left',
    fontSize: '14px',
    color: '#334155',
};

const tableColRight: React.CSSProperties = {
    padding: '12px 16px',
    textAlign: 'right',
    fontSize: '14px',
    fontWeight: 'bold',
    color: '#0f172a',
};

// BATTERY CARD
const batteryCard: React.CSSProperties = {
    backgroundColor: '#eef2ff',
    border: '1px solid #e0e7ff',
    borderRadius: '8px',
    padding: '20px',
};

const batteryHeading: React.CSSProperties = {
    color: '#312e81',
    fontSize: '16px',
    fontWeight: 'bold',
    margin: '0 0 8px 0',
};

const batteryText: React.CSSProperties = {
    color: '#3730a3',
    fontSize: '14px',
    margin: 0,
    lineHeight: '20px',
};

const divider: React.CSSProperties = {
    border: 'none',
    borderTop: '1px solid #e2e8f0',
    margin: '0 32px',
};

// FOOTER
const footer: React.CSSProperties = {
    backgroundColor: '#f8fafc',
    padding: '24px',
    textAlign: 'center',
};

const footerText: React.CSSProperties = {
    color: '#64748b',
    fontSize: '12px',
    margin: '0 0 8px 0',
};

const link: React.CSSProperties = {
    color: '#334155',
    fontWeight: 600,
    fontSize: '14px',
    textDecoration: 'none',
};

const copyright: React.CSSProperties = {
    color: '#94a3b8',
    fontSize: '10px',
    marginTop: '24px',
    padding: '0 16px',
    lineHeight: '1.5',
};
