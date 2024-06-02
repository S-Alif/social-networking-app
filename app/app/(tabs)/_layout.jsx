import { View, Text, TouchableOpacity, Modal, TouchableWithoutFeedback } from 'react-native';
import React, { useState } from 'react';
import { Tabs, router, useNavigation } from 'expo-router';
import { Feather, Entypo, AntDesign, MaterialIcons, FontAwesome5, FontAwesome } from '@expo/vector-icons';


// Modal content component
const ModalContent = ({ onClose }) => {
  return (
    <TouchableWithoutFeedback onPress={onClose}>
      <View className="flex-1 relative">
        <View className="absolute bottom-[80] w-full flex-1 flex-row justify-evenly">
          <TouchableOpacity
            onPress={() => {
              onClose()
              router.push('/create')
            }}
            className="w-16 h-16 rounded-full bg-lightGrayColor2 justify-center items-center border-2 border-gray-300"
            style={{elevation:5, shadowColor:"#000", shadowOpacity:0.3}}
          >
            <FontAwesome5 name="photo-video" size={24} color="black" />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={onClose}
            className="w-16 h-16 rounded-full bg-lightGrayColor2 justify-center items-center border-2 border-gray-300"
            style={{ elevation: 5, shadowColor: "#000", shadowOpacity: 0.3 }}
          >
            <FontAwesome name="video-camera" size={24} color="black" />
          </TouchableOpacity>
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
  const [modalVisible, setModalVisible] = useState(false);

  return (
    <View style={{ flex: 1 }}>
      <Tabs
        screenOptions={{
          tabBarShowLabel: false,
          tabBarActiveTintColor: "#000",
          tabBarInactiveTintColor: "#717477",
          tabBarStyle: {
            backgroundColor: "#F3F6F6",
            borderTopWidth: 1,
            borderTopColor: "#E7E7E7",
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
              <TouchableOpacity onPress={() => navigation.goBack()} className="ml-3">
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
              <TabIcon icon={<Entypo name="video" size={24} color={color} />} color={color} focused={focused} name={"Reels"} />
            ),
          }}
        />

        <Tabs.Screen
          name="chats"
          options={{
            headerShown: false,
            title: "Chats",
            tabBarIcon: ({ color, focused }) => (
              <TabIcon icon={<Entypo name="chat" size={24} color={color} />} color={color} focused={focused} name={"Chats"} />
            ),
          }}
        />
      </Tabs>

      {/* Modal for 'Create' tab */}
      {modalVisible && (
        <Modal transparent={true} visible={modalVisible} animationType="fade" className="absolute top-0 left-0 right-0 bottom-0 bg-red-300">
          <ModalContent onClose={() => setModalVisible(false)} />
        </Modal>
      )}
    </View>
  );
};

export default TabsLayout;