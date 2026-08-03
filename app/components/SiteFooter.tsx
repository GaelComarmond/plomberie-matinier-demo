import Image from "next/image";

const PHONE_DISPLAY = "06 46 21 24 57";
const PHONE_LINK = "+33646212457";

export default function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="page-shell footer-top">
        <div className="footer-brand">
          <Image
            src="/plomberie-matinier/icon.png"
            alt="Logo Plomberie Matinier"
            width={1005}
            height={260}
            sizes="(max-width: 650px) 300px, (max-width: 900px) 285px, (max-width: 1120px) 320px, 360px"
          />
        </div>

        <div className="footer-column">
          <span>Coordonnées</span>
          <a className="footer-phone" href={`tel:${PHONE_LINK}`}>
            {PHONE_DISPLAY}
          </a>
          <p>
            11 Allée Barbara<br />
            37230 Saint-Étienne-de-Chigny
          </p>
        </div>

        <div className="footer-column">
          <span>Informations</span>
          <p>
            Ouverture indiquée à 8h sur Google.<br />
            Horaires détaillés à confirmer.
          </p>
        </div>

        <div className="footer-column footer-links">
          <span>Navigation</span>
          <a href="#services">Services</a>
          <a href="#realisations">Réalisations</a>
          <a href="#avis">Avis clients</a>
          <a href="#devis">Demande de devis</a>
        </div>
      </div>

      <div className="page-shell footer-bottom">
        <span>Concept de site non officiel créé à titre de démonstration.</span>
        <span>© {new Date().getFullYear()} Plomberie Matinier</span>
      </div>
    </footer>
  );
}
