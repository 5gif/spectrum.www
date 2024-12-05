import { firebaseConfig } from "./firebasecfg.7be27679.js";
// import { initializeApp } from "firebase/app";
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js"
import * as d3 from "../../_npm/d3@7.9.0/7055d4c5.js"
// import { getApp } from import.meta.resolve("firebase/app");
// const {getApp}=await import(import.meta.resolve("firebase/app"))
// If you enabled Analytics in your project, add the Firebase SDK for Google Analytics
//  import { getAnalytics } from 'https://www.gstatic.com/firebasejs/11.0.1/firebase-analytics.js'
// Add Firebase products that you want to use
import { getAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  EmailAuthProvider } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js"
// import { getFirestore } from 'https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js'
import {
  deleteObject,
  getDownloadURL,
  getStorage,
  ref,
  getMetadata,
  uploadBytes,
  listAll,
} from "https://www.gstatic.com/firebasejs/11.0.1/firebase-storage.js";

export function getFilesLists(path) {
  const storage = getStorage(app);
  const listref = ref(storage, path);
  return listAll(listref);
}

export default {
  showLogin,
  upload,
};

export function defStorage() {
  return getStorage(app);
}

function returnEmpty(obj){
return new Promise(res=>res(obj))
}

export function loadJSON(filename, d3Options) {
  return getURL(filename).then((url) => url==""?returnEmpty([]):d3.json(url, d3Options))
}

export function loadCSV(filename, d3csvOptions) {

   return getURL(filename).then((url) =>  url==""?returnEmpty([]):d3.csv(url, d3csvOptions))
}

export function getInfo(filename) {
  const storage = getStorage(app);
  const storageRef = ref(storage, "docs/" + filename);
  return getMetadata(storageRef);
}

export function getURL(filename) {
  // "package.json"
  const storage = getStorage(app);
  const storageRef = ref(storage, "docs/" + filename);
  return getDownloadURL(storageRef).catch((error) => {
    // Handle any errors
    return returnEmpty("")
    // return  new Promise((res,rej)=>rej("Error getting URL"))
  });;
  //.then(d=>display(html`<a class="ui button" download href="${d}"> ${x.name}
}

export function deleteFile(filename) {
  const storage = getStorage(app);
  filename = "docs/" + filename;
  const storageRef = ref(storage, filename);
  return deleteObject(storageRef)
    .then(() => {
      // File deleted successfully
      console.log("Deleted", filename);
    })
    .catch((error) => {
      // Uh-oh, an error occurred!
    });
}

export function upload(databyte, filename) {
  const storage = getStorage(app);
  const storageRef = ref(storage, filename);
  // console.log("Data "    , databyte);
  uploadBytes(storageRef, databyte).then((snapshot) => {
    console.log("Uploaded a blob or file!", snapshot.metadata, snapshot.ref);
  });
}

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export function logOut() {
  auth.signOut();
}

// console.log("APP Module is ",getApp())

onAuthStateChanged(auth, (user) => {
  if (user) {
    //logged in    
    var mySpan = document.getElementById("userinfo");
    if (mySpan) {
      mySpan.innerText = user.displayName || user.email;
    }

    // user.getIdToken().then(tok=>console.log("ID Token", tok ));
    
    // document.querySelector("#login").classList.add("logout");
    document.querySelector("#login > i").classList.add("green");
    document.querySelector("#userinfo").classList.remove("hidden");
    // document.querySelector("#loginout").text("Logout");
    document.querySelector("#logout").lastChild.textContent = "Log Out";
    document
      .querySelectorAll("[data-user-auth]")
      .forEach((f) => f.classList.remove("disabled"));
  } else {
    var mySpan = document.getElementById("userinfo");
    if (mySpan) {
      mySpan.innerText = "";
    }
    document.querySelector("#login > i").classList.remove("green");
    document.querySelector("#logout").lastChild.textContent = "Sign In";
    document
      .querySelectorAll("[data-user-auth]")
      .forEach((f) => f.classList.add("disabled"));

    // document.querySelector("#login").classList.remove("logout");
  }
});

export function getCurrentUser() {
  return new Promise((resolve) => {

    onAuthStateChanged(auth, async (user) => {
      if (user) {
        
        resolve(user);
      } else {        
          resolve(null);        
      }
    });
    
  });
  //   return firebase.auth().currentUser;
  // return getAuth(app).currentUser;
}
// FirebaseUI config.
var uiConfig = {
  signInSuccessUrl: "",
  signInOptions: [
    {
      provider: EmailAuthProvider.PROVIDER_ID,
      disableSignUp: {
        status: true,
        adminEmail: "contact@5gindiaforum.in",
        helpLink: "/join5gif",
      },
    },
    // firebase.auth.GoogleAuthProvider.PROVIDER_ID,
    // Leave the lines as is for the providers you want to offer your users.
    // firebase.auth.EmailAuthProvider.PROVIDER_ID,
    // {
    //     provider: 'microsoft.com',
    //     providerName: 'Microsoft',
    //     // To override the full label of the button.
    //     // fullLabel: 'Login with Microsoft',
    //     buttonColor: '#2F2F2F',
    //     // iconUrl: '<icon-url-of-sign-in-button>',
    //     loginHintKey: 'login_hint',
    //     customParameters: {
    //       prompt: 'consent'
    //     }
    //   }
  ],
  signInFlow: "popup",
  // tosUrl and privacyPolicyUrl accept either url string or a callback
  // function.
  // Terms of service url/callback.
  tosUrl: "<your-tos-url>",
  // Privacy policy url/callback.
};

// var ui =
//   firebaseui.auth.AuthUI.getInstance() ||
//   new firebaseui.auth.AuthUI(getAuth(app));

export function showLogin(elemID, userinfo) {
  // Initialize the FirebaseUI Widget using Firebase.
  // ui =     firebaseui.auth.AuthUI.getInstance() ||    new firebaseui.auth.AuthUI(getAuth(app));
  
    // ui = new firebaseui.auth.AuthUI(firebase.auth());
  // The start method will wait until the DOM is loaded.
  //   document.querySelector("elemID").style.set("display", "block");
  document.querySelector(elemID).hidden = false;
  console.log("do something..");
  function fnCallback(currentUser, credential, redirectUrl) {
    var mySpan = document.querySelector(userinfo);
    // console.log("element info = ", userinfo, mySpan);
    if (mySpan) {      
      // Now you can set the inner text
      mySpan.innerText = currentUser.displayName || currentUser.email;
      console.log(currentUser, credential, redirectUrl);
      document.querySelector("#login i").classList.add("green");      
      document.querySelector("#userinfo").classList.remove("hidden");      
      //   document.querySelector("#loginform").hidden = true;
      //   document.getElementById("loginform").style["display"] = "none";
      return false;
    }
  }
  // signInSuccess: function(currentUser, credential, redirectUrl) {
  //     const userId = currentUser.uid;
  //     redirectUrl = `/users/${userId}`;
  //     return false
  //   },

  //   signInSuccess: fnCallback,
  uiConfig.callbacks = {
    // signInSuccessWithAuthResult: fnCallback,
    signInSuccessWithAuthResult: function (authResult, redirectUrl) {
      // User successfully signed in.
      // Return type determines whether we continue the redirect automatically
      // or whether we leave that to developer to handle.
      var currentUser = authResult.user;
      var credential = authResult.credential;
      var mySpan = document.querySelector(userinfo);
      console.log("element info = ", authResult, userinfo, mySpan);
      if (mySpan) {
        // Now you can set the inner text
        mySpan.classList.remove("hidden");
        mySpan.innerText = currentUser.displayName || currentUser.email;
        console.log(currentUser, credential, redirectUrl);
        var iconel = document.querySelector("#login > i");
        iconel.classList.add("green");
        // iconel.classList.add("logout");
      }
      $(elemID).modal("hide");
      return false;
    },
    signInFailure: function (error) {
      // For merge conflicts, the error.code will be
      // 'firebaseui/anonymous-upgrade-merge-conflict'.
      //   if (error.code != "firebaseui/anonymous-upgrade-merge-conflict") {
      //     return Promise.resolve();
      //   }
      // The credential the user tried to sign in with.
      //   var cred = error.credential;
      // Copy data from anonymous user to permanent user and delete anonymous
      // user.
      // ...
      // Finish sign-in after data is copied.
      // console.log("Ia m here", error);
      document.querySelector("#login >i").classList.remove("green");
      document.querySelector(userinfo).classList.add("hidden");
      return;
      //   return firebase.auth().signInWithCredential(cred);
    },
  };
  start(elemID, uiConfig);
}

function start(elemID, uiConfig) {
  console.log("About to start logging");
  const formHtml = `   
  
<form id="emailSignInForm" class="myform" >  

    <div class="field">
      <div class="ui left icon input">  
   <i class="envelope outline icon"></i>
   <input type="text" id="email" placeholder="Email">   
</div>            
    </div>
    <div class="field">      
        <div class="ui left icon input">  
   <i class="key icon"></i>
   <input type="password" id="password" name="password" placeholder="Password" >  
</div>          
    </div>       
    <div class="divider ui"></div>
      <div class="field"> 
  <button type="submit" class="ui submit button">Login</button>
  </div>
  <div class="ui error message" hidden></div>
</form>   
  `;

  // Remove the "hidden" attribute from the parent element
  const parentElement = document.querySelector(elemID).parentElement;  

  document.querySelector(elemID).innerHTML = formHtml;

  document.getElementById('emailSignInForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    const auth = getAuth();

    signInWithEmailAndPassword(auth,email, password)
      .then((userCredential) => {
        // Signed in 
        const user = userCredential.user;
        console.log('User signed in:', user);
        if (uiConfig.callbacks && uiConfig.callbacks.signInSuccessWithAuthResult) {
          uiConfig.callbacks.signInSuccessWithAuthResult({user: user}, null);
        }
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.error('Error signing in:', errorCode, errorMessage);
        // Display error message to the user
        const errorElement = document.querySelector(`${elemID} .ui.error.message`);
        if (errorElement) {
          errorElement.textContent = errorMessage;
          errorElement.style.display = 'block';
        }
      });
  });
}
 