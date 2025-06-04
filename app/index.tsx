import { useEffect, useState } from 'react';
import { Button, StyleSheet, Text, View } from 'react-native';
import TrackPlayer, { Capability, State, usePlaybackState } from 'react-native-track-player';


const RADIO_URL = 'https://icecast.live.yle.fi/radio/YleRS/icecast.audio';

export default function App() {
  
  const playbackState = usePlaybackState();
  const [statusText, setStatusText] = useState('Käynnistetään...');

  useEffect(() => {
    setupPlayer();

    return () => {
      TrackPlayer.reset();
    };
  }, []);

  const setupPlayer = async () => {
    try {
      await TrackPlayer.setupPlayer();
      await TrackPlayer.updateOptions({
        capabilities: [
          Capability.Play,
          Capability.Pause,
        ],
        compactCapabilities: [Capability.Play, Capability.Pause],
        alwaysPauseOnInterruption: true,
      });


      await TrackPlayer.add({
        id: 'yle-radio-suomi',
        url: RADIO_URL,
        title: 'Yle Radio Suomi',
        artist: 'Yle',
      });

      setStatusText('Valmis toistamaan');
    } catch (error) {
      console.error('Virhe soittimen asetuksessa:', error);
      setStatusText('Virhe: ei voida käynnistää');
    }
  };

  const togglePlayback = async () => {
    const currentState = await TrackPlayer.getState();
    if (currentState === State.Playing) {
      await TrackPlayer.pause();
      setStatusText('Pysäytetty');
    } else {
      await TrackPlayer.play();
      setStatusText('Toistetaan: Yle Radio Suomi');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.status}>{statusText}</Text>
      <Button
      title={playbackState.state === State.Playing ? 'Pysäytä' : 'Toista'}
      onPress={togglePlayback}
    />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  status: {
    marginBottom: 20,
    fontSize: 16
  },
  airplayContainer: {
    marginTop: 30,
    alignItems: 'center'
  },
  airplayButton: {
    width: 40,
    height: 40
  },
  airplayText: {
    marginTop: 5,
    fontSize: 12
  }
});
