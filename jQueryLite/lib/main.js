const DomNodeCollection = require("./dom_node_collection");

const _docReadyCallbacks = [];
let _docReady = false;

window.$l = (arg) => {
  switch (typeof arg) {
    case "function":
      return registerDocReadyCallback(arg);
    case "string":
      return getNodesFromDom(arg);
    case "object":
      if (arg instanceof HTMLElement) {
        return new DomNodeCollection([arg]);
      }
  }
};

$l.extend = (base, ...otherObjs) => {
  otherObjs.forEach((obj) => {
    for (const prop in obj) {
      base[prop] = obj[prop];
    }
  });
  return base;
};

$l.ajax = (options) => {
  const request = new XMLHttpRequest();
  const defaults = {
    contentType: "application/x-www-form-urlencoded; charset=UTF-8",
    method: "GET",
    url: "",
    success: () => {},
    error: () => {},
    data: {},
  };
  options = $l.extend(defaults, options);
  options.method = options.method.toUpperCase();

  if (options.method === "GET") {
    // data is query string for get
    options.url += `?${toQueryString(options.data)}`;
  }

  request.open(options.method, options.url, true);
  request.onload = (e) => {
    // NB: Triggered when request.readyState === XMLHttpRequest.DONE ===  4
    if (request.status === 200) {
      options.success(request.response);
    } else {
      options.error(request.response);
    }
  };

  request.send(JSON.stringify(options.data));
};
