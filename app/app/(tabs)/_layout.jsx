import { View, Text, TouchableOpacity, Modal, TouchableWithoutFeedback } from 'react-native';
import React, { useState } from 'react';
import { Tabs, router, useNavigation, usePathname } from 'expo-router';
import { Feather, Entypo, AntDesign, FontAwesome5, FontAwesome } from '@expo/vector-icons';
import AuthCheck from '../../components/AuthCheck';


// Modal content component
const ModalContent = ({ onClose }) => {
  return (
    <TouchableWithoutFeedback onPress={onClose}>
      <View className="flex-1 relative" >
        <View
          className="flex-1 w-full h-1/3 bg-lightGrayColor2 absolute bottom-[80] rounded-t-xl border-2 border-gray-300"
          style={{ shadowColor: "rgba(0,0,0,0.3)", elevation: 4, shadowOffset: -20 }}
        >
          <View className="w-full flex-1 flex-row justify-between p-2">
            <TouchableOpacity
              onPress={() => {
                onClose()
                router.push('/create')
              }}
              className="w-1/2 rounded-lg justify-center items-center bg-purple-600 border-2 border-lightGrayColor2"
            >
              <FontAwesome5 name="photo-video" size={28} color="white" />
              <Text className="text-2xl font-psemibold mt-3 text-white">Posts</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                onClose()
                router.push('/createReels')
              }}
              className="w-1/2 rounded-lg justify-center items-center bg-greenColor border-2 border-lightGrayColor2"
            >
              <FontAwesome name="video-camera" size={28} color="white" />
              <Text className="text-2xl font-psemibold mt-3 text-white">Threels</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};

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

  const navigation = useNavigation()
  const [modalVisible, setModalVisible] = useState(false)
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
          name="search"
          options={{
            headerShown: false,
            href: null,
            title: "Search",
            tabBarIcon: ({ color, focused }) => (
              <TabIcon icon={<Feather name="search" size={24} color={color} />} color={color} focused={focused} name={"Search"} />
            ),
          }}
        />

        <Tabs.Screen
          name="create"
          options={{
            headerShown: true,
            title: "Create post",
            tabBarButton: (props) => (
              <TouchableOpacity {...props} onPress={() => setModalVisible(true)} className="mb-3">
                <View className="flex items-center justify-center w-12 h-12 rounded-full bg-purpleColor">
                  <AntDesign name="plus" size={24} color="#fff" />
                </View>
              </TouchableOpacity>
            ),
            headerTitleStyle: {
              fontFamily: "Poppins-SemiBold",
              fontSize: 25,
            },
            headerLeft: () => (
              <TouchableOpacity onPress={() => navigation.goBack()} className="ml-2">
                <View className="flex items-center justify-center w-12 h-12">
                  <AntDesign name="arrowleft" size={24} color="#000" />
                </View>
              </TouchableOpacity>
            )
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

        <Tabs.Screen
          name="chats"
          options={{
            headerShown: false,
            href: null,
            title: "Chats",
            tabBarIcon: ({ color, focused }) => (
              <TabIcon icon={<Entypo name="chat" size={24} color={color} />} color={color} focused={focused} name={"Chats"} />
            ),
          }}
        />

        <Tabs.Screen
          name="createReels"
          options={{
            href: null,
            title: "Create threels",
            headerTitleStyle: {
              fontFamily: "Poppins-SemiBold",
              fontSize: 25,
            },
            headerLeft: () => (
              <TouchableOpacity onPress={() => navigation.goBack()} className="ml-2">
                <View className="flex items-center justify-center w-12 h-12">
                  <AntDesign name="arrowleft" size={24} color="#000" />
                </View>
              </TouchableOpacity>
            )
          }}
        />
      </Tabs>

      {/* Modal for 'Create' tab */}
      {modalVisible && (
        <Modal
          transparent={true}
          visible={modalVisible}
          animationType="fade"
          onRequestClose={() => setModalVisible(false)}
        >
          <ModalContent onClose={() => setModalVisible(false)} />
        </Modal>
      )}
    </AuthCheck>
  );
};

export default TabsLayout;