import * as d3 from "../../_npm/d3@7.9.0/7055d4c5.js";
import { firebaseConfig } from "./firebasecfg.d82a3da1.js";
// import * as fs from "node:fs";

import {
  initializeApp,
  getApp,
} from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import {
  getDownloadURL,
  getStorage,
  ref,
  getMetadata,
} from "https://www.gstatic.com/firebasejs/11.0.1/firebase-storage.js";

//   const  API_KEY = process.env.API_KEY;
//   const NODE_ENV = process.env.NODE_ENV || "production";
// console.log("FB CONFIG ", firebaseConfig);
var NODE_ENV = firebaseConfig.ENV;
//   const firebaseConfig = {
//     apiKey: `${API_KEY}`,
//     authDomain: "spectrum-84a8f.firebaseapp.com",
//     projectId: "spectrum",
//     storageBucket: "spectrum.appspot.com",
//     messagingSenderId: "683648863965",
//     appId: "1:683648863965:web:406af615fc3af242fe5534",
//     measurementId: "G-Y6T1BXJTQF",
//     ENV:`${NODE_ENV}`
//   };

// Firebase configuration (replace with your project details)

const app = initializeApp(firebaseConfig);
// const storage = firebase.storage();

// const listref = ref(storage, path);

class AbstractFile {
  constructor(name, type, size) {
    this.name = name;
    this.type = type;
    this.size = size;
  }

  async text() {
    throw new Error("Method 'text' must be implemented.");
  }

  async image(props) {
    throw new Error("Method 'image' must be implemented.");
  }

  async json() {
    throw new Error("Method 'json' must be implemented.");
  }

  async content() {
    throw new Error("Method 'content' must be implemented.");
  }
}


class fbFile extends AbstractFile {
  constructor(filePath, type, size) {
    super(filePath, type, size);
    this.local = true;
    this.href = "/_file/_fb/" + filePath;
  }

  async fetchResponse() {
    return await fetch(this.href);
  }

  async text() {
    const response = await this.fetchResponse();
    this.type = response.headers.get("Content-Type");
    console.log("Content-Type", this.type);
    return response.text();
  }

  async image(props) {
    return new Promise((resolve, reject) => {
      const i = new Image(props);
      if (new URL(this.href, document.baseURI).origin !== new URL(location).origin) i.crossOrigin = "anonymous";
      Object.assign(i, props);
      i.onload = () => resolve(i);
      i.onerror = () => reject(new Error(`Unable to load file: ${this.name}`));
      i.src = this.href;
    });
  }

  async json() {
    const response = await this.fetchResponse();
    return  new Promise( res=>res((response.json())) ) ;
    // return response.json();
  }
  async csv(d3Options) {
  return  new Promise( res=>res((d3.csv(this.href,d3Options))) ) ;
  }
  async content() {
    const response = await this.fetchResponse();
    this.type = response.headers.get("Content-Type");
    console.log("Content-Type", this.type);
    return response.arrayBuffer();
  }
}

export async function FbFileAttachment(filePath) {
  var isDevelopment = NODE_ENV == "devel";
  // process.env.NODE_ENV
  if(filePath.startsWith("fb:")){
    isDevelopment=false;
  }

  if (isDevelopment) {
    // console.log("Local files", filePath);
    try {  
      // const blob = await response.blob();      
      // var localfile="/_file/"+filePath
      // const response = await fetch(localfile,{method: 'HEAD'});
      // const type=response.headers.get("Content-Type")
      // const size=+response.headers.get("Content-Length")        
            // try {
  var localfile = "/_file/_fb/" + filePath;
    const response = await fetch(localfile, { method: 'HEAD' });
    console.log("I am here", response.status, response.statusText);      
    const type = response.headers.get("Content-Type");
    const size = +response.headers.get("Content-Length");      
    let file= new fbFile(filePath, type, size);
    return new Promise((resolve, reject) => {
      if (file.name != "") {
        resolve(file);
      } else {
        reject("NO FILE FOUND");
      }
    });


      } catch (error) {
            console.error("Error in FbFileAttachment:", error);
            throw error;
      }
        
  } else {
    // Load file from Firebase Storage
    const storage = getStorage(app);
    
    let newfilePath="docs/"+filePath.replace("fb:","")
    console.log("Loading from FB",newfilePath);
    try {
      const fref = ref(storage, newfilePath);
      const url = await getDownloadURL(fref);      
      const meta=await getMetadata(fref);
      // const blob = await response.blob();
      console.log("Meta",meta)
      const file = {
        name: fref.name,
        type: meta.contentType,
        md5Hash:meta.md5Hash,
        href:url,
        size:meta.size,
        lastModified: meta.timeCreated,
        // size: blob.size,
        async content() {
          const response = await fetch(url);
          const data = await response.arrayBuffer();
          return new Uint8Array(data);
        },
        async csv() {
          // const text = await response.text();
          // return d3.csvParse(text);
          return getDownloadURL(fref).then((url) => d3.csv(url));
        },
        async json() {
          
            
              // if(fref==null){    
                return getDownloadURL(fref).then((url) => d3.json(url));
                // resolve(file);
              // } else {
                // return new Promise((resolve, reject) => {reject("error")})
              // }
            
          }
          
          // return await url.then((url) => d3.json(url));
          // const text = await response.text();
          // return d3.jsonParse(text);
        //}
      };

      return new Promise((resolve, reject) => {
        if (file.name != "") {
          resolve(file);
        } else {
          reject("NO FILE FOUND");
        }
      });

      // return file;
    } catch (error) {
      console.error("Error loading file:", error);
      return null;
    }
  }
}


export function getURL(filePath) {
  // "package.json"
  var isDevelopment = NODE_ENV == "devel";
  // process.env.NODE_ENV
  if(filePath.startsWith("fb:")){
    isDevelopment=false;
  }
  if(isDevelopment){
    return new Promise(res=>res("/_file/_fb/" + filePath))

  }else{
    let newfilePath="docs/"+filePath.replace("fb:","")
    const storage = getStorage(app);
    const storageRef = ref(storage, newfilePath);
    return getDownloadURL(storageRef);
  }
  
  //.then(d=>display(html`<a class="ui button" download href="${d}"> ${x.name}
}
