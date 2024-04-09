import React, {useEffect} from "react";
import {Button, Modal, ScrollView, Text, TouchableOpacity, View,  BackHandler} from "react-native";
import {Contact, TodoItem} from "../model";


interface ContactsListProps {
    contacts: Contact[];
    open: boolean;
    onClose: () => void;
    todo: TodoItem | null;
    onClickContact: (contact: Contact, todo: TodoItem) => void;
}

export const ContactsList: React.FC<ContactsListProps> = ({todo, contacts, open, onClose, onClickContact}) => {

    useEffect(() => {
        const backHandler = BackHandler.addEventListener(
            'hardwareBackPress',
            () => {
                console.log(open);
                if (open) {
                    onClose();
                    return true;
                }
            }
        );

        return () => backHandler.remove();
    }, []);

    return (
        <Modal visible={open} onDismiss={onClose}>
            <ScrollView style={{padding: 20, flex: 1, backgroundColor: '#121212', flexDirection: 'column', gap: 20}}>
                <Text style={{color: '#fff', fontSize: 25}}>Pick a contact</Text>
                {contacts.map((contact, index) => (
                    <TouchableOpacity
                        onPress={() => onClickContact(contact, todo!)}
                        key={index} style={{
                        padding: 15,
                        borderWidth: 1
                    }}>
                        <Text style={{color: '#fff'}}>
                            {contact.name}: {contact.phone || contact.email}
                        </Text>
                    </TouchableOpacity>
                ))}
                {contacts.length === 0 && <Text style={{color: '#fff'}}>No contacts found, Maybe you didn't set email or phone of them.</Text>}
                <View style={{
                    marginBottom: 100
                }}>
                    <Button onPress={onClose} title={"Cancel"} />
                </View>
            </ScrollView>
        </Modal>
    )
}