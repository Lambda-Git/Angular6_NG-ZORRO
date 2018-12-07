import {environment as defaultEnvironment} from './environment';

export const environmentLoader = new Promise<any>((resolve, reject) => {
  const xmlHttp = new XMLHttpRequest(), method = 'GET', url = './assets/environments/environment.json';
  xmlHttp.open(method, url, true);
  xmlHttp.onload = function () {
    if (xmlHttp.status === 200) {
      resolve(JSON.parse(xmlHttp.responseText));
    } else {
      resolve(defaultEnvironment);
    }
  };
  xmlHttp.send();
});
