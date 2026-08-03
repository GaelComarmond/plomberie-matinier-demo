"use client";

import Image from "next/image";
import {
  ChangeEvent,
  FormEvent,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import SiteFooter from "./components/SiteFooter";
import SiteHeader from "./components/SiteHeader";

const PHONE_DISPLAY = "06 46 21 24 57";
const PHONE_LINK = "+33646212457";

const serviceGroups = [
  {
    index: "01",
    title: "Fuites et tuyauterie",
    description:
      "Diagnostic du problème et intervention sur les éléments de plomberie concernés.",
    items: ["Détection de fuite", "Réparation de tuyauterie"],
  },
  {
    index: "02",
    title: "WC",
    description:
      "Pose ou remise en état des toilettes selon la configuration existante.",
    items: ["Installation de WC", "Réparation de WC"],
  },
  {
    index: "03",
    title: "Douche et baignoire",
    description:
      "Installation des équipements qui structurent l’espace douche ou baignoire.",
    items: [
      "Installation de douche",
      "Installation de baignoire",
      "Installation de cabine de douche",
      "Installation de colonne de douche",
      "Installation de pare-baignoire",
      "Pose de paroi ou de porte de douche",
    ],
  },
  {
    index: "04",
    title: "Robinetterie",
    description:
      "Pose et réparation des robinets pour la salle de bain ou la cuisine.",
    items: [
      "Installation de robinet",
      "Réparation de robinet",
      "Installation de robinetterie salle de bain ou cuisine",
    ],
  },
  {
    index: "05",
    title: "Salle de bain",
    description:
      "Installation soignée des éléments visibles et fonctionnels de la pièce.",
    items: ["Installation de meuble de salle de bain"],
  },
  {
    index: "06",
    title: "Chauffe-eau",
    description:
      "Installation d’un chauffe-eau et raccordement à l’installation existante.",
    items: ["Installation de chauffe-eau"],
  },
];

const quoteServices = [
  "Détection de fuite",
  "Réparation de tuyauterie",
  "Installation de WC",
  "Réparation de WC",
  "Installation de chauffe-eau",
  "Installation de douche",
  "Installation de baignoire",
  "Installation de cabine de douche",
  "Installation de colonne de douche",
  "Installation de meuble de salle de bain",
  "Installation de pare-baignoire",
  "Installation de robinet",
  "Réparation de robinet",
  "Installation de robinetterie salle de bain ou cuisine",
  "Pose de paroi ou de porte de douche",
];

const urgencyOptions = [
  "Dès que possible",
  "Dans les 24 à 48 heures",
  "Dans la semaine",
  "Date flexible",
];

const propertyTypes = [
  "Appartement",
  "Maison",
  "Local professionnel",
  "Copropriété",
  "Autre",
];

const preferredTimes = [
  "Matin",
  "Après-midi",
  "Fin de journée",
  "Peu importe",
];

const reviews = [
  {
    name: "J. Duchesne",
    text: "Les avis 5 étoiles sont mérités. M. Matinier est rapidement intervenu pour un souci qui dure depuis des mois, et pour lequel les responsables n’ont jamais voulu s’occuper. Enfin réparé ! Cet artisan est aimable, réactif et compétent, c’est assez rare pour être souligné. Un grand merci.",
    context: "Intervention sur un problème ancien",
  },
  {
    name: "Thierry Montaubin",
    text: "Nous sommes très satisfaits du travail réalisé dans notre salle d’eau. Grégory est très minutieux et compétent car c’était un chantier compliqué, avec une petite surface. Le résultat final nous satisfait pleinement. Nous le recommandons autant pour ses compétences, ses conseils, son professionnalisme que sa gentillesse.",
    context: "Travaux dans une petite salle d’eau",
  },
  {
    name: "Sandrine",
    text: "Je recommande vivement Monsieur Matinier ! Il est intervenu pour installer ma douche et tout s’est parfaitement déroulé. Le travail est propre, soigné et réalisé avec professionnalisme. Il a également été ponctuel, à l’écoute et de bon conseil. Je suis très satisfaite du résultat.",
    context: "Installation d’une douche",
  },
  {
    name: "Julie MORAY",
    text: "Un contact donné par un ami que je recommanderais à mon tour si on me demandait si je connais un bon plombier. M. Matinier est réactif, professionnel et très sympathique. C’est top d’avoir des artisans comme lui dans notre commune ! D’ailleurs on va le solliciter de nouveau.",
    context: "Recommandation locale",
  },
  {
    name: "Julien Tanchoux",
    text: "Réparation d’une fuite d’eau sur le réseau principal. Déplacement rapide le jour de mon appel et réparation effectuée le lendemain ! Gentil et professionnel. Vous cherchez un plombier, n’hésitez pas ! Maintenant j’ai un plombier à recommander.",
    context: "Réparation d’une fuite d’eau",
  },
];

type QuoteData = {
  services: string[];
  urgency: string;
  propertyType: string;
  details: string;
  address: string;
  postcode: string;
  preferredDate: string;
  preferredTime: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  consent: boolean;
  companyWebsite: string;
};

const initialQuoteData: QuoteData = {
  services: [],
  urgency: "",
  propertyType: "",
  details: "",
  address: "",
  postcode: "",
  preferredDate: "",
  preferredTime: "",
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  consent: false,
  companyWebsite: "",
};

function PhoneIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M7.7 3.5 10.4 8 8.2 9.8a14.9 14.9 0 0 0 6 6l1.8-2.2 4.5 2.7c.5.3.7.9.5 1.5l-.9 2.5c-.2.7-.9 1.1-1.6 1C10.1 20.5 3.5 13.9 2.7 5.5c-.1-.7.3-1.4 1-1.6l2.5-.9c.6-.2 1.2 0 1.5.5Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ArrowIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M5 12h13M13 6l6 6-6 6"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="m5 12.5 4.2 4.2L19 7"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function CameraIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M4 7.5h4l1.4-2h5.2l1.4 2h4a2 2 0 0 1 2 2v8.5a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V9.5a2 2 0 0 1 2-2Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinejoin="round"
      />
      <circle
        cx="12"
        cy="13.5"
        r="3.4"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.7"
      />
    </svg>
  );
}

function PinIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M12 21s6-5.2 6-11a6 6 0 1 0-12 0c0 5.8 6 11 6 11Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
      />
      <circle cx="12" cy="10" r="2.1" fill="none" stroke="currentColor" strokeWidth="1.8" />
    </svg>
  );
}

function ReviewCarousel() {
  const [activeReview, setActiveReview] = useState(() =>
    Math.floor(Math.random() * reviews.length),
  );

  useEffect(() => {
    const timer = window.setInterval(() => {
      setActiveReview((current) => {
        if (reviews.length <= 1) return current;

        let nextReview = current;
        while (nextReview === current) {
          nextReview = Math.floor(Math.random() * reviews.length);
        }

        return nextReview;
      });
    }, 8500);

    return () => window.clearInterval(timer);
  }, []);

  const review = reviews[activeReview];

  return (
    <div className="review-carousel">
      <article className="review-card" key={review.name}>
        <div className="review-card-meta">
          <span className="review-stars" aria-label="5 étoiles">★★★★★</span>
          <span>Avis Google</span>
        </div>
        <blockquote>“{review.text}”</blockquote>
        <div className="review-card-footer">
          <div>
            <strong>{review.name}</strong>
            <span>{review.context}</span>
          </div>
        </div>
      </article>
    </div>
  );
}

function QuoteWorkflow() {
  const [step, setStep] = useState(0);
  const [quoteData, setQuoteData] = useState<QuoteData>(initialQuoteData);
  const [photos, setPhotos] = useState<File[]>([]);
  const [formError, setFormError] = useState("");
  const [submissionStatus, setSubmissionStatus] = useState<
    "idle" | "sending" | "success" | "error"
  >("idle");
  const [confirmationSent, setConfirmationSent] = useState(true);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const stepTitles = [
    "Votre besoin",
    "Le contexte",
    "Le lieu et la date",
    "Vos coordonnées",
  ];

  const selectedPhotoSize = useMemo(
    () => photos.reduce((total, photo) => total + photo.size, 0),
    [photos],
  );

  const today = useMemo(() => new Date().toISOString().slice(0, 10), []);

  function updateField<K extends keyof QuoteData>(key: K, value: QuoteData[K]) {
    setQuoteData((current) => ({ ...current, [key]: value }));
    setFormError("");
  }

  function toggleService(service: string) {
    setQuoteData((current) => {
      const selected = current.services.includes(service);
      return {
        ...current,
        services: selected
          ? current.services.filter((item) => item !== service)
          : [...current.services, service],
      };
    });
    setFormError("");
  }

  function validateCurrentStep() {
    if (step === 0) {
      if (quoteData.services.length === 0) return "Sélectionnez au moins un service.";
      if (!quoteData.urgency) return "Indiquez le délai souhaité.";
    }

    if (step === 1 && !quoteData.propertyType) {
      return "Sélectionnez le type de propriété.";
    }

    if (step === 2) {
      if (!quoteData.address.trim()) return "Indiquez l’adresse de l’intervention.";
      if (!quoteData.postcode.trim()) return "Indiquez le code postal.";
      if (!quoteData.preferredDate) return "Choisissez une date souhaitée.";
      if (!quoteData.preferredTime) return "Sélectionnez un moment de la journée.";
    }

    return "";
  }

  function goToNextStep() {
    const error = validateCurrentStep();
    if (error) {
      setFormError(error);
      return;
    }
    setStep((current) => Math.min(current + 1, stepTitles.length - 1));
    setFormError("");
  }

  function handlePhotoSelection(event: ChangeEvent<HTMLInputElement>) {
    const incomingFiles = Array.from(event.target.files ?? []);
    if (incomingFiles.length === 0) return;

    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
    const validFiles: File[] = [];

    for (const file of incomingFiles) {
      if (!allowedTypes.includes(file.type)) {
        setFormError("Les photographies doivent être au format JPG, PNG ou WebP.");
        continue;
      }
      if (file.size > 4 * 1024 * 1024) {
        setFormError(`${file.name} dépasse la limite de 4 Mo par image.`);
        continue;
      }
      validFiles.push(file);
    }

    setPhotos((current) => [...current, ...validFiles].slice(0, 5));
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  function removePhoto(index: number) {
    setPhotos((current) => current.filter((_, photoIndex) => photoIndex !== index));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (
      !quoteData.firstName.trim() ||
      !quoteData.lastName.trim() ||
      !quoteData.email.trim() ||
      !quoteData.phone.trim()
    ) {
      setFormError("Indiquez votre nom, votre adresse e-mail et votre téléphone.");
      return;
    }

    if (!quoteData.consent) {
      setFormError(
        "Vous devez autoriser l’utilisation de ces informations pour traiter votre demande.",
      );
      return;
    }

    setSubmissionStatus("sending");
    setFormError("");

    const formData = new FormData();
    quoteData.services.forEach((service) => formData.append("services", service));
    formData.append("urgency", quoteData.urgency);
    formData.append("propertyType", quoteData.propertyType);
    formData.append("details", quoteData.details);
    formData.append("address", quoteData.address);
    formData.append("postcode", quoteData.postcode);
    formData.append("preferredDate", quoteData.preferredDate);
    formData.append("preferredTime", quoteData.preferredTime);
    formData.append("firstName", quoteData.firstName);
    formData.append("lastName", quoteData.lastName);
    formData.append("email", quoteData.email);
    formData.append("phone", quoteData.phone);
    formData.append("companyWebsite", quoteData.companyWebsite);
    photos.forEach((photo) => formData.append("photos", photo));

    try {
      const response = await fetch("/api/quote", { method: "POST", body: formData });
      const result = (await response.json()) as {
        ok?: boolean;
        message?: string;
        confirmationSent?: boolean;
      };

      if (!response.ok || !result.ok) {
        throw new Error(result.message || "La demande n’a pas pu être envoyée.");
      }

      setConfirmationSent(result.confirmationSent !== false);
      setSubmissionStatus("success");
    } catch (error) {
      setSubmissionStatus("error");
      setFormError(
        error instanceof Error
          ? error.message
          : "Une erreur est survenue pendant l’envoi.",
      );
    }
  }

  if (submissionStatus === "success") {
    return (
      <div className="quote-success">
        <span className="quote-success-icon"><CheckIcon /></span>
        <p className="eyebrow">Demande reçue</p>
        <h2>Votre demande a bien été transmise.</h2>
        <p>
          Les informations et photographies envoyées permettent maintenant
          d’examiner votre besoin avant de vous recontacter.
        </p>
        {!confirmationSent ? (
          <p className="confirmation-warning">
            La demande a bien été reçue, mais l’e-mail de confirmation n’a pas pu être délivré.
          </p>
        ) : null}
        <a className="button button-copper" href={`tel:${PHONE_LINK}`}>
          <PhoneIcon /> Appeler directement
        </a>
      </div>
    );
  }

  return (
    <form className="quote-workflow" onSubmit={handleSubmit}>
      <aside className="quote-sidebar">
        <p className="eyebrow eyebrow-light">Demande de devis</p>
        <h2>Un formulaire utile, pas une demande dans le vide.</h2>
        <p>
          Décrivez le besoin, le lieu et le créneau souhaité. Les photos peuvent
          éviter un premier échange trop vague.
        </p>

        <div className="quote-progress-list">
          {stepTitles.map((title, index) => (
            <button
              type="button"
              className={[
                "quote-progress-item",
                index === step ? "quote-progress-active" : "",
                index < step ? "quote-progress-complete" : "",
              ].filter(Boolean).join(" ")}
              onClick={() => {
                if (index <= step) {
                  setStep(index);
                  setFormError("");
                }
              }}
              key={title}
            >
              <span>{index < step ? <CheckIcon /> : String(index + 1).padStart(2, "0")}</span>
              <strong>{title}</strong>
            </button>
          ))}
        </div>

        <div className="quote-callout">
          <span>Vous préférez expliquer le problème de vive voix ?</span>
          <a href={`tel:${PHONE_LINK}`}><PhoneIcon /> {PHONE_DISPLAY}</a>
        </div>
      </aside>

      <div className="quote-form-panel">
        <div className="quote-mobile-progress">
          <span>Étape {step + 1} sur {stepTitles.length}</span>
          <strong>{stepTitles[step]}</strong>
          <div><span style={{ width: `${((step + 1) / stepTitles.length) * 100}%` }} /></div>
        </div>

        {step === 0 ? (
          <div className="quote-step">
            <div className="quote-step-heading">
              <span>01</span>
              <div>
                <h3>De quoi avez-vous besoin ?</h3>
                <p>Vous pouvez sélectionner plusieurs prestations.</p>
              </div>
            </div>

            <fieldset className="field-group">
              <legend>Service concerné</legend>
              <div className="service-choice-grid">
                {quoteServices.map((service) => {
                  const selected = quoteData.services.includes(service);
                  return (
                    <button
                      type="button"
                      className={`service-choice ${selected ? "service-choice-selected" : ""}`}
                      onClick={() => toggleService(service)}
                      key={service}
                    >
                      <span>{selected ? <CheckIcon /> : "+"}</span>
                      {service}
                    </button>
                  );
                })}
              </div>
            </fieldset>

            <fieldset className="field-group">
              <legend>Délai souhaité</legend>
              <div className="choice-grid choice-grid-two">
                {urgencyOptions.map((urgency) => (
                  <button
                    type="button"
                    className={`choice-button ${quoteData.urgency === urgency ? "choice-button-selected" : ""}`}
                    onClick={() => updateField("urgency", urgency)}
                    key={urgency}
                  >
                    <span>{quoteData.urgency === urgency ? <CheckIcon /> : ""}</span>
                    {urgency}
                  </button>
                ))}
              </div>
            </fieldset>
          </div>
        ) : null}

        {step === 1 ? (
          <div className="quote-step">
            <div className="quote-step-heading">
              <span>02</span>
              <div>
                <h3>Dans quel contexte faut-il intervenir ?</h3>
                <p>Quelques précisions facilitent la préparation de l’échange.</p>
              </div>
            </div>

            <fieldset className="field-group">
              <legend>Type de propriété</legend>
              <div className="choice-grid choice-grid-two">
                {propertyTypes.map((property) => (
                  <button
                    type="button"
                    className={`choice-button ${quoteData.propertyType === property ? "choice-button-selected" : ""}`}
                    onClick={() => updateField("propertyType", property)}
                    key={property}
                  >
                    <span>{quoteData.propertyType === property ? <CheckIcon /> : ""}</span>
                    {property}
                  </button>
                ))}
              </div>
            </fieldset>

            <label className="text-area-field">
              <span>Description du problème ou du projet</span>
              <textarea
                value={quoteData.details}
                onChange={(event) => updateField("details", event.target.value)}
                rows={7}
                placeholder="Décrivez la situation, l’équipement concerné et les informations qui pourraient être utiles."
              />
            </label>
          </div>
        ) : null}

        {step === 2 ? (
          <div className="quote-step">
            <div className="quote-step-heading">
              <span>03</span>
              <div>
                <h3>Où et quand faut-il intervenir ?</h3>
                <p>Le rendez-vous reste à confirmer après réception de la demande.</p>
              </div>
            </div>

            <div className="input-grid">
              <label className="input-field input-field-wide">
                <span>Adresse de l’intervention</span>
                <input
                  type="text"
                  value={quoteData.address}
                  onChange={(event) => updateField("address", event.target.value)}
                  placeholder="Numéro et nom de rue"
                  autoComplete="street-address"
                />
              </label>
              <label className="input-field">
                <span>Code postal</span>
                <input
                  type="text"
                  value={quoteData.postcode}
                  onChange={(event) => updateField("postcode", event.target.value)}
                  placeholder="37230"
                  inputMode="numeric"
                  autoComplete="postal-code"
                />
              </label>
              <label className="input-field">
                <span>Date souhaitée</span>
                <input
                  type="date"
                  min={today}
                  value={quoteData.preferredDate}
                  onChange={(event) => updateField("preferredDate", event.target.value)}
                />
              </label>
            </div>

            <fieldset className="field-group">
              <legend>Moment de la journée</legend>
              <div className="choice-grid choice-grid-two">
                {preferredTimes.map((time) => (
                  <button
                    type="button"
                    className={`choice-button ${quoteData.preferredTime === time ? "choice-button-selected" : ""}`}
                    onClick={() => updateField("preferredTime", time)}
                    key={time}
                  >
                    <span>{quoteData.preferredTime === time ? <CheckIcon /> : ""}</span>
                    {time}
                  </button>
                ))}
              </div>
            </fieldset>
          </div>
        ) : null}

        {step === 3 ? (
          <div className="quote-step">
            <div className="quote-step-heading">
              <span>04</span>
              <div>
                <h3>Comment peut-on vous recontacter ?</h3>
                <p>Une confirmation automatique est envoyée après la demande.</p>
              </div>
            </div>

            <div className="input-grid">
              <label className="input-field">
                <span>Prénom</span>
                <input
                  type="text"
                  value={quoteData.firstName}
                  onChange={(event) => updateField("firstName", event.target.value)}
                  autoComplete="given-name"
                />
              </label>
              <label className="input-field">
                <span>Nom</span>
                <input
                  type="text"
                  value={quoteData.lastName}
                  onChange={(event) => updateField("lastName", event.target.value)}
                  autoComplete="family-name"
                />
              </label>
              <label className="input-field">
                <span>Adresse e-mail</span>
                <input
                  type="email"
                  value={quoteData.email}
                  onChange={(event) => updateField("email", event.target.value)}
                  autoComplete="email"
                />
              </label>
              <label className="input-field">
                <span>Téléphone</span>
                <input
                  type="tel"
                  value={quoteData.phone}
                  onChange={(event) => updateField("phone", event.target.value)}
                  autoComplete="tel"
                />
              </label>
            </div>

            <div className="photo-upload">
              <div className="photo-upload-copy">
                <span className="photo-upload-icon"><CameraIcon /></span>
                <div>
                  <strong>Ajouter des photographies</strong>
                  <p>Jusqu’à 5 images JPG, PNG ou WebP, avec une limite de 4 Mo par image.</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={photos.length >= 5}
              >
                Choisir des photos
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                multiple
                onChange={handlePhotoSelection}
                hidden
              />
            </div>

            {photos.length > 0 ? (
              <div className="selected-files">
                <div className="selected-files-heading">
                  <strong>{photos.length} photographie{photos.length > 1 ? "s" : ""} sélectionnée{photos.length > 1 ? "s" : ""}</strong>
                  <span>{(selectedPhotoSize / (1024 * 1024)).toFixed(1)} Mo</span>
                </div>
                {photos.map((photo, index) => (
                  <div className="selected-file" key={`${photo.name}-${index}`}>
                    <span>{photo.name}</span>
                    <button type="button" onClick={() => removePhoto(index)} aria-label={`Retirer ${photo.name}`}>
                      Retirer
                    </button>
                  </div>
                ))}
              </div>
            ) : null}

            <label className="honeypot-field" aria-hidden="true">
              Site internet de l’entreprise
              <input
                type="text"
                value={quoteData.companyWebsite}
                onChange={(event) => updateField("companyWebsite", event.target.value)}
                tabIndex={-1}
                autoComplete="off"
              />
            </label>

            <label className="consent-field">
              <input
                type="checkbox"
                checked={quoteData.consent}
                onChange={(event) => updateField("consent", event.target.checked)}
              />
              <span>
                J’autorise Plomberie Matinier à utiliser ces informations uniquement pour traiter cette demande et me recontacter.
              </span>
            </label>
          </div>
        ) : null}

        {formError ? <p className="quote-error" role="alert">{formError}</p> : null}

        <div className="quote-navigation">
          {step > 0 ? (
            <button
              type="button"
              className="quote-back"
              onClick={() => {
                setStep((current) => Math.max(current - 1, 0));
                setFormError("");
              }}
            >
              ← Étape précédente
            </button>
          ) : <span />}

          {step < stepTitles.length - 1 ? (
            <button type="button" className="button button-copper" onClick={goToNextStep}>
              Continuer <ArrowIcon />
            </button>
          ) : (
            <button type="submit" className="button button-copper" disabled={submissionStatus === "sending"}>
              {submissionStatus === "sending" ? "Envoi en cours…" : "Envoyer ma demande"}
              <ArrowIcon />
            </button>
          )}
        </div>
      </div>
    </form>
  );
}

export default function Home() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Plumber",
    name: "Plomberie Matinier",
    telephone: PHONE_LINK,
    image: "/plomberie-matinier/icon.png",
    address: {
      "@type": "PostalAddress",
      streetAddress: "11 Allée Barbara",
      postalCode: "37230",
      addressLocality: "Saint-Étienne-de-Chigny",
      addressCountry: "FR",
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "5.0",
      reviewCount: "123",
      bestRating: "5",
    },
  };

  return (
    <main className="matinier-site">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      <div className="demo-banner">
        Concept de site non officiel créé à titre de démonstration pour Plomberie Matinier.
      </div>

      <SiteHeader />

      <section className="hero" id="accueil">
        <div className="hero-pipe hero-pipe-one" aria-hidden="true" />
        <div className="hero-pipe hero-pipe-two" aria-hidden="true" />
        <div className="page-shell hero-grid">
          <div className="hero-copy">
            <p className="eyebrow eyebrow-light">Plombier à Saint-Étienne-de-Chigny</p>
            <h1>Un travail efficace.<br /><span>Une réponse claire.</span></h1>
            <p className="hero-intro">
              Dépannage, WC, douche, baignoire, robinetterie et installation de salle de bain,
              avec le sérieux que les clients décrivent dans leurs avis.
            </p>
            <div className="hero-actions">
              <a className="button button-copper" href="#devis">
                Demander un devis <ArrowIcon />
              </a>
              <a className="button button-ghost" href={`tel:${PHONE_LINK}`}>
                <PhoneIcon /> {PHONE_DISPLAY}
              </a>
            </div>
            <div className="hero-trust-row">
              <div>
                <strong>5,0 <span>★★★★★</span></strong>
                <small>123 avis Google</small>
              </div>
              <div>
                <strong>5,0 <span>★★★★★</span></strong>
                <small>102 avis sur Infobel</small>
              </div>
            </div>
          </div>

          <div className="hero-visual" aria-label="Plomberie Matinier">
            <div className="hero-portrait-card">
              <Image
                src="/plomberie-matinier/gregory-matinier-portrait.png"
                alt="Plombier de Plomberie Matinier devant son véhicule"
                width={1100}
                height={1300}
                priority
              />
              <div className="hero-portrait-label">
                <span>Plomberie Matinier</span>
                <strong>Professionnalisme · Réactivité · Soin</strong>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="signal-strip" aria-label="Qualités relevées dans les avis clients">
        <div className="page-shell signal-grid">
          <span>Réactif</span>
          <span>Minutieux</span>
          <span>Ponctuel</span>
          <span>Professionnel</span>
          <span>De bon conseil</span>
        </div>
      </section>

      <section className="services-section" id="services">
        <div className="page-shell">
          <div className="section-heading">
            <p className="eyebrow">Prestations</p>
            <h2>La plomberie utile, pièce par pièce.</h2>
          </div>

          <div className="services-grid">
            {serviceGroups.map((service) => (
              <article className="service-card" key={service.title}>
                <div className="service-card-top">
                  <span>{service.index}</span>
                  <h3>{service.title}</h3>
                </div>
                <p>{service.description}</p>
                <ul>
                  {service.items.map((item) => <li key={item}>{item}</li>)}
                </ul>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="work-section" id="realisations">
        <div className="page-shell work-grid">
          <div className="work-copy">
            <p className="eyebrow eyebrow-light">Réalisations visibles</p>
            <h2>Des installations soignées, pensées pour durer.</h2>
            <p>
              Les photographies fournies montrent notamment une salle de bain avec double vasque,
              une installation de douche avec paroi vitrée et un WC installé dans un espace compact.
            </p>
            <a className="text-link" href="#devis">Présenter mon projet <ArrowIcon /></a>
          </div>

          <div className="work-mosaic">
            <figure className="work-main">
              <Image
                src="/plomberie-matinier/meuble-salle-de-bain.webp"
                alt="Meuble double vasque et miroir lumineux installé dans une salle de bain"
                width={1170}
                height={1470}
              />
              <figcaption>Meuble de salle de bain et double vasque</figcaption>
            </figure>
            <figure className="work-secondary">
              <Image
                src="/plomberie-matinier/installation-douche-paroi.webp"
                alt="Installation d’une douche avec paroi coulissante"
                width={1001}
                height={677}
              />
              <figcaption>Douche et paroi vitrée</figcaption>
            </figure>
            <figure className="work-small">
              <Image
                src="/plomberie-matinier/wc-installe.webp"
                alt="WC installé dans une petite pièce"
                width={502}
                height={622}
              />
              <figcaption>Installation de WC</figcaption>
            </figure>
          </div>
        </div>
      </section>

      <section className="about-section">
        <div className="page-shell about-grid">
          <div className="about-photo">
            <Image
              src="/plomberie-matinier/gregory-matinier-portrait.png"
              alt="Plombier de Plomberie Matinier"
              width={1100}
              height={1300}
            />
            <div className="about-badge">
              <Image
                src="/plomberie-matinier/icon.png"
                alt="Logo Plomberie Matinier"
                width={1200}
                height={1200}
              />
              <span>Basé à<br /><strong>Saint-Étienne-de-Chigny</strong></span>
            </div>
          </div>

          <div className="about-copy">
            <p className="eyebrow">Ce que les avis répètent</p>
            <h2>La compétence compte. La façon de travailler aussi.</h2>
            <p>
              Les témoignages fournis reviennent constamment sur les mêmes points :
              ponctualité, communication, soin du logement, conseils et solutions adaptées.
            </p>
            <div className="about-points">
              <div><span>01</span><strong>Un diagnostic expliqué</strong><p>Les clients apprécient les explications et les conseils donnés pendant l’intervention.</p></div>
              <div><span>02</span><strong>Un chantier respecté</strong><p>Le travail propre, minutieux et respectueux du logement est régulièrement souligné.</p></div>
              <div><span>03</span><strong>Une prise en charge réactive</strong><p>Plusieurs avis mentionnent un déplacement rapide et une intervention organisée sans délai inutile.</p></div>
            </div>
          </div>
        </div>
      </section>

      <section className="reviews-section" id="avis">
        <div className="page-shell">
          <div className="reviews-heading">
            <div>
              <p className="eyebrow eyebrow-light">Avis clients</p>
              <h2>Les preuves sont déjà dans les témoignages.</h2>
            </div>
          </div>
          <ReviewCarousel />
        </div>
      </section>

      <section className="contact-section" id="contact">
        <div className="page-shell contact-grid">
          <div className="contact-copy">
            <p className="eyebrow">Contact et zone</p>
            <h2>Basé à Saint-Étienne-de-Chigny.</h2>
            <p>
              L’adresse de l’intervention et la disponibilité sont confirmées lors de la prise de contact.
              Les horaires détaillés n’étaient pas fournis ; la fiche Google indique une ouverture à 8h.
            </p>
          </div>
          <div className="contact-cards">
            <a className="contact-card" href={`tel:${PHONE_LINK}`}>
              <span className="contact-card-icon"><PhoneIcon /></span>
              <div><small>Téléphone</small><strong>{PHONE_DISPLAY}</strong></div>
              <ArrowIcon />
            </a>
            <div className="contact-card">
              <span className="contact-card-icon"><PinIcon /></span>
              <div><small>Adresse</small><strong>11 Allée Barbara<br />37230 Saint-Étienne-de-Chigny</strong></div>
            </div>
          </div>
        </div>
      </section>

      <section className="quote-section" id="devis">
        <div className="page-shell">
          <QuoteWorkflow />
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
