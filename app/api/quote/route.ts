import { NextResponse } from "next/server";
import { Resend } from "resend";

export const runtime = "nodejs";

const MAX_PHOTOS = 5;
const MAX_FILE_SIZE = 4 * 1024 * 1024;
const MAX_TOTAL_SIZE = 20 * 1024 * 1024;

const ALLOWED_FILE_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
]);

function getTextField(formData: FormData, key: string) {
  const value = formData.get(key);

  return typeof value === "string" ? value.trim() : "";
}

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function formatPreferredDate(value: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return value;
  }

  const date = new Date(`${value}T12:00:00`);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat("fr-FR", {
    dateStyle: "long",
  }).format(date);
}

function createInformationRow(label: string, value: string) {
  return `
    <tr>
      <td
        style="
          width: 190px;
          padding: 13px 16px;
          border-bottom: 1px solid #d9e5e6;
          color: #68797b;
          font-size: 13px;
          font-weight: 700;
          vertical-align: top;
        "
      >
        ${escapeHtml(label)}
      </td>

      <td
        style="
          padding: 13px 16px;
          border-bottom: 1px solid #d9e5e6;
          color: #10272b;
          font-size: 14px;
          line-height: 1.55;
          vertical-align: top;
        "
      >
        ${escapeHtml(value || "Non renseigné")}
      </td>
    </tr>
  `;
}

export async function POST(request: Request) {
  try {
    const apiKey = process.env.RESEND_API_KEY;
    const fromEmail = process.env.QUOTE_FROM_EMAIL;
    const businessEmail = process.env.QUOTE_TO_EMAIL;

    if (!apiKey || !fromEmail || !businessEmail) {
      console.error("Missing Resend environment variables.");

      return NextResponse.json(
        {
          ok: false,
          message:
            "Le système d’envoi n’est pas encore configuré. Veuillez appeler directement.",
        },
        {
          status: 500,
        },
      );
    }

    const formData = await request.formData();
    const honeypot = getTextField(formData, "companyWebsite");

    if (honeypot) {
      return NextResponse.json({
        ok: true,
        confirmationSent: true,
      });
    }

    const services = formData
      .getAll("services")
      .filter((value): value is string => typeof value === "string")
      .map((value) => value.trim())
      .filter(Boolean);

    const urgency = getTextField(formData, "urgency");
    const propertyType = getTextField(formData, "propertyType");
    const details = getTextField(formData, "details");
    const address = getTextField(formData, "address");
    const postcode = getTextField(formData, "postcode");
    const preferredDate = getTextField(formData, "preferredDate");
    const preferredTime = getTextField(formData, "preferredTime");
    const firstName = getTextField(formData, "firstName");
    const lastName = getTextField(formData, "lastName");
    const email = getTextField(formData, "email").toLowerCase();
    const phone = getTextField(formData, "phone");

    if (
      services.length === 0 ||
      !urgency ||
      !propertyType ||
      !address ||
      !postcode ||
      !preferredDate ||
      !preferredTime ||
      !firstName ||
      !lastName ||
      !email ||
      !phone
    ) {
      return NextResponse.json(
        {
          ok: false,
          message:
            "Certaines informations obligatoires sont manquantes dans la demande.",
        },
        {
          status: 400,
        },
      );
    }

    const emailIsValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    if (!emailIsValid) {
      return NextResponse.json(
        {
          ok: false,
          message: "L’adresse e-mail indiquée n’est pas valide.",
        },
        {
          status: 400,
        },
      );
    }

    const photoEntries = formData
      .getAll("photos")
      .filter(
        (value): value is File => value instanceof File && value.size > 0,
      );

    if (photoEntries.length > MAX_PHOTOS) {
      return NextResponse.json(
        {
          ok: false,
          message: `Vous pouvez joindre au maximum ${MAX_PHOTOS} photographies.`,
        },
        {
          status: 400,
        },
      );
    }

    let totalPhotoSize = 0;

    for (const photo of photoEntries) {
      if (!ALLOWED_FILE_TYPES.has(photo.type)) {
        return NextResponse.json(
          {
            ok: false,
            message:
              "Une photographie utilise un format non autorisé. Utilisez JPG, PNG ou WebP.",
          },
          {
            status: 400,
          },
        );
      }

      if (photo.size > MAX_FILE_SIZE) {
        return NextResponse.json(
          {
            ok: false,
            message: `${photo.name} dépasse la limite de 4 Mo.`,
          },
          {
            status: 400,
          },
        );
      }

      totalPhotoSize += photo.size;
    }

    if (totalPhotoSize > MAX_TOTAL_SIZE) {
      return NextResponse.json(
        {
          ok: false,
          message: "La taille totale des photographies est trop importante.",
        },
        {
          status: 400,
        },
      );
    }

    const attachments = await Promise.all(
      photoEntries.map(async (photo, index) => {
        const extension =
          photo.type === "image/png"
            ? "png"
            : photo.type === "image/webp"
              ? "webp"
              : "jpg";

        const safeOriginalName = photo.name
          .replace(/\.[^.]+$/, "")
          .replace(/[^a-zA-Z0-9_-]/g, "_")
          .slice(0, 60);

        return {
          content: Buffer.from(await photo.arrayBuffer()),
          filename: `${index + 1}-${safeOriginalName || "photo"}.${extension}`,
        };
      }),
    );

    const fullName = `${firstName} ${lastName}`.trim();
    const formattedDate = formatPreferredDate(preferredDate);
    const servicesText = services.join(", ");

    const businessEmailHtml = `
      <!doctype html>
      <html lang="fr">
        <body
          style="
            margin: 0;
            padding: 0;
            background: #f2eee6;
            font-family: Arial, Helvetica, sans-serif;
          "
        >
          <div style="padding: 30px 12px;">
            <div
              style="
                width: 100%;
                max-width: 720px;
                margin: 0 auto;
                overflow: hidden;
                border-radius: 18px;
                background: #ffffff;
                box-shadow: 0 18px 50px rgba(6, 31, 24, 0.10);
              "
            >
              <div
                style="
                  padding: 30px;
                  background: #082f36;
                  color: #ffffff;
                "
              >
                <div
                  style="
                    color: #43c6d2;
                    font-size: 12px;
                    font-weight: 800;
                    letter-spacing: 0.16em;
                    text-transform: uppercase;
                  "
                >
                  Nouvelle demande de devis
                </div>

                <h1
                  style="
                    margin: 12px 0 0;
                    font-size: 30px;
                    line-height: 1.15;
                  "
                >
                  ${escapeHtml(services[0])}
                </h1>

                <p
                  style="
                    margin: 12px 0 0;
                    color: #d5eaec;
                    font-size: 15px;
                    line-height: 1.6;
                  "
                >
                  Demande envoyée par ${escapeHtml(fullName)} depuis le formulaire du site.
                </p>
              </div>

              <div style="padding: 28px;">
                <div
                  style="
                    margin-bottom: 24px;
                    padding: 18px;
                    border-left: 5px solid #e2764c;
                    background: #eaf7f7;
                  "
                >
                  <strong
                    style="
                      display: block;
                      color: #10272b;
                      font-size: 15px;
                    "
                  >
                    Délai souhaité
                  </strong>

                  <span
                    style="
                      display: block;
                      margin-top: 6px;
                      color: #68797b;
                      font-size: 14px;
                    "
                  >
                    ${escapeHtml(urgency)}
                  </span>
                </div>

                <table
                  width="100%"
                  cellpadding="0"
                  cellspacing="0"
                  role="presentation"
                  style="
                    overflow: hidden;
                    border: 1px solid #d9e5e6;
                    border-radius: 12px;
                    border-collapse: separate;
                    border-spacing: 0;
                  "
                >
                  ${createInformationRow("Client", fullName)}
                  ${createInformationRow("Téléphone", phone)}
                  ${createInformationRow("Adresse e-mail", email)}
                  ${createInformationRow("Services", servicesText)}
                  ${createInformationRow("Type de propriété", propertyType)}
                  ${createInformationRow("Adresse", `${address}, ${postcode}`)}
                  ${createInformationRow("Date souhaitée", formattedDate)}
                  ${createInformationRow("Moment souhaité", preferredTime)}
                  ${createInformationRow(
                    "Photographies jointes",
                    photoEntries.length.toString(),
                  )}
                </table>

                <div
                  style="
                    margin-top: 24px;
                    padding: 20px;
                    border-radius: 12px;
                    background: #f2eee6;
                  "
                >
                  <strong
                    style="
                      display: block;
                      margin-bottom: 10px;
                      color: #10272b;
                      font-size: 14px;
                    "
                  >
                    Description complémentaire
                  </strong>

                  <p
                    style="
                      margin: 0;
                      color: #607477;
                      font-size: 14px;
                      line-height: 1.7;
                      white-space: pre-line;
                    "
                  >
                    ${escapeHtml(details || "Aucune précision complémentaire.")}
                  </p>
                </div>

                <div style="margin-top: 26px; text-align: center;">
                  <a
                    href="tel:${escapeHtml(phone)}"
                    style="
                      display: inline-block;
                      padding: 14px 22px;
                      border-radius: 999px;
                      background: #e2764c;
                      color: #ffffff;
                      font-size: 14px;
                      font-weight: 800;
                      text-decoration: none;
                    "
                  >
                    Appeler ${escapeHtml(firstName)}
                  </a>
                </div>
              </div>
            </div>
          </div>
        </body>
      </html>
    `;

    const resend = new Resend(apiKey);

    const businessResult = await resend.emails.send({
      from: fromEmail,
      to: businessEmail,
      replyTo: email,
      subject: `[Devis ${urgency}] ${services[0]} — ${fullName}`,
      html: businessEmailHtml,
      attachments: attachments.length > 0 ? attachments : undefined,
      tags: [
        {
          name: "source",
          value: "website_quote",
        },
      ],
    });

    if (businessResult.error) {
      console.error("Resend business email error:", businessResult.error);

      return NextResponse.json(
        {
          ok: false,
          message:
            "La demande n’a pas pu être transmise. Veuillez appeler directement.",
        },
        {
          status: 500,
        },
      );
    }

    const customerEmailHtml = `
      <!doctype html>
      <html lang="fr">
        <body
          style="
            margin: 0;
            padding: 0;
            background: #f2eee6;
            font-family: Arial, Helvetica, sans-serif;
          "
        >
          <div style="padding: 30px 12px;">
            <div
              style="
                width: 100%;
                max-width: 640px;
                margin: 0 auto;
                overflow: hidden;
                border-radius: 18px;
                background: #ffffff;
              "
            >
              <div
                style="
                  padding: 28px;
                  background: #082f36;
                  color: #ffffff;
                "
              >
                <div
                  style="
                    color: #43c6d2;
                    font-size: 12px;
                    font-weight: 800;
                    letter-spacing: 0.15em;
                    text-transform: uppercase;
                  "
                >
                  Plomberie Matinier
                </div>

                <h1
                  style="
                    margin: 12px 0 0;
                    font-size: 28px;
                    line-height: 1.2;
                  "
                >
                  Votre demande a bien été reçue.
                </h1>
              </div>

              <div style="padding: 28px;">
                <p
                  style="
                    margin: 0;
                    color: #52686b;
                    font-size: 15px;
                    line-height: 1.75;
                  "
                >
                  Bonjour ${escapeHtml(firstName)},
                </p>

                <p
                  style="
                    margin: 18px 0 0;
                    color: #52686b;
                    font-size: 15px;
                    line-height: 1.75;
                  "
                >
                  Nous avons bien reçu votre demande concernant :
                  <strong>${escapeHtml(servicesText)}</strong>.
                  Les informations transmises permettront d’examiner votre besoin
                  avant de vous recontacter.
                </p>

                <div
                  style="
                    margin-top: 24px;
                    padding: 20px;
                    border-left: 5px solid #e2764c;
                    background: #eaf7f7;
                  "
                >
                  <strong
                    style="
                      display: block;
                      color: #10272b;
                      font-size: 14px;
                    "
                  >
                    Rendez-vous souhaité
                  </strong>

                  <span
                    style="
                      display: block;
                      margin-top: 7px;
                      color: #68797b;
                      font-size: 14px;
                      line-height: 1.6;
                    "
                  >
                    ${escapeHtml(formattedDate)} — ${escapeHtml(preferredTime)}
                  </span>
                </div>

                <p
                  style="
                    margin: 24px 0 0;
                    color: #52686b;
                    font-size: 15px;
                    line-height: 1.75;
                  "
                >
                  Pour échanger directement, vous pouvez appeler le
                  <strong>06 46 21 24 57</strong>.
                </p>

                <p
                  style="
                    margin: 28px 0 0;
                    color: #7b8b8d;
                    font-size: 12px;
                    line-height: 1.6;
                  "
                >
                  Cet e-mail confirme uniquement la réception de votre demande.
                  La date d’intervention doit encore être confirmée.
                </p>
              </div>
            </div>
          </div>
        </body>
      </html>
    `;

    const customerResult = await resend.emails.send({
      from: fromEmail,
      to: email,
      subject:
        "Plomberie Matinier — votre demande a bien été reçue",
      html: customerEmailHtml,
      tags: [
        {
          name: "source",
          value: "quote_confirmation",
        },
      ],
    });

    if (customerResult.error) {
      console.error("Resend confirmation email error:", customerResult.error);
    }

    return NextResponse.json({
      ok: true,
      confirmationSent: !customerResult.error,
    });
  } catch (error) {
    console.error("Quote route error:", error);

    return NextResponse.json(
      {
        ok: false,
        message:
          "Une erreur inattendue est survenue. Veuillez appeler directement.",
      },
      {
        status: 500,
      },
    );
  }
}
