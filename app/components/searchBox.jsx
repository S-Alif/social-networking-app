import { View, TextInput } from 'react-native'
import React, { useState } from 'react'
import { FontAwesome } from '@expo/vector-icons'
import CustomButton from './CustomButton';
import { router, usePathname } from 'expo-router';

const SearchBox = ({setSearchValue, initialValue}) => {

  const [searchText, setSearchText] = useState(initialValue ? initialValue : "")
  const pathname = usePathname()

  return (
    <View className="py-3 w-full h-[104px]">
      <View className="bg-lightGrayColor2 p-3 rounded-md flex-1 flex-row justify-between border border-gray-300">
        <TextInput
          placeholder='Search a buddy'
          className="border border-darkGrayColor px-2 py-3 rounded-md font-pmedium text-xl focus:border-purpleColor flex-grow"
          cursorColor={"#6835F0"}
          value={searchText}
          onChangeText={setSearchText}
        />

        <CustomButton
          title={<FontAwesome name="search" size={24} color="white" />}
          handlePress={() => {
            if (searchText?.length <= 2) return
            if (pathname == "/home") {
              router.push({ pathname: "/pages/buddySearchResult", params: { searchText: searchText } })
            }
            else{
              setSearchValue(searchText)
            }
            setSearchText("")
          }}
          containerStyles={"bg-purpleColor w-[50px] h-[53px] rounded-md ml-2"}
          textStyles={"text-lightGrayColor2 text-xl font-pmedium pl-1"}
        />
      </View>
    </View>
  )
}

export default SearchBox