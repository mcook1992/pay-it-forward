import * as React from "react"
import {
    TouchableOpacity,
    ActivityIndicator,
    TextInput,
    FlatList,
    Stylesheet,
    ScrollView,
    Text,
    View,
    Image,
    Button,
    Alert,
  } from "react-native"
  import {
    Menu,
    MenuOptions,
    MenuOption,
    MenuTrigger,
    renderers
  } from 'react-native-popup-menu'
  
  const { SlideInMenu } = renderers;


function menuPage(props) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
       <Menu rendererProps={{ preferredPlacement: 'left' }}>
                  <MenuTrigger text='Select action' />
                  <MenuOptions>
                    <MenuOption onSelect={() => props.navInfo.navigation.navigate("Feed")} text='Feed' />
                    <MenuOption onSelect={() => alert(`Delete`)} >
                      <Text style={{color: 'red'}}>Delete</Text>
                    </MenuOption>
                    <MenuOption onSelect={() => alert(`Not called`)} disabled={true} text='Disabled' />
                  </MenuOptions>
               </Menu>
      </View>
    );
  }

  export default menuPage