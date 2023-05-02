const VERSION = 2;
const VERSION_MEASURE = 1;
const VERSION_PLATFORM = 2;
const setVersionVisible = (version) => {
  return version === VERSION || VERSION === 3;
}
export {VERSION, VERSION_MEASURE, VERSION_PLATFORM, setVersionVisible};
