const cloneObject = (obj) => {
  let newObj = {};
  if (obj instanceof Array) {
    newObj = [];
  }
  for (let key in obj) {
    let val = obj[key];
    newObj[key] = typeof val === 'object' ? cloneObject(val) : val;
  }
  return newObj;
};
export {cloneObject};
