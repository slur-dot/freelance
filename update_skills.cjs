const fs = require('fs');

const skillsFr = [
  'Administration Active Directory',
  'Administration bases de données (MySQL, PostgreSQL, MongoDB)',
  'Administration systèmes Linux',
  'Administration systèmes Windows Server',
  'Analyse de données (Data Analytics)',
  'Analyse de logs et monitoring',
  'Analyse de performance des systèmes',
  'Architecte Cloud',
  'Architecte IA',
  'Architecte systèmes et réseaux',
  'Automatisation IT (scripts Bash, PowerShell, Python)',
  'Business Intelligence (BI)',
  'Bureautique avancée',
  'Cloud computing (AWS, Azure, Google Cloud)',
  'CI/CD (Intégration et déploiement continus)',
  'Configuration de routeurs et firewalls',
  'Configuration réseaux LAN / WAN',
  'Consultant cybersécurité',
  'Consultant DevOps',
  'Consultant en transformation digitale',
  'Consultant IT',
  'Conteneurisation (Docker)',
  'Cybersécurité opérationnelle',
  'Data Analyst',
  'Data Engineer',
  'Data Scientist',
  'Déploiement d\'applications cloud',
  'Déploiement de solutions IA',
  'Développement backend (Python, PHP, Java)',
  'Développement frontend (HTML, CSS, JavaScript)',
  'Développement full-stack',
  'Développement mobile (Android, iOS, Flutter)',
  'Développement API REST',
  'Développement de modèles IA',
  'Développement microservices',
  'Développeur IA',
  'DevOps',
  'Digitalisation des processus métiers',
  'Edge computing',
  'Infrastructure e-gouvernement',
  'Gestion de parc informatique',
  'Gestion de sauvegardes et archivage',
  'Gestion de serveurs virtualisés',
  'Gestion de projets IT',
  'Gouvernance des systèmes d\'information',
  'Hébergement web',
  'Haute disponibilité (High Availability)',
  'Ingénieur Machine Learning',
  'Ingénieur réseaux',
  'Ingénieur systèmes',
  'Intégration d\'outils IA (ChatGPT, Copilot, etc.)',
  'Intégration de solutions SaaS',
  'Infrastructure Cloud',
  'Infrastructure IT',
  'Maintenance informatique',
  'Maintenance serveurs',
  'Monitoring systèmes et réseaux',
  'MLOps',
  'Optimisation des performances IT',
  'Orchestration de conteneurs (Kubernetes)',
  'Pentesting (tests d\'intrusion)',
  'Protection des données',
  'Plan de continuité d\'activité (PCA / PRA)',
  'Sécurité applicative',
  'Sécurité cloud',
  'Sécurité des réseaux',
  'Sécurité des systèmes d\'information',
  'SOC Analyst (Security Operations Center)',
  'Support IT niveau 1',
  'Support IT niveau 2',
  'Support IT niveau 3',
  'Supervision des infrastructures IT',
  'Test et validation logicielle',
  'Test et évaluation de solutions IA',
  'Traitement du Big Data',
  'Virtualisation (VMware, Hyper-V)',
  'Veille technologique IT'
];

const skillsEn = [
  'Active Directory Administration',
  'Database Administration (MySQL, PostgreSQL, MongoDB)',
  'Linux Systems Administration',
  'Windows Server Administration',
  'Data Analytics',
  'Logs Analysis and Monitoring',
  'Systems Performance Analysis',
  'Cloud Architect',
  'AI Architect',
  'Systems and Network Architect',
  'IT Automation (Bash, PowerShell, Python scripts)',
  'Business Intelligence (BI)',
  'Advanced Office Automation',
  'Cloud Computing (AWS, Azure, Google Cloud)',
  'CI/CD (Continuous Integration and Deployment)',
  'Router and Firewall Configuration',
  'LAN / WAN Network Configuration',
  'Cybersecurity Consultant',
  'DevOps Consultant',
  'Digital Transformation Consultant',
  'IT Consultant',
  'Containerization (Docker)',
  'Operational Cybersecurity',
  'Data Analyst',
  'Data Engineer',
  'Data Scientist',
  'Cloud Applications Deployment',
  'AI Solutions Deployment',
  'Backend Development (Python, PHP, Java)',
  'Frontend Development (HTML, CSS, JavaScript)',
  'Full-stack Development',
  'Mobile Development (Android, iOS, Flutter)',
  'REST API Development',
  'AI Models Development',
  'Microservices Development',
  'AI Developer',
  'DevOps',
  'Business Process Digitalization',
  'Edge Computing',
  'E-government Infrastructure',
  'IT Fleet Management',
  'Backup and Archiving Management',
  'Virtualized Servers Management',
  'IT Project Management',
  'Information Systems Governance',
  'Web Hosting',
  'High Availability',
  'Machine Learning Engineer',
  'Network Engineer',
  'Systems Engineer',
  'AI Tools Integration (ChatGPT, Copilot, etc.)',
  'SaaS Solutions Integration',
  'Cloud Infrastructure',
  'IT Infrastructure',
  'IT Maintenance',
  'Server Maintenance',
  'Systems and Network Monitoring',
  'MLOps',
  'IT Performance Optimization',
  'Container Orchestration (Kubernetes)',
  'Pentesting',
  'Data Protection',
  'Business Continuity Plan (BCP / DRP)',
  'Application Security',
  'Cloud Security',
  'Network Security',
  'Information Systems Security',
  'SOC Analyst (Security Operations Center)',
  'Level 1 IT Support',
  'Level 2 IT Support',
  'Level 3 IT Support',
  'IT Infrastructure Supervision',
  'Software Testing and Validation',
  'AI Solutions Testing and Evaluation',
  'Big Data Processing',
  'Virtualization (VMware, Hyper-V)',
  'IT Technology Watch'
];

const getSlug = (str) => {
    return str.toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_|_$/g, '');
};

const enPath = './public/locales/en/translation.json';
const frPath = './public/locales/fr/translation.json';

const enFile = JSON.parse(fs.readFileSync(enPath, 'utf8'));
const frFile = JSON.parse(fs.readFileSync(frPath, 'utf8'));

if (!enFile.skills) enFile.skills = {};
if (!frFile.skills) frFile.skills = {};

skillsFr.forEach((frStr, i) => {
    const enStr = skillsEn[i];
    const key = getSlug(enStr);
    frFile.skills[key] = frStr;
    enFile.skills[key] = enStr;
});

// Create an export file to get the keys and translations to use in our component
const exportData = skillsFr.map((frStr, i) => {
    return { key: getSlug(skillsEn[i]), fr: frStr, en: skillsEn[i] };
});

fs.writeFileSync('./src/utils/skillsData.js', `export const SKILLS_LIST = ${JSON.stringify(exportData, null, 2)};\n`);

fs.writeFileSync(enPath, JSON.stringify(enFile, null, 4));
fs.writeFileSync(frPath, JSON.stringify(frFile, null, 4));

console.log('Done!');
