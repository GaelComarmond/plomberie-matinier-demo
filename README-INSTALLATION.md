# Installation — Plomberie Matinier

Ce ZIP contient le projet complet. La méthode la plus simple consiste à utiliser directement le dossier fourni, sans recopier manuellement les fichiers de l'ancien projet.

## Prérequis

- Node.js 20 ou plus récent
- npm
- Un compte GitHub
- Un compte Vercel
- Un compte Resend avec un domaine d'envoi vérifié

## Méthode recommandée : utiliser le projet complet fourni

### 1. Extraire le ZIP

Double-cliquez sur le ZIP ou utilisez :

```bash
unzip plomberie-matinier-demo.zip
```

### 2. Renommer le dossier si nécessaire

Le dossier peut rester nommé :

```text
plomberie-matinier-demo
```

### 3. Ouvrir le projet dans le terminal

```bash
cd plomberie-matinier-demo
```

### 4. Installer les dépendances

```bash
npm install
```

### 5. Créer le fichier d'environnement local

```bash
cp .env.local.example .env.local
```

Sous Windows PowerShell :

```powershell
Copy-Item .env.local.example .env.local
```

### 6. Configurer les variables d'environnement

Ouvrez `.env.local` et remplacez les valeurs d'exemple :

```env
RESEND_API_KEY=re_votre_cle_resend
QUOTE_FROM_EMAIL="Plomberie Matinier <devis@votre-domaine-verifie.fr>"
QUOTE_TO_EMAIL="adresse-reelle-de-lentreprise@example.com"
NEXT_PUBLIC_SITE_URL="http://localhost:3000"
```

Important :

- `RESEND_API_KEY` doit provenir de votre propre compte Resend.
- Le domaine utilisé dans `QUOTE_FROM_EMAIL` doit être vérifié dans Resend.
- `QUOTE_TO_EMAIL` doit être remplacé par l'adresse réelle qui recevra les demandes.
- Ne mettez jamais `.env.local` sur GitHub.

### 7. Lancer le site localement

```bash
npm run dev
```

Ouvrez ensuite :

```text
http://localhost:3000
```

### 8. Tester le formulaire de devis

- Sélectionnez au moins un service.
- Choisissez un délai.
- Complétez le type de propriété.
- Ajoutez l'adresse, le code postal, la date et le moment souhaité.
- Ajoutez les coordonnées du client.
- Acceptez l'autorisation de traitement.
- Envoyez la demande.

### 9. Tester l'ajout de photographies

Le formulaire accepte :

- JPG
- PNG
- WebP
- 5 photographies maximum
- 4 Mo maximum par photographie
- 20 Mo maximum au total

Vérifiez que les fichiers apparaissent dans l'e-mail reçu par l'entreprise.

### 10. Tester l'e-mail de notification de l'entreprise

Envoyez une demande avec une adresse client de test. Vérifiez que `QUOTE_TO_EMAIL` reçoit :

- le nom du client ;
- le téléphone ;
- l'adresse e-mail ;
- les services sélectionnés ;
- le type de propriété ;
- l'adresse d'intervention ;
- la date et le créneau souhaités ;
- la description ;
- les photographies jointes.

### 11. Tester l'e-mail de confirmation du client

Vérifiez que l'adresse indiquée dans le formulaire reçoit l'e-mail :

```text
Plomberie Matinier — votre demande a bien été reçue
```

### 12. Créer un nouveau dépôt GitHub

Sur GitHub, créez un dépôt vide nommé par exemple :

```text
plomberie-matinier-demo
```

Ne demandez pas à GitHub d'ajouter un README ou un `.gitignore`, car ils sont déjà présents.

### 13. Déconnecter un ancien dépôt Git si nécessaire

Le ZIP fourni ne doit normalement pas contenir d'historique Git. Pour vérifier :

```bash
ls -la
```

Si un dossier `.git` existe :

```bash
rm -rf .git
```

Sous Windows PowerShell :

```powershell
Remove-Item -Recurse -Force .git
```

### 14. Initialiser le nouveau dépôt

```bash
git init
git branch -M main
```

### 15. Ajouter et valider les fichiers

```bash
git add .
git commit -m "Initial Plomberie Matinier website"
```

### 16. Envoyer le projet sur GitHub

Remplacez l'URL par celle du dépôt créé :

```bash
git remote add origin https://github.com/VOTRE-COMPTE/plomberie-matinier-demo.git
git push -u origin main
```

### 17. Importer le dépôt dans Vercel

- Connectez-vous à Vercel.
- Cliquez sur **Add New Project**.
- Importez `plomberie-matinier-demo`.
- Laissez Vercel détecter Next.js automatiquement.

### 18. Ajouter les variables d'environnement dans Vercel

Dans **Project Settings → Environment Variables**, ajoutez :

```text
RESEND_API_KEY
QUOTE_FROM_EMAIL
QUOTE_TO_EMAIL
NEXT_PUBLIC_SITE_URL
```

Pour `NEXT_PUBLIC_SITE_URL`, utilisez l'URL finale Vercel ou le domaine personnalisé, par exemple :

```text
https://plomberie-matinier-demo.vercel.app
```

Ajoutez les variables au minimum dans l'environnement **Production**. Vous pouvez aussi les ajouter dans **Preview**.

### 19. Déployer

Cliquez sur **Deploy**. Après le premier déploiement, si l'URL a changé, mettez à jour `NEXT_PUBLIC_SITE_URL` dans Vercel puis redéployez.

### 20. Vérifier le flux de devis en ligne

Sur le site déployé :

1. Envoyez une demande de test.
2. Ajoutez une petite photographie.
3. Vérifiez l'e-mail de l'entreprise.
4. Vérifiez l'e-mail de confirmation du client.
5. Vérifiez les pièces jointes.
6. Vérifiez les boutons d'appel sur mobile.
7. Vérifiez que les informations de Plomberie Matinier apparaissent dans les deux e-mails.

## Vérifications techniques avant déploiement

```bash
npm run typecheck
npm run lint
npm run build
```

Le serveur de production local peut ensuite être testé avec :

```bash
npm run start
```

## Passage du site de démonstration au site officiel

Le projet est volontairement configuré en `noindex` pour éviter que le concept non officiel soit indexé.

Quand le site devient officiel :

1. Retirez la bannière de démonstration dans `app/page.tsx`.
2. Modifiez `app/robots.ts` pour autoriser l'indexation.
3. Dans `app/layout.tsx`, passez `robots.index` et `robots.follow` à `true`.
4. Remplacez `NEXT_PUBLIC_SITE_URL` par le domaine officiel.
5. Redéployez.

## Informations et placeholders à confirmer

Les éléments fournis ne contenaient pas :

- l'adresse e-mail professionnelle certaine de l'entreprise ;
- les horaires complets de chaque jour ;
- une liste précise des communes couvertes ;
- des qualifications, certifications ou années d’expérience vérifiables ;
- le domaine final du site.

Le site utilise donc :

- une variable `QUOTE_TO_EMAIL` à remplacer ;
- la mention transparente « ouverture indiquée à 8h, horaires détaillés à confirmer » ;
- la formulation « basé à Saint-Étienne-de-Chigny » sans inventer de rayon d'intervention ;
- une URL de démonstration à remplacer après le déploiement final.

## Méthode alternative : repartir manuellement du projet de base

Cette méthode est moins simple et n'est pas recommandée, car le ZIP fourni contient déjà le projet final complet.

Pour la réaliser malgré tout :

1. Dupliquez le dossier du projet de base.
2. Supprimez son dossier `.git`, `.next` et `node_modules`.
3. Remplacez ses fichiers `app/`, `public/`, `.env.local.example`, `package.json` et les fichiers de configuration par ceux de ce projet.
4. Vérifiez qu'aucun ancien nom, téléphone, adresse, logo ou service n'est encore présent.
5. Exécutez :

```bash
npm install
npm run typecheck
npm run lint
npm run build
```

6. Configurez ensuite GitHub, Vercel et Resend comme indiqué dans la méthode recommandée.
