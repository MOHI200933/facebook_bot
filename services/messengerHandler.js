const { sendTextMessage, sendQuickReplies } = require("./messenger");
const { generateResponse } = require("./ai");
const responses = require("../data/responses.json");

function findMatch(message) {
  const lower = message.toLowerCase();
  for (const [pattern, responseKey] of Object.entries(responses.patterns)) {
    if (lower.includes(pattern)) {
      return responseKey;
    }
  }
  return null;
}

async function handleMessage(event) {
  const senderId = event.sender.id;
  const messageText = event.message?.text;

  if (!messageText) return;

  console.log(`Message from ${senderId}: ${messageText}`);

  const matchedResponse = findMatch(messageText);

  if (matchedResponse) {
    const lang = /[\u0600-\u06FF]/.test(messageText) ? "ar" : "fr";
    const response = responses.replies[matchedResponse]?.[lang];
    if (response) {
      await sendTextMessage(senderId, response);

      await sendQuickReplies(senderId, responses.quickReplies.followUp[lang], [
        { title: responses.quickReplies.options.order[lang], payload: "ORDER" },
        { title: responses.quickReplies.options.price[lang], payload: "PRICE" },
        { title: responses.quickReplies.options.usage[lang], payload: "USAGE" },
        { title: responses.quickReplies.options.human[lang], payload: "HUMAN" }
      ]);
      return;
    }
  }

  const aiResponse = await generateResponse(messageText);
  await sendTextMessage(senderId, aiResponse);
}

module.exports = { handleMessage };
