import {TodoItem} from "../model";
import React, {useEffect, useState} from "react";
import {Modal, StyleSheet, Text, TextInput, ToastAndroid, TouchableOpacity, View} from "react-native";
import {TakePhoto} from "./TakePhoto";


interface UpdateTodoModalProps {
    todo: TodoItem | null;
    onSubmit: (newTitle: string, todoId: string, photo: string) => void;
    onClose: () => void;
}

export const UpdateTodoModal: React.FC<UpdateTodoModalProps> = ({todo, onClose, onSubmit}) => {
    const [title, setTitle] = useState('');
    const [photo, setPhoto] = useState<string>('');
    useEffect(() => {
        if (todo) {
            setTitle(todo.title);
        }
    }, [todo]);

    const handleSubmit = () => {
        if (!todo) {
            return;
        }

        if (title.trim() !== '') {
            onSubmit(title, todo.id!, photo);
            setTitle('');
            onClose();
        } else {
            ToastAndroid.show('Please input todo', ToastAndroid.SHORT);
        }
    };

    return (

        <Modal animationType="slide"
               transparent={true}
               visible={Boolean(todo)}>
            <View style={styles.modal}>
                <Text style={styles.headline}>Create Todo</Text>
                <TextInput
                    placeholder="Please input todo"
                    value={title}
                    onChangeText={setTitle}
                    style={{ borderBottomWidth: 1, borderBottomColor: '#ccc', paddingBottom: 5 }}
                />
                <TakePhoto onChange={setPhoto} oldPhoto={todo?.photo} />
                <View style={{ flexDirection: 'row', justifyContent: 'center', gap: 15, marginTop: 15 }}>
                    <TouchableOpacity
                        onPress={() => onClose()}
                        style={styles.cancelButton}>
                        <Text style={{color: '#fff'}}>Cancel</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={handleSubmit}
                        style={styles.confirmButton}>
                        <Text style={{color: '#fff'}}>Confirm</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>

    );
}

const styles = StyleSheet.create({
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#000000',
        opacity: 0.5,
    },
    headline: {
        fontSize: 22
    },
    modal: {
        backgroundColor: '#ffffff',
        margin: 20,
        borderRadius: 10,
        padding: 35,
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5
    },
    confirmButton: {
        backgroundColor: '#000000',
        borderRadius: 5,
        padding: 12,
        color: '#f3f5f2',
    },
    cancelButton: {
        backgroundColor: '#757474',
        borderRadius: 5,
        padding: 12,
        color: '#f3f5f2',
    }
});
