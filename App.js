import HomeScreen from "./screens/HomeScreen";
import {registerRootComponent} from "expo";

registerRootComponent(HomeScreen);
export default function App() {
  
  return (
      <HomeScreen/>
  );
}


