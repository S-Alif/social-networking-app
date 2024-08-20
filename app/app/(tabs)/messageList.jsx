import { View, Text, ScrollView, RefreshControl } from 'react-native'
import React, { useEffect, useState } from 'react'
import TabScreenLayout from '../../components/tabScreenLayout'
import SearchBox from '../../components/searchBox'
import { dataFetcher } from '../../scripts/apiCaller'
import { messageUrl } from '../../scripts/endpoints'

const MessageList = () => {

  const [list, setList] = useState([])
  const [refresh, setRefresh] = useState(false)
  const [page, setPage] = useState(1)
  const limit = 10

  const messageList = async () => {
    let result = await dataFetcher(messageUrl + `/list/${page}/${limit}`)
    setRefresh(false)
    if(result == null || result?.status == 0) return
    setList(result?.data)
  }

  // get the list
  useEffect(() => {

  }, [])

  // on refresh
  const onRefresh = () => {
    setRefresh(true)
    setPage(1)
    messageList()
  }

  // handle scroll
  const handleScroll = ({ nativeEvent }) => {
    const { layoutMeasurement, contentOffset, contentSize } = nativeEvent
    if (layoutMeasurement.height + contentOffset.y >= contentSize.height - 50) {
      refectchPost()
    }
  }

  return (
    <TabScreenLayout>
      <ScrollView
        onScroll={handleScroll}
        scrollEventThrottle={16}
        contentContainerStyle={{paddingBottom: 20}}
        refreshControl={<RefreshControl refreshing={refresh} onRefresh={onRefresh} />}
      >

        {/* search field */}
        <SearchBox />

        {/* list */}
        <View classname="pt-2">

        </View>
      </ScrollView>
    </TabScreenLayout>
  )
}

export default MessageList


const messageListCard = () => {

}