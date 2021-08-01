
import { useApolloClient } from '@apollo/client';
import { ALL_PERSONS } from '../queries';

export const useUpdateCache = () => {
  const client = useApolloClient();
  const updateCacheWith = (addedPerson) => {
    const includedIn = (set, object) =>
      set.map(p => p.id).includes(object.id)

    const dataInStore = client.readQuery({ query: ALL_PERSONS })
    if (!includedIn(dataInStore.allPersons, addedPerson)) {
      client.writeQuery({
        query: ALL_PERSONS,
        data: { allPersons: dataInStore.allPersons.concat(addedPerson) }
      })
    }
  }

  return [updateCacheWith]
}




