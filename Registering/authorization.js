const fetchAuthToken = async () => {
  const url = "http://20.244.56.144/evaluation-service/auth";

  const requestBody = {
    email: "giridhardu.btech22@rvu.edu.in",
    name: "Giridhar D U",
    rollNo: "1RVU22CSE059",
    accessCode: "WPVqkw",
    clientID: "dd19a8c0-6322-48f3-9db3-01f413fb08db",
    clientSecret: "fMrUYVEgCdBcjTmw"
  };

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.status} - ${response.statusText}`);
    }

    const data = await response.json();
    console.log("Access Token:", data.access_token);
    console.log("Token Type:", data.token_type);
    console.log("Expires In:", data.expires_in);

    return data.access_token;
  } catch (error) {
    console.error("Failed to fetch auth token:", error);
  }
};

fetchAuthToken();
