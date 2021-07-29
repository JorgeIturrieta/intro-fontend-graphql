import React ,{useState} from 'react'
import {  useQuery,useApolloClient } from '@apollo/client';
import { Persons } from './components/Persons';
import { PersonForm } from './components/PersonForm';
import { ALL_PERSONS } from './queries';
import { PhoneForm } from './components/PhoneForm';
import { Notify } from './components/Notify';
import { LoginForm } from './components/LoginForm';
import { Logout } from './components/Logout';




const App = () => {
  const [token, setToken] = useState(null)

  const result = useQuery(ALL_PERSONS)
  const client = useApolloClient() // Objeto client para limpiar la cache 
  const [errorMessage, setErrorMessage] = useState(null)

  
  const notify = (message) => {
    setErrorMessage(message)
    setTimeout(() => {
      setErrorMessage(null)
    }, 7000)
  }

  const logout = async () => {
    setToken(null)
    localStorage.clear()
    await client.resetStore()
  }

  if (result.loading)  {
    return <div>loading...</div>
  }

  if (!token) {
    return (
      <div>
        <Notify errorMessage={errorMessage} />
        <h2>Login</h2>
        <LoginForm
          setToken={setToken}
          setError={notify}
        />
      </div>
    )
  }


  return (
    <>
    <Logout logout={logout} />
    <Notify errorMessage={errorMessage} />
    <Persons persons = {result.data.allPersons} />
    <PersonForm setError={notify}  />
    <PhoneForm  setError={notify}   />
    </>
    
  )
}

export default App