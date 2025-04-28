export default async function handler(req, res) {
  const response = await fetch("https://api.hamatim.com/quote");
  const data = await response.json();
  res.status(200).json(data);
}
