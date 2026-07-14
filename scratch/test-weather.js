const apiKey = "0b43bc517b9250fe6cbf0e4425591e30";
const location = "Mandya";

async function testWeather() {
  try {
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(location)}&appid=${apiKey}&units=metric`;
    const response = await fetch(url);
    if (response.ok) {
      const data = await response.json();
      console.log("Current weather success! City:", data.name);
    } else {
      console.log("Current weather failed with status:", response.status, response.statusText);
      const errText = await response.text();
      console.log("Response text:", errText);
    }
  } catch (err) {
    console.error("Error:", err);
  }
}

testWeather();
