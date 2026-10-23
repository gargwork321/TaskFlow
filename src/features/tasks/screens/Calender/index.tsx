import { FlatList, Text, View } from "react-native"



const data = [{id: '1', title: 'event 1'}, {id: '2', title: 'event 2'}]

const Calender = () => {
    return (
        <View>
            <Text>Calender</Text>
            <FlatList
            data={data}
            renderItem={({item}) => <Text>{item.title}</Text>}
            />
        </View>
    )
}

export default Calender