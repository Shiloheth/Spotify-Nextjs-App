import { supabase } from "../lib/supabaseClient";

export async function getRefreshToken() {
  const refresh_token = await getRefresh();
  const url = "https://accounts.spotify.com/api/token";

  const authOptions = {
    method: "POST",
    headers: {
      Authorization:
        "Basic " +
        Buffer.from(client_id + ":" + client_secret).toString("base64"),
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: `grant_type=refresh_token&refresh_token=${refresh_token}`,
  };

  const res = await fetch(url, authOptions);
  const data = await res.json();
  updateToken(1, data.access_token);
}

export async function setrefreshtoken(id, refreshtoken) {
  const { data, error } = await supabase
    .from("RefreshToken")
    .update({ Refreshtoken: refreshtoken })
    .eq("id", id);
}

export async function getToken() {
  let { data } = await supabase.from("Token").select();
  return data[0].accessTokens;
}

export async function getRefresh() {
  let { data } = await supabase.from("RefreshToken").select();
  return data[0].Refreshtoken;
}

export async function updateToken(id, newToken) {
  const { data, error } = await supabase
    .from("Token")
    .update({ accessTokens: newToken })
    .eq("id", id);
}

async function getAccessToken() {
  const tokenUrl = "https://accounts.spotify.com/api/token";
  const auth = Buffer.from(client_id + ":" + client_secret).toString("base64");
  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: `Basic ${auth}`,
    },
    body: `grant_type=authorization_code&redirect_uri=${redirect_uri}&code=${code}`,
  };

  const response = await fetch(tokenUrl, options);
  const data = await response.json();
  updateToken(1, data.access_token);
  setrefreshtoken(1, data.refresh_token);
  getToken();
}
