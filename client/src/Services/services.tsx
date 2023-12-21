 
export const getLatLong = async (zipcode: string) => {
  const baseURL = process.env.NODE_ENV === "production"
    ? "/api/"
    : "http://localhost:3001/api/";
  try {
    const url = baseURL+zipcode;
    let response = await fetch(url, {
      method: "POST",
      mode: "cors",
      headers:{
        'Content-Type': 'application/json;charset=utf-8'
      }
    });
    let responseJSON = await response.json();
    return responseJSON
  }catch(e) {
    console.log(e)
  }
}
