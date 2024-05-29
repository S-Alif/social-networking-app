import { View, Text, FlatList } from 'react-native'
import React, { useEffect, useState } from 'react'
import TabScreenLayout from '../../components/tabScreenLayout'
import { dataFetcher } from './../../scripts/apiCaller';
import { postUrl } from '../../scripts/endpoints';
import PostCards from '../../components/postCards';

const Home = () => {

  const [posts, setPosts] = useState([])
  const [page, setPage] = useState(1)

  // get the posts
  useEffect(() => {
    (async () => {
      let result = await dataFetcher(`${postUrl}/posts/${page}/10`)
      if(result != null){
        setPosts(prev => [...prev, ...result?.data])
      }
    })()
  }, [])


  return (
    <TabScreenLayout>
      <FlatList 
        data={posts}
        keyExtractor={(item) => item._id}
        renderItem={({item}) => (
          <PostCards post={item} />
        )}
      />
    </TabScreenLayout>
  )
}

export default Home