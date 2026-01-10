import SuccessView from "./SuccessView";

export const metadata = {
    title: "Demande reçue | Solar Estim",
    description: "Votre demande d'étude solaire a bien été prise en compte.",
    robots: {
        index: false,
        follow: false,
    },
};

export default function MerciPage() {
    return <SuccessView />;
}
