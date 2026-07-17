const { GoogleGenerativeAI } = require("@google/generative-ai");
const product = require("../product");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const SYSTEM_PROMPT = `You are a smart sales bot for "${product.name.ar}".

Product info:
- Description: ${product.description.ar}
- Current price: ${product.price.ar}
- Original price: ${product.originalPrice.ar}
- Offer: ${product.offer.ar}
- How to use: ${product.usage.ar}
- Delivery: ${product.delivery.ar}
- Guarantee: ${product.guarantee.ar}
- Payment: ${product.paymentMethods.ar.join(", ")}
- Contact: ${product.contact.ar}

Features:
${product.features.ar.map((f) => "- " + f).join("\n")}

Rules:
1. Always reply in Arabic
2. Be friendly and professional
3. Try to convince the customer to buy
4. If they ask about price, mention the special offer and discount
5. If they ask how to use, explain clearly
6. If they ask about delivery, tell them the timeframe
7. If they hesitate, mention the guarantee and discount
8. Keep responses brief and persuasive`;

const SYSTEM_PROMPT_FR = `Tu es un chatbot de vente intelligent pour "${product.name.fr}".

Infos produit:
- Description: ${product.description.fr}
- Prix actuel: ${product.price.fr}
- Prix original: ${product.originalPrice.fr}
- Offre: ${product.offer.fr}
- Utilisation: ${product.usage.fr}
- Livraison: ${product.delivery.fr}
- Garantie: ${product.guarantee.fr}
- Contact: ${product.contact.fr}

Caractéristiques:
${product.features.fr.map((f) => "- " + f).join("\n")}

Règles:
1. Réponds toujours en français
2. Sois amical et professionnel
3. Essaie de convaincre le client
4. Si le client demande le prix, mentionne l'offre
5. Si le client demande l'utilisation, explique clairement
6. Si le client hésite, mentionne la garantie
7. Sois persuasif mais bref`;

function detectLanguage(text) {
  const arabicRegex = /[\u0600-\u06FF]/;
  return arabicRegex.test(text) ? "ar" : "fr";
}

async function generateResponse(userMessage) {
  const lang = detectLanguage(userMessage);
  const systemPrompt = lang === "ar" ? SYSTEM_PROMPT : SYSTEM_PROMPT_FR;

  try {
    const model = genAI.getGenerativeModel({
      model: "gemini-2.0-flash",
      systemInstruction: systemPrompt
    });

    const result = await model.generateContent(userMessage);
    const response = result.response;
    return response.text();
  } catch (error) {
    console.error("Gemini error:", error.message);
    return lang === "ar"
      ? "شكراً لتواصلك معنا! سنرد عليك قريباً."
      : "Merci! Nous vous répondrons bientôt.";
  }
}

module.exports = { generateResponse, detectLanguage };
