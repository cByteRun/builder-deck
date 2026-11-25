function read(k, fb) {
  try {
    return JSON.parse(localStorage.getItem("builderdeck.studio.v2." + k)) ?? fb;
  } catch {
    return fb;
  }
}
function write(k, v) {
  try {
    localStorage.setItem("builderdeck.studio.v2." + k, JSON.stringify(v));
    return true;
  } catch {
    return false;
  }
}

export { read, write };
