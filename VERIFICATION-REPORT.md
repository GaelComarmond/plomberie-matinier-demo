# Rapport de vérification

## Base technique

- Le ZIP du projet de base a été inspecté.
- La structure Next.js, la route `app/api/quote/route.ts`, le formulaire multi-étapes, la validation, le honeypot, la gestion de cinq photographies, les limites de fichiers, le flux Resend et l'e-mail de confirmation ont été conservés et adaptés.

## Vérifications réussies

- `npm run typecheck` : réussi.
- `npm run lint` : réussi.
- Recherche des anciens noms, téléphones, adresses, logos et secrets : aucune référence résiduelle trouvée dans les fichiers livrés.
- Vérification des chemins d'images : tous les fichiers référencés existent.
- Vérification des variables d'environnement : uniquement des valeurs d'exemple, aucun secret réel.
- Le formulaire utilise uniquement les prestations fournies pour Plomberie Matinier.
- Le nom Plomberie Matinier et le téléphone correct figurent dans les e-mails de notification et de confirmation.

## Vérification bloquée par l'environnement

- `npm run build` a été lancé, mais Next.js a tenté de télécharger le binaire Linux SWC `@next/swc-linux-x64-gnu@16.2.11` depuis le registre interne du sandbox.
- Ce registre a répondu HTTP 404.
- L'échec est donc lié au téléchargement du binaire de compilation dans l'environnement, pas à une erreur TypeScript ou ESLint du projet.

## Informations à remplacer ou confirmer

- Adresse e-mail professionnelle destinataire (`QUOTE_TO_EMAIL`).
- Domaine d'envoi vérifié Resend (`QUOTE_FROM_EMAIL`).
- Clé API Resend (`RESEND_API_KEY`).
- Domaine final (`NEXT_PUBLIC_SITE_URL`).
- Horaires complets.
- Communes couvertes.
- Qualifications ou années d'expérience, si elles doivent être affichées.
