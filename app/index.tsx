import { Audio } from "expo-av";
import * as Linking from "expo-linking";
import { useEffect, useRef } from "react";
import { Text, View } from "react-native";

const RADIO_URL = "https://icecast.live.yle.fi/radio/YleRS/icecast.audio";

export default function App() {
  const played = useRef(false); // Estää toiston useaan kertaan

  useEffect(() => {
    const playRadio = async () => {
      if (played.current) return;
      played.current = true;

      try {
        await Audio.requestPermissionsAsync();
        await Audio.setAudioModeAsync({
          staysActiveInBackground: true,
          playsInSilentModeIOS: true,
          shouldDuckAndroid: true,
          allowsRecordingIOS: false,
        });

        const { sound } = await Audio.Sound.createAsync(
          { uri: RADIO_URL },
          { shouldPlay: true }
        );

        // Varmistetaan että ääni pysyy muistissa
        sound.setOnPlaybackStatusUpdate(status => {
          if (status.isLoaded && status.didJustFinish) {
          }
        });
      } catch (error) {
        console.error("Virhe radion toistossa:", error);
      }
    };

    const handleURL = ({ url }: { url: string }) => {
      const { hostname } = Linking.parse(url);
      if (hostname === "play") {
        playRadio();
      }
    };

    // Käynnistetään toisto aina kun sovellus avataan
    playRadio();

    // Tuki shortcut-linkeille
    Linking.getInitialURL().then(url => {
      if (url) handleURL({ url });
    });

    const sub = Linking.addEventListener("url", handleURL);
    return () => sub.remove();
  }, []);

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>Yle Radio Suomi käynnistyy automaattisesti.</Text>
    </View>
  );
}
