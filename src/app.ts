import axios from "axios";

const form = document.querySelector("form")!;
const apiInput = document.getElementById("api")! as HTMLInputElement;
const addressInput = document.getElementById("address")! as HTMLInputElement;

type GoogleGeocodingRes = { results: { geometry: { location: { lat: number; lng: number } } }[]; status: "OK" | "ZERO_RESULTS" };

function searchAddressHandler(event: Event) {
  event.preventDefault();
  const enteredAddress = addressInput.value;
  const apiKey = apiInput.value;

  axios
    .get<GoogleGeocodingRes>(`https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURI(enteredAddress)}&key=${apiKey}`)
    .then((res) => {
      if (res.data.status !== "OK") {
        throw new Error("Could not fetch location");
      }
      const coord = res.data.results[0].geometry.location;
      const map = new google.maps.Map(document.getElementById("map") as HTMLElement, {
        center: coord,
        zoom: 8,
      });
      new google.maps.Marker({ position: coord, map: map });
    })
    .catch((err) => {
      console.log(err);
    });
}

form?.addEventListener("submit", searchAddressHandler);
