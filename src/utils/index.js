const get = async (url) => {
  const response = await fetch(url, {
    headers: {
      'Content-Type': 'model/stl',
      'Accept': 'model/stl'
    }
  });

  return response;
};

const getArea = (coords = []) => {
  const [p1, p2, p3] = coords;
  const ax = p2.x - p1.x;
  const ay = p2.y - p1.y;
  const az = p2.z - p1.z;
  const bx = p3.x - p1.x;
  const by = p3.y - p1.y;
  const bz = p3.z - p1.z;
  const cx = ay * bz - az * by;
  const cy = az * bx - ax * bz;
  const cz = ax * by - ay * bx;

  return 0.5 * Math.sqrt(cx * cx + cy * cy + cz * cz);
};

const parse = (str = '') => {
  return str.split('\n').filter(item => {
    return item.includes('vertex');
  }).map(item => {
    return item.trim();
  }).reduce((total, item, index) => {
    const normalized = item.replace('vertex', '').split(' ').filter(item => !!item).reduce((t, n, i) => {
      switch (i) {
        case 0:
          return {
            ...t,
            x: +n,
          }
        case 1:
          return {
            ...t,
            y: +n,
          }
        case 2:
          return {
            ...t,
            z: +n,
          }
      }
    }, {
      x: 0,
      y: 0,
      z: 0,
    });
    const count = index + 1;
    if (count >= 3 && count % 3 === 0) {
      const latestArea = getArea([...total.temp, normalized]);
      return {
        ...total,
        triangles: total.triangles + 1,
        surfaceArea: total.surfaceArea + latestArea,
        temp: [],
      }
    }

    return {
      ...total,
      temp: [...total.temp, normalized],
    }
  }, {
    temp: [],
    triangles: 0,
    surfaceArea: 0,
  });
}


const analyze = async (url) => {
  const response = await get(url);
  const responseText = await response.text();
  const {triangles, surfaceArea} = parse(responseText);

  return {
    triangles,
    surfaceArea,
  };
};

export {
  analyze,
};

