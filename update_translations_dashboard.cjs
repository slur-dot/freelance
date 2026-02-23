const fs = require('fs');

const extractAndInjectTranslations = () => {
    const enPath = 'public/locales/en/translation.json';
    const frPath = 'public/locales/fr/translation.json';

    const enRaw = fs.readFileSync(enPath, 'utf8');
    const frRaw = fs.readFileSync(frPath, 'utf8');

    const enData = JSON.parse(enRaw);
    const frData = JSON.parse(frRaw);

    const translateMap = {
        // Dashboard main
        "dashboard_total_transactions": { en: "Total Transactions", fr: "Transactions totales" },
        "dashboard_completed_transactions": { en: "Completed Transactions", fr: "Transactions terminées" },
        "dashboard_transactions_label": { en: "Transactions", fr: "Transactions" },
        "dashboard_view_transactions": { en: "View Transactions", fr: "Voir les transactions" },
        "dashboard_profile_completion_title": { en: "Profile Completion", fr: "Profil complété" },
        "dashboard_profile_completion_status": { en: "Profile Completion Status", fr: "Statut de complétion du profil" },
        "dashboard_complete_profile_btn": { en: "Complete Profile", fr: "Compléter le profil" },
        "dashboard_current_queries": { en: "Current Queries", fr: "Requêtes actuelles" },
        "dashboard_more_messages": { en: "more messages", fr: "messages supplémentaires" },
        "dashboard_no_messages": { en: "No messages yet", fr: "Aucun message pour le moment" },
        "dashboard_manage_messages": { en: "MANAGE MESSAGES", fr: "GÉRER LES MESSAGES" },
        "dashboard_analytics_title": { en: "Company Analytics & Management", fr: "Analytiques et gestion de l'entreprise" },
    };

    if (!enData.company_dashboard) enData.company_dashboard = {};
    if (!frData.company_dashboard) frData.company_dashboard = {};

    for (const [key, value] of Object.entries(translateMap)) {
        enData.company_dashboard[key] = value.en;
        frData.company_dashboard[key] = value.fr;
    }

    // add to json
    fs.writeFileSync(enPath, JSON.stringify(enData, null, 4));
    fs.writeFileSync(frPath, JSON.stringify(frData, null, 4));

    console.log("Translations successfully updated.");
}

extractAndInjectTranslations();
