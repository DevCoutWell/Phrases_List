<<<<<<< HEAD
import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.6.6/firebase-app.js'
import { getFirestore, collection, doc, getDoc, setDoc, addDoc, onSnapshot, query, where } from 'https://www.gstatic.com/firebasejs/9.6.6/firebase-firestore.js'
import { getAuth, GoogleAuthProvider, onAuthStateChanged, signOut, signInWithRedirect, getRedirectResult, signInWithPopup } from 'https://www.gstatic.com/firebasejs/9.6.6/firebase-auth.js'

const firebaseConfig = {
  apiKey: 'AIzaSyB96AD9SHGM2BsfDULvmxIPMCSGt2SPoXY',
  authDomain: 'movies-phrases.firebaseapp.com',
  projectId: 'movies-phrases',
  storageBucket: 'movies-phrases.firebasestorage.app',
  messagingSenderId: '481796192394',
  appId: '1:481796192394:web:7f078ca3abc84b0cb81573',
  measurementId: 'G-D91Q2V11RB'

};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app)
const db = getFirestore(app)
const collectionPhrases = collection(db, "phrases")
const formAddPhrase = document.querySelector('[data-js="add-phrase-form"]')
const buttonLogin = document.querySelector('[data-js="button-form"]')
const phrasesList = document.querySelector('[data-js="phrases-list"]')
const buttonlogoutUser = document.querySelector('[data-js="logout"]')
const accountDetailsContainer = document.querySelector('[data-js="account-details"]')
const accountDetails = document.createElement('p')


const to = promise => promise
  .then(result => [null, result])
  .catch(error => [error])


const login = async () => {

  const provider = new GoogleAuthProvider()
  const [error] = await to(signInWithPopup(auth, provider))

  M.Modal.getInstance(document.querySelector('[data-modal="login"]')).close()

  if (error) {
    alert('Ocorreu um erro ao realizar Login.')

  }

}

const logoutUser = async unsubscribe => {

  const [error] = await to(signOut(auth))

  if (error) {
    alert(`Logout error: ${error}`)
    return
  }

  unsubscribe()
}

const closeModalAddPhrase = () => {
  const modalAddPhrase = document.querySelector('[data-modal="add-phrase"]')
  M.Modal.getInstance(modalAddPhrase).close()
}

const addPhrase = async (e, user) => {

  e.preventDefault()

  const [error] = await to(addDoc(collectionPhrases, {
    movieTitle: DOMPurify.sanitize(e.target.title.value),
    phrase: DOMPurify.sanitize(e.target.phrase.value),
    idUser: user.uid
  }))

  if (error) {
    alert('Ocorreu um erro ao adicionar Frase')
    return
  }
  e.target.reset()
  closeModalAddPhrase()
  
}

const initCollapsibles = (collapsibles) => M.Collapsible.init(collapsibles)

const handleParagraphMessageLogin = () => {

  const phrasesContainer = document.querySelector('[data-js="phrases-container"]')
  const loginMessage = document.createElement('h5')

  loginMessage.textContent = 'Faça login para ver as frases'
  loginMessage.classList.add('center-align', 'white-text')
  loginMessage.setAttribute('data-js', 'login-message')
  phrasesContainer.append(loginMessage)
}

const renderLinks = ({ userExists }) => {
  const lis = [...document.querySelector('[data-js="nav-ul"]').children]

  lis.forEach(li => {
    const liShouldBeVisible = li.dataset.js.includes(userExists ? 'logged-in' : 'logged-out')

    if (liShouldBeVisible) {
      li.classList.remove('hide')
      return
    }
    li.classList.add('hide')
  })
}

const handleAnonymousUser = () => {
  formAddPhrase.onsubmit = null
  buttonLogin.addEventListener('click', login)
  buttonlogoutUser.onclick = null
  phrasesList.innerHTML = ''
  accountDetailsContainer.innerHTML = ''
}

const removeLParagraphMessagelogin = () => {
  const loginMessageExists = document.querySelector('[data-js="login-message"]')
  loginMessageExists?.remove()
}

const createRegistrationUserDb = async (user) => {
const userDocRef = doc(db, 'users', user.uid)
  const [error, docSnapshot] = await to(getDoc(userDocRef))

  if(error){
    alert('Ocorreu um erro ao tentar registrar Usuário.')
    return
  }

  if (!docSnapshot.exists()) {
    setDoc(userDocRef, {
      name: user.displayName,
      email: user.email,
      userId: user.uid
    })
  }

  
}

const renderPhrases = (user) => {

  const queryPhrases = query(collectionPhrases, where('idUser', '==', user.uid))
  const unsubscribe = onSnapshot(queryPhrases, snapshot => {

    const documentFragment = document.createDocumentFragment()

    snapshot.docChanges().forEach(docChange => {


      const liPhrase = document.createElement('li')
      const movieTitleContainer = document.createElement('div')
      const moviePhraseContainer = document.createElement('div')
      const { movieTitle, phrase } = docChange.doc.data()


      movieTitleContainer.textContent = DOMPurify.sanitize(movieTitle)
      moviePhraseContainer.textContent = DOMPurify.sanitize(phrase)
      movieTitleContainer.setAttribute('class', 'collapsible-header blue-grey-text text-lighten-5 blue-grey darken-4')
      moviePhraseContainer.setAttribute('class', 'collapsible-body blue-grey-text text-lighten-5 blue-grey darken-3')
      movieTitleContainer.innerHTML += `<i class="fa-solid fa-chevron-down"></i>`
      liPhrase.append(movieTitleContainer, moviePhraseContainer)
      documentFragment.append(liPhrase)
    })

    phrasesList.append(documentFragment)

  })

  return unsubscribe
}

const handleSignedUser = (user) => {

  createRegistrationUserDb(user)
  formAddPhrase.onsubmit = e => addPhrase(e, user)
  buttonLogin.removeEventListener('click', login)

  const unsubscribe = renderPhrases(user)

  buttonlogoutUser.onclick = () => logoutUser(unsubscribe)

  accountDetails.textContent = `${user.displayName} | ${user.email}`
  accountDetailsContainer.append(accountDetails)

}

const handleAuthStateChanged = async user => {

  renderLinks({ userExists: !!user })
  removeLParagraphMessagelogin()

  if (!user) {
    handleParagraphMessageLogin()
    handleAnonymousUser()
    return
  }

  handleSignedUser({
    displayName: DOMPurify.sanitize(user.displayName),
    email: DOMPurify.sanitize(user.email),
    uid: DOMPurify.sanitize(user.uid)
  })

  initCollapsibles(phrasesList)

}

const initModals = () => {
  const modals = document.querySelectorAll('[data-js="modal"]')
  M.Modal.init(modals)

}

onAuthStateChanged(auth, handleAuthStateChanged)
initModals()




=======
import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.6.6/firebase-app.js'
import { getFirestore, collection, doc, getDoc, setDoc, addDoc, onSnapshot, query, where } from 'https://www.gstatic.com/firebasejs/9.6.6/firebase-firestore.js'
import { getAuth, GoogleAuthProvider, onAuthStateChanged, signOut, signInWithRedirect, getRedirectResult, signInWithPopup } from 'https://www.gstatic.com/firebasejs/9.6.6/firebase-auth.js'

const firebaseConfig = {
  apiKey: 'AIzaSyB96AD9SHGM2BsfDULvmxIPMCSGt2SPoXY',
  authDomain: 'movies-phrases.firebaseapp.com',
  projectId: 'movies-phrases',
  storageBucket: 'movies-phrases.firebasestorage.app',
  messagingSenderId: '481796192394',
  appId: '1:481796192394:web:7f078ca3abc84b0cb81573',
  measurementId: 'G-D91Q2V11RB'

};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app)
const db = getFirestore(app)
const collectionPhrases = collection(db, "phrases")
const formAddPhrase = document.querySelector('[data-js="add-phrase-form"]')
const buttonLogin = document.querySelector('[data-js="button-form"]')
const phrasesList = document.querySelector('[data-js="phrases-list"]')
const buttonlogoutUser = document.querySelector('[data-js="logout"]')
const accountDetailsContainer = document.querySelector('[data-js="account-details"]')
const accountDetails = document.createElement('p')


const to = promise => promise
  .then(result => [null, result])
  .catch(error => [error])


const login = async () => {

  const provider = new GoogleAuthProvider()
  const [error] = await to(signInWithPopup(auth, provider))

  M.Modal.getInstance(document.querySelector('[data-modal="login"]')).close()

  if (error) {
    alert('Ocorreu um erro ao realizar Login.')

  }

}

const logoutUser = async unsubscribe => {

  const [error] = await to(signOut(auth))

  if (error) {
    alert(`Logout error: ${error}`)
    return
  }

  unsubscribe()
}

const closeModalAddPhrase = () => {
  const modalAddPhrase = document.querySelector('[data-modal="add-phrase"]')
  M.Modal.getInstance(modalAddPhrase).close()
}

const addPhrase = async (e, user) => {

  e.preventDefault()

  const [error] = await to(addDoc(collectionPhrases, {
    movieTitle: DOMPurify.sanitize(e.target.title.value),
    phrase: DOMPurify.sanitize(e.target.phrase.value),
    idUser: user.uid
  }))

  if (error) {
    alert('Ocorreu um erro ao adicionar Frase')
    return
  }
  e.target.reset()
  closeModalAddPhrase()
  
}

const initCollapsibles = (collapsibles) => M.Collapsible.init(collapsibles)

const handleParagraphMessageLogin = () => {

  const phrasesContainer = document.querySelector('[data-js="phrases-container"]')
  const loginMessage = document.createElement('h5')

  loginMessage.textContent = 'Faça login para ver as frases'
  loginMessage.classList.add('center-align', 'white-text')
  loginMessage.setAttribute('data-js', 'login-message')
  phrasesContainer.append(loginMessage)
}

const renderLinks = ({ userExists }) => {
  const lis = [...document.querySelector('[data-js="nav-ul"]').children]

  lis.forEach(li => {
    const liShouldBeVisible = li.dataset.js.includes(userExists ? 'logged-in' : 'logged-out')

    if (liShouldBeVisible) {
      li.classList.remove('hide')
      return
    }
    li.classList.add('hide')
  })
}

const handleAnonymousUser = () => {
  formAddPhrase.onsubmit = null
  buttonLogin.addEventListener('click', login)
  buttonlogoutUser.onclick = null
  phrasesList.innerHTML = ''
  accountDetailsContainer.innerHTML = ''
}

const removeLParagraphMessagelogin = () => {
  const loginMessageExists = document.querySelector('[data-js="login-message"]')
  loginMessageExists?.remove()
}

const createRegistrationUserDb = async (user) => {
const userDocRef = doc(db, 'users', user.uid)
  const [error, docSnapshot] = await to(getDoc(userDocRef))

  if(error){
    alert('Ocorreu um erro ao tentar registrar Usuário.')
    return
  }

  if (!docSnapshot.exists()) {
    setDoc(userDocRef, {
      name: user.displayName,
      email: user.email,
      userId: user.uid
    })
  }

  
}

const renderPhrases = (user) => {

  const queryPhrases = query(collectionPhrases, where('idUser', '==', user.uid))
  const unsubscribe = onSnapshot(queryPhrases, snapshot => {

    const documentFragment = document.createDocumentFragment()

    snapshot.docChanges().forEach(docChange => {


      const liPhrase = document.createElement('li')
      const movieTitleContainer = document.createElement('div')
      const moviePhraseContainer = document.createElement('div')
      const { movieTitle, phrase } = docChange.doc.data()


      movieTitleContainer.textContent = DOMPurify.sanitize(movieTitle)
      moviePhraseContainer.textContent = DOMPurify.sanitize(phrase)
      movieTitleContainer.setAttribute('class', 'collapsible-header blue-grey-text text-lighten-5 blue-grey darken-4')
      moviePhraseContainer.setAttribute('class', 'collapsible-body blue-grey-text text-lighten-5 blue-grey darken-3')
      movieTitleContainer.innerHTML += `<i class="fa-solid fa-chevron-down"></i>`
      liPhrase.append(movieTitleContainer, moviePhraseContainer)
      documentFragment.append(liPhrase)
    })

    phrasesList.append(documentFragment)

  })

  return unsubscribe
}

const handleSignedUser = (user) => {

  createRegistrationUserDb(user)
  formAddPhrase.onsubmit = e => addPhrase(e, user)
  buttonLogin.removeEventListener('click', login)

  const unsubscribe = renderPhrases(user)

  buttonlogoutUser.onclick = () => logoutUser(unsubscribe)

  accountDetails.textContent = `${user.displayName} | ${user.email}`
  accountDetailsContainer.append(accountDetails)

}

const handleAuthStateChanged = async user => {

  renderLinks({ userExists: !!user })
  removeLParagraphMessagelogin()

  if (!user) {
    handleParagraphMessageLogin()
    handleAnonymousUser()
    return
  }

  handleSignedUser({
    displayName: DOMPurify.sanitize(user.displayName),
    email: DOMPurify.sanitize(user.email),
    uid: DOMPurify.sanitize(user.uid)
  })

  initCollapsibles(phrasesList)

}

const initModals = () => {
  const modals = document.querySelectorAll('[data-js="modal"]')
  M.Modal.init(modals)

}

onAuthStateChanged(auth, handleAuthStateChanged)
initModals()




>>>>>>> c64b5df50216aced01b0e98eaf3805b6649bdd1f
