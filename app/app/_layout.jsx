import { SplashScreen, Stack, usePathname } from 'expo-router'
import { useFonts } from 'expo-font'
import { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';

SplashScreen.preventAutoHideAsync()

const RootLayout = () => {

  const pathname = usePathname()
  const headerStyles = {
    fontFamily: "Poppins-SemiBold",
    fontSize: 25,
  }

  const [fontsLoaded, error] = useFonts({
    "Poppins-Black": require("../assets/fonts/Poppins-Black.ttf"),
    "Poppins-Bold": require("../assets/fonts/Poppins-Bold.ttf"),
    "Poppins-ExtraBold": require("../assets/fonts/Poppins-ExtraBold.ttf"),
    "Poppins-ExtraLight": require("../assets/fonts/Poppins-ExtraLight.ttf"),
    "Poppins-Light": require("../assets/fonts/Poppins-Light.ttf"),
    "Poppins-Medium": require("../assets/fonts/Poppins-Medium.ttf"),
    "Poppins-Regular": require("../assets/fonts/Poppins-Regular.ttf"),
    "Poppins-SemiBold": require("../assets/fonts/Poppins-SemiBold.ttf"),
    "Poppins-Thin": require("../assets/fonts/Poppins-Thin.ttf"),
    "Courier": require("../assets/fonts/Courier.ttf"),
  })

  // on font loaded or changed
  useEffect(() => {

    if (error) throw error
    if (fontsLoaded) SplashScreen.hideAsync()

  }, [fontsLoaded, error])

  if (!fontsLoaded && !error) return null


  return (
    <>
      <Stack>
        <Stack.Screen name='index' options={{ headerShown: false }} />
        <Stack.Screen name='(auth)' options={{ headerShown: false }} />
        <Stack.Screen name='(tabs)' options={{ headerShown: false }} />
        <Stack.Screen name='pages' options={{ headerShown: false }} />
        <Stack.Screen name='notifications' options={{ headerTitle: "Notifications", headerTitleStyle: headerStyles }} />
      </Stack>
      <StatusBar style={pathname == "/reels" ? "light" : "dark"} />
    </>
  )
}

export default RootLayout