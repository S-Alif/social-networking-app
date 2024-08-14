import { View, Text, ScrollView } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useLocalSearchParams } from 'expo-router'
import { dataFetcher } from './../../scripts/apiCaller';
import { userUrl } from '../../scripts/endpoints';
import FriendListCard from '../../components/friendListCard';

const BuddySearchResult = () => {

  const params = useLocalSearchParams()

  const [users, setUsers] = useState([])
  const [searchText, setSearchText] = useState("")
  const [page, setPage] = useState(1)
  const [count, setCount] = useState(0)
  const limit = 20

  useEffect(() => {
    (async () => {
      let url = userUrl + `/search-user/${params?.searchText}/${page}/${limit}`
      if (searchText != "") url = userUrl + `/search-user/${searchText}/${page}/${limit}`

      let result = await dataFetcher(url)
      if(result == null || result?.status == 0) return
      setUsers(prev => [...prev, ...result?.data?.profiles])
      setCount(result?.data?.totalCount)
    })()
  }, [page])

  // next page
  const pagination = () => {
    if ((page * limit) >= count) return
    setPage(prev => prev + 1)
  }
  

  return (
    <View className="flex-1 bg-lightGrayColor px-2">
      <ScrollView contentContainerStyle={{paddingBottom: 20}}>
        {
          users.length > 0 && 
            users.map((e, index) => (
              <FriendListCard data={e} key={index} />
            ))
        }
      </ScrollView>
    </View>
  )
}

export default BuddySearchResult