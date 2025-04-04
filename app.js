import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.6.6/firebase-app.js'
import { getFirestore, collection, addDoc, onSnapshot } from 'https://www.gstatic.com/firebasejs/9.6.6/firebase-firestore.js'
import { getAuth, GoogleAuthProvider, onAuthStateChanged, signOut, signInWithRedirect, getRedirectResult } from 'https://www.gstatic.com/firebasejs/9.6.6/firebase-auth.js'


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




const login = async () => {

  try {
    const provider = new GoogleAuthProvider()
    signInWithRedirect(auth, provider)
  } catch (error) {
    console.log(`Login error: ${error}`)
  }
}

const logoutUser = async unsubscribe => {

  try {

    await signOut(auth)
    unsubscribe()

  } catch (error) {
    console.log(`Logout error: ${error}`)
  }

}

const addPhrase = async e => {

  e.preventDefault()

  try {
    const addedDoc = await addDoc(collectionPhrases, {
      movieTitle: DOMPurify.sanitize(e.target.title.value),
      phrase: DOMPurify.sanitize(e.target.phrase.value)
    })

    console.log('Document adicionado com o ID:', addedDoc.id)

    e.target.reset()
    const modalAddPhrase = document.querySelector('[data-modal="add-phrase"]')
    M.Modal.getInstance(modalAddPhrase).close()

  } catch (error) {
    console.log('erro de adição', error)
  }
}

const initCollapsibles = (collapsibles) => M.Collapsible.init(collapsibles)



const handleAuthStateChanged = async user => {


  try {
    const result = await getRedirectResult(auth)
    console.log(result)
  } catch (error) {
    console.log('Login Redirect: ', error)
  }

  const lis = [...document.querySelector('[data-js="nav-ul"]').children]

  lis.forEach(li => {
    const liShouldBeVisible = li.dataset.js.includes(user ? 'logged-in' : 'logged-out')

    if (liShouldBeVisible) {
      li.classList.remove('hide')
      return
    }
    li.classList.add('hide')
  })

  const loginMessageExists = document.querySelector('[data-js="login-message"]')
  loginMessageExists?.remove()

  const formAddPhrase = document.querySelector('[data-js="add-phrase-form"]')
  const buttonLogin = document.querySelector('[data-js="button-form"]')
  const phrasesList = document.querySelector('[data-js="phrases-list"]')
  const buttonlogoutUser = document.querySelector('[data-js="logout"]')
  const accountDetailsContainer = document.querySelector('[data-js="account-details"]')
  const accountDetails = document.createElement('p')




  if (!user) {


    const phrasesContainer = document.querySelector('[data-js="phrases-container"]')
    const loginMessage = document.createElement('h5')

    loginMessage.textContent = 'Faça login para ver as frases'
    loginMessage.classList.add('center-align', 'white-text')
    loginMessage.setAttribute('data-js', 'login-message')
    phrasesContainer.append(loginMessage)

    formAddPhrase.removeEventListener('submit', addPhrase)
    buttonLogin.addEventListener('click', login)
    buttonlogoutUser.onclick = null
    phrasesList.innerHTML = ''
    accountDetailsContainer.innerHTML = ''
    return
  }

  formAddPhrase.addEventListener('submit', addPhrase)
  buttonLogin.removeEventListener('click', login)

  const unsubscribe = onSnapshot(collectionPhrases, snapshot => {

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

  buttonlogoutUser.onclick = () => logoutUser(unsubscribe)

  accountDetails.textContent = DOMPurify.sanitize(`${user.displayName} | ${user.email}`)
  accountDetailsContainer.append(accountDetails)
  initCollapsibles(phrasesList)

}


const initModals = () => {
  const modals = document.querySelectorAll('[data-js="modal"]')
  M.Modal.init(modals)

}

onAuthStateChanged(auth, handleAuthStateChanged)
initModals()




