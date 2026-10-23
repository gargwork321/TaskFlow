import { FlatList, Text, View } from "react-native"
import Calender from "../Calender"



const data = [{id: '1', title: 'Stat 1'}, {id: '2', title: 'Stat 2'}]

const Stats = () => {
    return (
        <View>
            <Text>Stats</Text>
            <FlatList
            data={data}
            renderItem={({item}) => <Text>{item.title}</Text>}
            />
        </View>
    )
}

export default Stats