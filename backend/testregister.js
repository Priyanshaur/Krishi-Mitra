// testregister.js
import fetch from "node-fetch";

const test = async () => {
  const res = await fetch("http://localhost:5000/api/auth/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      name: "Priyansh Gaur",
      email: "priyanshgaur10@gmail.com",
      password: "12345",
      role: "farmer",
    }),
  });

  const data = await res.json();
  console.log(data);
};

test();
