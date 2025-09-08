const url = "http://20.244.56.144/evaluation-service/register";

const data = {
  email: "giridhardu.btech22@rvu.edu.in",
  name: "Giridhar D U",
  mobileNo: "9986818644",
  githubUsername: "Giridhardiyu",
  rollNo: "1RVU22CSE059",
  accessCode: "WPVqkw"
};

async function register() {
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    console.log("Registration successful:", result);

    if (result.clientID && result.clientSecret) {
      console.log("clientID:", result.clientID);
      console.log("clientSecret:", result.clientSecret);
    }

  } catch (error) {
    console.error("Error during registration:", error);
  }
}

register();
