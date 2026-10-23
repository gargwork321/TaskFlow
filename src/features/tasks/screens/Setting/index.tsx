import { FlatList, Settings, Text, View } from "react-native"



const data = [{id: '1', title: 'Setting 1'}, {id: '2', title: 'Setting 2'}]

const Setting = () => {
    return (
        <View>
            <Text>Settings</Text>
            <FlatList
            data={data}
            renderItem={({item}) => <Text>{item.title}</Text>}
            />
        </View>
    )
}

export default Setting