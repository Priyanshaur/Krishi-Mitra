// testlogin.js
import fetch from "node-fetch";

const test = async () => {
  const res = await fetch("http://localhost:5000/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email: "priyanshgaur10@gmail.com",
      password: "12345",
    }),
  });

  const data = await res.json();
  console.log(data);
};

test();
