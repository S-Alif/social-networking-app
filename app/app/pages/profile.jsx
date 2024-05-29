import { View, Text, Image, ScrollView, FlatList } from 'react-native'
import React, { useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context';
import authStore from '../../constants/authStore';
import { formatDate } from '../../scripts/dateFormatter';
import { dataFetcher } from '../../scripts/apiCaller';
import PostCards from '../../components/postCards';
import { postUrl } from '../../scripts/endpoints';

const Profile = () => {

  const { profile } = authStore()
  const [posts, setPosts] = useState([])
  const [amount, setAmount] = useState({})
  const [page, setPage] = useState(1)

  useEffect(() => {
    (async () => {
      let result = await dataFetcher(`${postUrl}/posts/user/${page}/10`)
      let result2 = await dataFetcher(`${postUrl}/amounts/user`)
      if (result2 != null) {
        setPosts(prev => [...prev, ...result?.data])
        setAmount(result2?.data)
      }
    })()
  }, [])


  return (
    <View className="flex-1 bg-lightGrayColor">

      <FlatList 
        data={posts}
        keyExtractor={(item) => item._id}
        renderItem={({item}) => (
          <View className="mx-2">
            <PostCards post={item} />
          </View>
        )}
        ListHeaderComponent={() => (
          <View className="flex-1">
            <View className="flex-1 w-full h-[250px]">
              <Image source={{uri: profile?.profileCover}} className="w-full h-full object-cover" />
            </View>
            
            {/* profile data */}
            <View className="flex-1 w-full min-h-[300px] bg-lightGrayColor2 relative">
              {/* profile image */}
              <View className="w-[100px] h-[100px] mx-auto top-[-50px] border-4 border-lightGrayColor2 rounded-full">
                <Image source={{ uri: profile?.profileImg }} className="w-full h-full object-cover rounded-full" />
              </View>
              {/* profile data */}
              <View className="flex items-center top-[-30px]">
                <Text className="text-2xl font-pbold">{profile?.firstName} {profile?.lastName}</Text>
                <Text className="text-xl font-pmedium text-grayColor">{profile?.city}, {profile?.country}</Text>
              </View>

              {/* show amounts */}
              <View className="flex-1 flex-row justify-around items-center border-y-2 border-y-gray-300">

                <View className="items-center w-1/2 border-r border-r-gray-300">
                  <Text className="text-5xl font-psemibold pt-2">{amount?.friends}</Text>
                  <Text className="text-[15px] font-pmedium">Buddies</Text>
                </View>
                <View className="items-center w-1/2">
                  <Text className="text-5xl font-psemibold pt-2">{amount?.posts}</Text>
                  <Text className="text-[15px] font-pmedium">Posts</Text>
                </View>

              </View>

            </View>

          </View>
        )}
        
        ListEmptyComponent={() => (
          <Text>No posts found</Text>
        )}

      />

    </View>
  )
}

export default Profile