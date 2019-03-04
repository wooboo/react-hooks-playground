import { stringify } from "qs";

export function postFetch(url = ``, data = {}) {
  // Default options are marked with *
  return fetch(url, {
    method: "POST", // *GET, POST, PUT, DELETE, etc.
    mode: "cors", // no-cors, cors, *same-origin
    cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
    credentials: "same-origin", // include, *same-origin, omit
    headers: {
      "Content-Type": "application/json"
      // "Content-Type": "application/x-www-form-urlencoded",
    },
    redirect: "follow", // manual, *follow, error
    referrer: "no-referrer", // no-referrer, *client
    body: JSON.stringify(data) // body data type must match "Content-Type" header
  });
}
export function getFetch(url = ``) {
  // Default options are marked with *
  return fetch(url, {
    method: "GET", // *GET, POST, PUT, DELETE, etc.
    mode: "cors", // no-cors, cors, *same-origin
    cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
    credentials: "same-origin", // include, *same-origin, omit
    headers: {
      // "Content-Type": "application/json"
      // "Content-Type": "application/x-www-form-urlencoded",
    },
    redirect: "follow", // manual, *follow, error
    referrer: "no-referrer" // no-referrer, *client
    //body: JSON.stringify(data) // body data type must match "Content-Type" header
  });
}

async function handleResponse(response) {
  const contentType = response.headers.get("content-type");
  let result;
  if (contentType && contentType.startsWith("application/json")) {
    result = await response.json();
  } else {
    result = await response.text();
  }

  if (response.status >= 200 && response.status < 300) {
    return result;
  } else if (response.status >= 400 || response.status < 600) {
    throw result;
  }
}

export function postForm(url) {
  return async (formData, valid) => {
    if (!valid) return;
    const response = await postFetch(url, formData);
    return await handleResponse(response);
  };
}

export function getValidation(url) {
  return async formData => {
    const response = await getFetch(`${url}?${stringify(formData)}`);
    return await handleResponse(response);
  };
}
