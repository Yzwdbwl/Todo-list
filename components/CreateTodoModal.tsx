import React, { useState } from "react";
import {View, TextInput, Button, StyleSheet, Modal, Text, TouchableOpacity, ToastAndroid, Image} from 'react-native';
import {TakePhoto} from "./TakePhoto";

interface CreateTodoModalProps {
    open: boolean;
    onSubmit: (title: string, photo: string) => void;
    onClose: () => void;
}

export const CreateTodoModal: React.FC<CreateTodoModalProps> = ({ open, onSubmit, onClose }) => {
    const [title, setTitle] = useState('');
    const [photo, setPhoto] = useState<string>('');

    if (!open) {
        return null;
    }

    const handleSubmit = () => {
        if (title.trim() !== '') {
            onSubmit(title, photo);
            setTitle('');
            onClose();
        } else {
            ToastAndroid.show('Please input todo', ToastAndroid.SHORT);
        }
    };

    const handleTakePhoto = (photo: string) => {
        setPhoto(photo);
    }

    return (

        <Modal animationType="slide"
               transparent={true}
               visible={open}>
            <View style={styles.modal}>
                <Text style={styles.headline}>Create Todo</Text>
                <TextInput
                    placeholder="Please input todo"
                    value={title}
                    onChangeText={setTitle}
                    style={{ borderBottomWidth: 1, borderBottomColor: '#ccc', paddingBottom: 5 }}
                />
                <TakePhoto onChange={handleTakePhoto} />
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
};

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
        elevation: 5,
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
