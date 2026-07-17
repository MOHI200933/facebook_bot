const axios = require("axios");

async function sendTextMessage(recipientId, text) {
  try {
    await axios.post(
      "https://graph.facebook.com/v19.0/me/messages",
      {
        recipient: { id: recipientId },
        message: { text }
      },
      {
        params: { access_token: process.env.PAGE_ACCESS_TOKEN }
      }
    );
  } catch (error) {
    console.error("Error sending message:", error.response?.data || error.message);
  }
}

async function sendQuickReplies(recipientId, text, replies) {
  try {
    await axios.post(
      "https://graph.facebook.com/v19.0/me/messages",
      {
        recipient: { id: recipientId },
        message: {
          text,
          quick_replies: replies.map((r) => ({
            content_type: "text",
            title: r.title,
            payload: r.payload
          }))
        }
      },
      {
        params: { access_token: process.env.PAGE_ACCESS_TOKEN }
      }
    );
  } catch (error) {
    console.error("Error sending quick replies:", error.response?.data || error.message);
  }
}

async function sendGenericTemplate(recipientId, elements) {
  try {
    await axios.post(
      "https://graph.facebook.com/v19.0/me/messages",
      {
        recipient: { id: recipientId },
        message: {
          attachment: {
            type: "template",
            payload: {
              template_type: "generic",
              elements
            }
          }
        }
      },
      {
        params: { access_token: process.env.PAGE_ACCESS_TOKEN }
      }
    );
  } catch (error) {
    console.error("Error sending template:", error.response?.data || error.message);
  }
}

module.exports = { sendTextMessage, sendQuickReplies, sendGenericTemplate };
