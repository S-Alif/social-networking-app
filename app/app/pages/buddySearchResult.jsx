import { View, Text, ScrollView } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useLocalSearchParams } from 'expo-router'
import { dataFetcher } from './../../scripts/apiCaller';
import { userUrl } from '../../scripts/endpoints';
import FriendListCard from '../../components/friendListCard';
import CustomButton from '../../components/CustomButton';
import { Entypo } from '@expo/vector-icons';
import SearchBox from '../../components/searchBox';

const BuddySearchResult = () => {

  const params = useLocalSearchParams()

  const [users, setUsers] = useState([])
  const [searchText, setSearchText] = useState("")
  const [page, setPage] = useState(1)
  const [count, setCount] = useState(0)
  const limit = 20

  // search function
  const searchFunction = async (searchText) => {
    let url = userUrl + `/search-user/${searchText}/${page}/${limit}`
    let result = await dataFetcher(url)
    if (result == null || result?.status == 0) return
    setUsers(prev => [...prev, ...result?.data?.profiles])
    setCount(result?.data?.totalCount)
  }

  // search text from params
  useEffect(() => {
    (async () => {
      if(searchText == "") return await searchFunction(params?.searchText)
      searchFunction(searchText)
    })()
  }, [page, searchText])

  // call for search function for search text
  useEffect(() => {
    setUsers([])
  }, [searchText])


  // next page
  const pagination = () => {
    if ((page * limit) >= count) return
    setPage(prev => prev + 1)
  }
  

  return (
    <View className="flex-1 bg-lightGrayColor">
      <ScrollView contentContainerStyle={{ paddingBottom: 20 }}>
        <View className="pt-3 px-2">

          {/* search box */}
          <SearchBox setSearchValue={setSearchText} initialValue={params?.searchText ? params?.searchText : ""} />

          {/* display users */}
          {
            users.length > 0 &&
            users.map((e, index) => (
              <FriendListCard data={e} key={index} />
            ))
          }

          {
            (page * limit) < count &&
            <CustomButton
              title={"See more"}
              handlePress={pagination}
              containerStyles={"bg-purpleColor min-h-[50] mt-5"}
              textStyles={"text-lightGrayColor2 text-xl font-pmedium"}
            />
          }
          {
            (page * limit) >= count && <Text className="text-center pt-5"><Entypo name="dots-three-horizontal" size={24} color="black" /></Text>
          }
        </View>
      </ScrollView>
    </View>
  )
}

export default BuddySearchResult