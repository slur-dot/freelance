const fs = require('fs');

const extractAndInjectTranslations = () => {
    const enPath = 'public/locales/en/translation.json';
    const frPath = 'public/locales/fr/translation.json';

    const enRaw = fs.readFileSync(enPath, 'utf8');
    const frRaw = fs.readFileSync(frPath, 'utf8');

    const enData = JSON.parse(enRaw);
    const frData = JSON.parse(frRaw);

    const translateMap = {
        // EmployeeList
        "el_loading": { en: "Loading employees...", fr: "Chargement des employés..." },
        "el_error_loading": { en: "Error loading employees", fr: "Erreur de chargement des employés" },
        "el_retry": { en: "Retry", fr: "Réessayer" },
        "el_title": { en: "Employee List", fr: "Liste des employés" },
        "el_add_btn": { en: "Add New Employee", fr: "Ajouter un employé" },
        "el_search_placeholder": { en: "Search", fr: "Rechercher" },
        "el_col_name": { en: "Employee Name", fr: "Nom de l'employé" },
        "el_col_role": { en: "Role", fr: "Rôle" },
        "el_col_email": { en: "Email", fr: "Email" },
        "el_col_equipment": { en: "Equipment", fr: "Équipement" },
        "el_col_training": { en: "Training", fr: "Formation" },
        "el_col_status": { en: "Status", fr: "Statut" },
        "el_col_actions": { en: "Actions", fr: "Actions" },
        "el_status_active": { en: "Active", fr: "Actif" },
        "el_status_on_leave": { en: "On Leave", fr: "En congé" },
        "el_role_employee": { en: "Employee", fr: "Employé" },
        "el_role_manager": { en: "Manager", fr: "Manager" },
        "el_role_director": { en: "Director", fr: "Directeur" },
        "el_role_intern": { en: "Intern", fr: "Stagiaire" },
        "el_no_equipment": { en: "No equipment assigned", fr: "Aucun équipement assigné" },
        "el_no_training": { en: "No training assigned", fr: "Aucune formation assignée" },
        "el_delete_confirm": { en: "Delete this employee?", fr: "Supprimer cet employé ?" },
        "el_update_error": { en: "Failed to update employee: ", fr: "Échec de la mise à jour de l'employé :" },
        "el_pagination_info": { en: "Page 1 of 1", fr: "Page 1 sur 1" },
        "el_prev": { en: "Previous", fr: "Précédent" },
        "el_next": { en: "Next", fr: "Suivant" },
        "el_modal_title": { en: "Add Employee", fr: "Ajouter un employé" },
        "el_modal_name": { en: "Employee Name *", fr: "Nom de l'employé *" },
        "el_modal_name_ph": { en: "Enter employee name", fr: "Entrer le nom de l'employé" },
        "el_modal_email": { en: "Email", fr: "Email" },
        "el_modal_email_ph": { en: "Enter email address", fr: "Entrer l'adresse email" },
        "el_modal_role": { en: "Role", fr: "Rôle" },
        "el_modal_equipment": { en: "Equipment", fr: "Équipement" },
        "el_modal_equipment_ph": { en: "Enter equipment assigned", fr: "Entrer l'équipement assigné" },
        "el_modal_training": { en: "Training", fr: "Formation" },
        "el_modal_training_ph": { en: "Enter training courses", fr: "Entrer les cours de formation" },
        "el_modal_cancel": { en: "Cancel", fr: "Annuler" },
        "el_modal_create": { en: "Create", fr: "Créer" },

        // TrainingQuotes
        "tq_loading": { en: "Loading training quotes...", fr: "Chargement des devis de formation..." },
        "tq_error_loading": { en: "Error loading training quotes", fr: "Erreur de chargement des devis de formation" },
        "tq_retry": { en: "Retry", fr: "Réessayer" },
        "tq_title": { en: "Custom Training Requests", fr: "Demandes de formation personnalisées" },
        "tq_search_placeholder": { en: "Search", fr: "Rechercher" },
        "tq_col_company": { en: "Company", fr: "Entreprise" },
        "tq_col_request": { en: "Training Request", fr: "Demande de formation" },
        "tq_col_date": { en: "Request Date", fr: "Date de demande" },
        "tq_col_amount": { en: "Amount", fr: "Montant" },
        "tq_col_actions": { en: "Actions", fr: "Actions" },
        "tq_status_pending": { en: "Pending", fr: "En attente" },
        "tq_status_accepted": { en: "Accepted", fr: "Accepté" },
        "tq_status_denied": { en: "Denied", fr: "Refusé" },
        "tq_action_accept": { en: "Accept", fr: "Accepter" },
        "tq_action_deny": { en: "Deny", fr: "Refuser" },
        "tq_no_quotes": { en: "No training quotes found.", fr: "Aucun devis de formation trouvé." },
        "tq_update_error": { en: "Failed to update request status. Please try again.", fr: "Échec de la mise à jour du statut de la demande. Veuillez réessayer." },
        "tq_pagination": { en: "Page 1 of 1", fr: "Page 1 sur 1" },
        "tq_prev": { en: "Previous", fr: "Précédent" },
        "tq_next": { en: "Next", fr: "Suivant" }
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
