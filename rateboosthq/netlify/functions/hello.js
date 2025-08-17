const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization"
};

const ok = (body, status=200) => ({
  statusCode: status,
  headers: corsHeaders,
  body: JSON.stringify(body)
});

exports.onRequestOptions = async () => ({ statusCode: 204, headers: corsHeaders, body: "" });

exports.handler = async (event) => {
  if (event.httpMethod === "OPTIONS") return exports.onRequestOptions();
  return ok({"message":"Hello from Netlify functions. It works!"});
};
