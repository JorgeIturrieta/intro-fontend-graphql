import React, { useState } from 'react'
import { useMutation } from '@apollo/client'
import { CREATE_PERSON } from '../queries'
import { useUpdateCache } from '../hooks/useUpdateCache'


export const PersonForm = ({ setError }) => {
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [street, setStreet] = useState('')
  const [city, setCity] = useState('')
  const [updateCacheWith] = useUpdateCache()
  const [createPerson] = useMutation(CREATE_PERSON, {
    // refetchQueries: [ { query: ALL_PERSONS } ],        
    onError: (error) => {
      setError(error.graphQLErrors[0].message)
    },
    update: (store, response) => {
      // La actualizacion se realiza en la subscripcion cuando se agrega la persona
      // pero se debe verificar de todas formas si existe la persona antes de actualizar
      // para evitar registros duplicados en cache

      // const dataInStore = store.readQuery({ query: ALL_PERSONS })
      // store.writeQuery({
      //   query: ALL_PERSONS,
      //   data: {
      //     ...dataInStore,
      //     allPersons: [ ...dataInStore.allPersons, response.data.addPerson ]
      //   }
      // })
      updateCacheWith(response.data.addPerson)

    }

  })

  const submit = (event) => {
    event.preventDefault()

    createPerson({
      variables: {
        name,
        phone: phone.length > 0 ? phone : null,
        street,
        city
      }
    })

    setName('')
    setPhone('')
    setStreet('')
    setCity('')
  }

  return (
    <div>
      <h2>create new</h2>
      <form onSubmit={submit}>
        <div>
          name <input value={name}
            onChange={({ target }) => setName(target.value)}
          />
        </div>
        <div>
          phone <input value={phone}
            onChange={({ target }) => setPhone(target.value)}
          />
        </div>
        <div>
          street <input value={street}
            onChange={({ target }) => setStreet(target.value)}
          />
        </div>
        <div>
          city <input value={city}
            onChange={({ target }) => setCity(target.value)}
          />
        </div>
        <button type='submit'>add!</button>
      </form>
    </div>
  )
}
