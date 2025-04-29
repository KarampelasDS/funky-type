export default async function handler(req, res) {
  try {
    const response = await fetch("https://favqs.com/api/quotes", {
      headers: {
        Authorization: `Token token=${process.env.FAVQS_API_KEY}`,
      },
    });

    if (!response.ok) {
      return res
        .status(response.status)
        .json({ error: "Failed to fetch quote, try refreshing." });
    }

    const data = await response.json();
    const quotes = data.quotes;

    if (!quotes || quotes.length === 0) {
      return res.status(404).json({ error: "No quotes found." });
    }

    const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
    res.status(200).json(randomQuote);
  } catch (error) {
    // This catches fetch errors like DNS issues, CORS issues, etc.
    console.error("Error fetching quote:", error);
    res.status(500).json({ body: "Something went wrong, try refreshing." });
  }
}
