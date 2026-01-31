exports.getLeaderboard = (req, res) => {
  res.json([
    { name: "Raghav", score: 120 },
    { name: "Yash", score: 110 },
    { name: "Aman", score: 95 }
  ]);
};
