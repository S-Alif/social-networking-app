import { View, Text } from 'react-native'
import React from 'react'
import { Tabs } from 'expo-router'
import { Feather, Entypo } from '@expo/vector-icons';


const TabIcon = ({ icon, color, name, focused }) => {
  return (
    <View className="items-center justify-center gap-2">
      {icon}
      <Text className={`${focused ? 'font-psemibold' : 'font-pregular'} text-xs`} style={{ color: color }}>{name}</Text>
    </View>
  )
}


const TabsLayout = () => {
  return (
    <Tabs
      screenOptions={{
        tabBarShowLabel: false,
        tabBarActiveTintColor: "#000",
        tabBarInactiveTintColor: "#717477",
        tabBarStyle:{
          backgroundColor: "#F3F6F6",
          borderTopWidth: 1,
          borderTopColor: "#E7E7E7",
          height: 70
        }
      }}
    >
      
      <Tabs.Screen
        name='home'
        options={{
          headerShown:false,
          title: "Home",
          tabBarIcon: ({color, focused}) => (
            <TabIcon icon={<Feather name="home" size={24} color={color} />} color={color} focused={focused} name={"Home"} />
          )
        }}
      />

      <Tabs.Screen
        name='search'
        options={{
          headerShown: false,
          title: "Search",
          tabBarIcon: ({ color, focused }) => (
            <TabIcon icon={<Feather name="search" size={24} color={color} />} color={color} focused={focused} name={"Search"} />
          )
        }}
      />

      <Tabs.Screen
        name='reels'
        options={{
          headerShown: false,
          title: "Reels",
          tabBarIcon: ({ color, focused }) => (
            <TabIcon icon={<Entypo name="video" size={24} color={color} />} color={color} focused={focused} name={"Reels"} />
          )
        }}
      />

      <Tabs.Screen
        name='chats'
        options={{
          headerShown: false,
          title: "Chats",
          tabBarIcon: ({ color, focused }) => (
            <TabIcon icon={<Entypo name="chat" size={24} color={color} />} color={color} focused={focused} name={"Chats"} />
          )
        }}
      />

    </Tabs>
  )
}

export default TabsLayout