import { View, Text } from 'react-native';
import React from 'react';
import { Tabs, usePathname } from 'expo-router';
import { Entypo, Feather } from '@expo/vector-icons';
import AuthCheck from '../../components/AuthCheck';

// Tab icons
const TabIcon = ({ icon, color, name, focused }) => {
  return (
    <View className="items-center justify-center gap-2">
      {icon}
      <Text className={`${focused ? 'font-psemibold' : 'font-pregular'} text-xs`} style={{ color: color }}>{name}</Text>
    </View>
  );
};

const TabsLayout = () => {

  const pathname = usePathname()
  const isReelsScreen = pathname == '/reels'

  return (
    <AuthCheck>
      <Tabs
        screenOptions={{
          tabBarShowLabel: false,
          tabBarActiveTintColor: isReelsScreen ? "#fff" : "#000",
          tabBarInactiveTintColor: "#717477",
          tabBarStyle: {
            backgroundColor: isReelsScreen ? "#000" : "#F3F6F6",
            borderTopWidth: 1,
            borderTopColor: isReelsScreen ? "#717477" : "#E7E7E7",
            height: 70,
          },
        }}
      >
        <Tabs.Screen
          name="home"
          options={{
            headerShown: false,
            title: "Home",
            tabBarIcon: ({ color, focused }) => (
              <TabIcon icon={<Feather name="home" size={24} color={color} />} color={color} focused={focused} name={"Home"} />
            ),
          }}
        />

        <Tabs.Screen
          name="createPost"
          options={{
            headerShown: true,
            title: "Create post",
            headerTitleStyle: {
              fontFamily: "Poppins-SemiBold",
              fontSize: 25,
            },
            tabBarIcon: ({ color, focused }) => (
              <TabIcon icon={<Feather name="plus" size={24} color={color} />} color={color} focused={focused} name={"Create post"} />
            ),
          }}
        />

        <Tabs.Screen
          name="reels"
          options={{
            headerShown: false,
            title: "Reels",
            tabBarIcon: ({ color, focused }) => (
              <TabIcon icon={<Entypo name="video" size={24} color={color} />} color={color} focused={focused} name={"Threels"} />
            ),
          }}
        />


      </Tabs>
    </AuthCheck>
  );
};

export default TabsLayout;