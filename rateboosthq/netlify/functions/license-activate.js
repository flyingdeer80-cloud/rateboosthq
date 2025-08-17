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
  if (event.httpMethod !== "POST") return ok({"error":"Use POST"}, 405);

  let payload;
  try { payload = JSON.parse(event.body || "{}"); } catch (e) { return ok({"error":"Invalid JSON"}, 400); }
  const license_key = payload.license_key;
  const instance_name = payload.instance_name || "WebApp";

  if (!license_key) return ok({"error":"Missing license_key"}, 400);

  const apiKey = process.env.LEMONSQUEEZY_API_KEY;
  if (!apiKey) return ok({"error":"Server not configured (missing API key)"}, 500);

  try {
    const res = await fetch("https://api.lemonsqueezy.com/v1/licenses/activate", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Accept": "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ license_key, instance_name })
    });
    const data = await res.json();
    return ok(data, res.status);
  } catch (err) {
    return ok({"error":"Network error", "details": String(err)}, 502);
  }
};
