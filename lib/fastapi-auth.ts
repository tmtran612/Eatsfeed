import { signIn, useSession } from "next-auth/react"

export async function exchangeTokenWithFastAPI({ provider, accessToken, email, name }: {
  provider: string;
  accessToken: string;
  email: string;
  name: string;
}) {
  const response = await fetch("http://localhost:8000/api/auth/exchange", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ provider, access_token: accessToken, email, name }),
  });
  if (!response.ok) throw new Error("Failed to exchange token with FastAPI");
  const data = await response.json();
  localStorage.setItem("fastapi_jwt", data.jwt);
  return data.jwt;
}
