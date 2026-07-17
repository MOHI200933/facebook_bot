const OpenAI = require("openai");
const product = require("../product");

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const SYSTEM_PROMPT = `أنت بوت مبيعات ذكي لمنتج "${product.name.ar}".

معلومات المنتج:
- الوصف: ${product.description.ar}
- السعر الحالي: ${product.price.ar}
- السعر الأصلي: ${product.originalPrice.ar}
- العرض: ${product.offer.ar}
- طريقة الاستعمال: ${product.usage.ar}
- التوصيل: ${product.delivery.ar}
- الضمان: ${product.guarantee.ar}
- طرق الدفع: ${product.paymentMethods.ar.join(", ")}
- للتواصل: ${product.contact.ar}

مميزات المنتج:
${product.features.ar.map((f) => "- " + f).join("\n")}

قواعد:
1. رد بالعربية دائماً
2. كن ودوداً ومحترفاً
3. حاول إقناع الزبون بالشراء
4. إذا سأل عن السعر، ذكر العرض الخاص والخصم
5. إذا سأل عن طريقة الاستعمال، اشرح بوضوح
6. إذا سأل عن التوصيل، أخبره بالمدة وطرق التوصيل
7. إذا تردد، ذكر الضمان وعرض الخصم
8. لا تختلق معلومات غير موجودة
9. إذا كان السؤال خارج نطاق المنتج، ودّع بلطف`;

const SYSTEM_PROMPT_FR = `Tu es un chatbot de vente intelligent pour le produit "${product.name.fr}".

Informations produit:
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
3. Essaie de convaincre le client d'acheter
4. Si le client demande le prix, mentionne l'offre spéciale
5. Si le client demande l'utilisation, explique clairement
6. Si le client hésite, mentionne la garantie
7. Sois persuasif mais honnête`;

function detectLanguage(text) {
  const arabicRegex = /[\u0600-\u06FF]/;
  return arabicRegex.test(text) ? "ar" : "fr";
}

async function generateResponse(userMessage) {
  const lang = detectLanguage(userMessage);
  const systemPrompt = lang === "ar" ? SYSTEM_PROMPT : SYSTEM_PROMPT_FR;

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userMessage }
      ],
      max_tokens: 500,
      temperature: 0.7
    });

    return completion.choices[0].message.content;
  } catch (error) {
    console.error("OpenAI error:", error.message);
    return lang === "ar"
      ? "شكراً لتواصلك معنا! للأسف حدث خطأ مؤقت. سنرد عليك قريباً. 🙏"
      : "Merci de nous contacter! Une erreur temporaire s'est produite. Nous vous répondrons bientôt. 🙏";
  }
}

module.exports = { generateResponse, detectLanguage };
