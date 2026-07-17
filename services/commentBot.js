const axios = require("axios");
const { generateResponse, detectLanguage } = require("./ai");
const responses = require("../data/responses.json");

async function replyToComment(commentId, text) {
  try {
    await axios.post(
      `https://graph.facebook.com/v19.0/${commentId}/comments`,
      { message: text },
      { params: { access_token: process.env.PAGE_ACCESS_TOKEN } }
    );
  } catch (error) {
    console.error("Error replying to comment:", error.response?.data || error.message);
  }
}

function findMatch(message) {
  const lower = message.toLowerCase();
  for (const [pattern, responseKey] of Object.entries(responses.patterns)) {
    if (lower.includes(pattern)) {
      return responseKey;
    }
  }
  return null;
}

async function handleComment(data) {
  const commentText = data.text;
  const commentId = data.comment_id;
  const postId = data.post_id;

  console.log(`New comment on post ${postId}: ${commentText}`);

  const matchedResponse = findMatch(commentText);

  if (matchedResponse) {
    const lang = detectLanguage(commentText);
    const response = responses.replies[matchedResponse]?.[lang];
    if (response) {
      await replyToComment(commentId, response);
      return;
    }
  }

  const lang = detectLanguage(commentText);
  const aiResponse = await generateResponse(commentText);
  await replyToComment(commentId, aiResponse);
}

module.exports = { handleComment };
