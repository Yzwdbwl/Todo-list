import {TodoItem} from "../model";
import {Text, View, StyleSheet, Image} from "react-native";
import React from "react";
import { Checkbox } from 'react-native-paper';

interface TodoItemComponentProps {
    todo: TodoItem;
    onToggle: (todo: TodoItem) => void;
}


export const TodoItemComponent: React.FC<TodoItemComponentProps> = ({todo, onToggle}) => {
    return (
        <View style={styles.container}>
            <View style={styles.item}>
                <Text style={todo.completed ? styles.doneTitle : styles.title} numberOfLines={1}>
                    {todo.title}
                </Text>
                <Checkbox status={todo.completed ? 'checked' : 'unchecked'}
                    onPress={() => {
                        onToggle(todo);
                    }}
                />
            </View>
            {todo.photo && (
                <Image source={{uri: todo.photo}} style={styles.photo}/>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#121212',
        padding: 20,
        borderBottomWidth: 1,
        borderColor: '#383737',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
    },
    item: {
        width: '100%',
        backgroundColor: '#121212',
        height: 60,
        flexDirection: 'row',
        padding: 10,
        justifyContent: 'space-between'
    },
    title: {
        fontSize: 16,
        color: '#ffffff',
        opacity: 0.8,
        fontWeight: '800',
    },
    doneTitle: {
        fontSize: 16,
        color: '#ffffff',
        opacity: 0.8,
        fontWeight: '800',
        textDecorationLine: 'line-through'
    },
    photo: {
        width: 200,
        height: 200
    }
});
