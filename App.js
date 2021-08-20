import * as React from 'react';
import MapView, { Marker, Callout } from 'react-native-maps';
import { StyleSheet, Text, View, Dimensions } from 'react-native';
import { BICI_PLACES } from './Data/GasStations';

export default function App() {
  //Locations
  const [startLoc, setStartLoc] = React.useState({  
    latitude: 20.624620886817652,
    longitude: -103.3565319312955,
    latitudeDelta: 0.0922, 
    longitudeDelta: 0.0421
  });
  const [CurrLoc, setCurrLoc] = React.useState({  
    latitude: 20.624620886817652,
    longitude: -103.3565319312955
  }); 
  //Stations 
  const [staInfMB, setInfMB] = React.useState([]);
  //const [stationStatus, setStationStatus] = React.useState({}); 
  //const [statStaMB, setStaMB] = React.useState([]);

  const fetchStatus = async () => {
      let response = await fetch('https://guad.publicbikesystem.net/ube/gbfs/v1/');
      let data = await response.json();       
      
      let urlInfo = await fetch(data.data.en.feeds[0].url)
      let stationsMB =await urlInfo.json();              
      setInfMB(stationsMB.data.stations);
  }
 
  React.useEffect(() => {
         fetchStatus();            
  }, []);
 
   return (
    <View style={styles.container}>   
      <MapView style={styles.map} 
        initialRegion={startLoc}
        provider="google"
      >       
        {staInfMB.map((stations) => {
          return (
            <View key={stations.station_id} >
              <Marker 
                coordinate={{
                  latitude: stations.lat,
                  longitude: stations.lon
                }}
                pinColor="blue"
              >
                <Callout>
                  <Text>
                    { 
                       stations.name
                    }
                  </Text>
                </Callout>
              </Marker>
            </View>
          )       
        })}
        <Marker 
          coordinate={CurrLoc}
          pinColor="black"
          draggable={true}        
          onDragEnd={e => {
            setCurrLoc({
              latitude: e.nativeEvent.coordinate.latitude,
              longitude: e.nativeEvent.coordinate.longitude
            })
          }}
        >
          <Callout>
            <Text>Hi, i'm here</Text>
          </Callout>
        </Marker>
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  map: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
});