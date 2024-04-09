import React, {useEffect, useMemo, useState} from 'react';
import {
    SafeAreaView,
    StyleSheet,
    View,
    Text,
    StatusBar,
    ToastAndroid, TouchableOpacity, Image,
    Linking
} from 'react-native';
import { FAB, Checkbox } from 'react-native-paper';
import SwipeableFlatList from 'react-native-swipeable-list';
import { ActivityIndicator, MD2Colors } from 'react-native-paper';
import {Contact, TodoItem} from "./model";
import {TodoItemComponent} from "./components/TodoItemComponent";
import {CreateTodoModal} from "./components/CreateTodoModal";
import {useTodoHook} from "./hooks/todo.hook";
import {createTodo, removeTodo, saveImage, updateTodo} from "./firebase";

import {UpdateTodoModal} from "./components/UpdateTodoModal";
import * as ExpoSms from 'expo-sms';
import * as Contacts from 'expo-contacts';
import {ContactsList} from "./components/ContactsList";

type TouchContactHandler = (contact: Contact, todo: TodoItem) => void;

const darkColors = {
    background: '#121212',
    primary: '#BB86FC',
    primary2: '#3700b3',
    secondary: '#03DAC6',
    onBackground: '#FFFFFF',
    error: '#CF6679',
};

const colorEmphasis = {
    high: 0.87,
    medium: 0.6,
    disabled: 0.38,
};

const extractItemKey = (item: TodoItem) => {
    return String(item.id)
};


function renderItemSeparator() {
    return <View style={styles.itemSeparator} />;
}

const App = () => {
    const [completedVisible, setCompletedVisible] = useState(true);
    const [inCompletedVisible, setInCompletedVisible] = useState(true);
    const {todos, isLoading, refreshTodos} = useTodoHook();
    const [editTodo, setEditTodo] = useState<TodoItem | null>(null);
    const [open, setOpen] = useState(false);
    const [contacts, setContacts] = useState<Contact[]>([]);
    const [openContact, setOpenContact] = useState(false);
    const [touchContactHandler, setTouchContactHandler] = useState<TouchContactHandler | null>(null);
    const [sharedTodo, setSharedTodo] = useState<TodoItem | null>(null);
    const todoList = useMemo(() => {

        return todos.filter(todo => {
            if (completedVisible && inCompletedVisible) {
                return true;
            } else if (completedVisible && !inCompletedVisible) {
                return todo.completed;
            } else if (!completedVisible && inCompletedVisible) {
                return !todo.completed;
            } else {
                return false;
            }
        })

    }, [todos, completedVisible, inCompletedVisible]);
    const onSubmit = async (title: string, photo: string) => {
      try {
          let url = '';
          if (photo) {
              url = await saveImage(photo);
          }
          await createTodo({title, completed: false, photo: url});
          refreshTodos();
          ToastAndroid.show("Success add todo", ToastAndroid.SHORT);
      } catch (err) {
          ToastAndroid.show("Fail to add todo", ToastAndroid.SHORT);
      }
    }
    const onEditSubmit = async (title: string, todoId: string, photo: string) => {
        try {
            await updateTodo(todoId, {title, photo});
            refreshTodos();
            ToastAndroid.show("Success update todo", ToastAndroid.SHORT);
        } catch (err) {
            ToastAndroid.show("Fail to update todo", ToastAndroid.SHORT);
        }
    }
    const removeItem = async (item: TodoItem) => {
        try {
            await removeTodo(item.id!);
            refreshTodos();
            ToastAndroid.show("Success remove todo", ToastAndroid.SHORT);
        } catch (err) {
            ToastAndroid.show("Fail to remove todo", ToastAndroid.SHORT);
        }
    };

    const toggleItem = async (item: TodoItem) => {
        try {
            await updateTodo(item.id!, {completed: !item.completed});
            refreshTodos();
            ToastAndroid.show("Success toggle todo", ToastAndroid.SHORT);
        } catch (err) {
            ToastAndroid.show("Fail to toggle todo", ToastAndroid.SHORT);

        }
    }

    const editItem = (item: TodoItem) => {
        setEditTodo(item);
    }


    const handleShareSms = async (item: TodoItem) => {
        try {
            setSharedTodo(item);
            setTouchContactHandler(() => (contact: Contact, todo: TodoItem) => sendSms(contact, todo));
            const permission = await Contacts.requestPermissionsAsync();
            if (permission.status === 'granted') {
                const result = await Contacts.getContactsAsync({
                    fields: [Contacts.Fields.PhoneNumbers],
                });

                if (result && result.data) {
                    setOpenContact(true);

                    setContacts(result.data.filter(item => Array.isArray(item.phoneNumbers)).map(contact => {
                        return {
                            name: contact.name,
                            phone: contact.phoneNumbers![0].number || 'N/A'
                        }
                    }));

                }
            } else {
                ToastAndroid.show("Get contacts dined", ToastAndroid.SHORT);
            }
        } catch (err) {}
    }

    const handleShareEmail = async (item: TodoItem) => {
        try {
            setSharedTodo(item);
            setTouchContactHandler(() => (contact: Contact, todo: TodoItem) => openEmail(contact, todo));
            const permission = await Contacts.requestPermissionsAsync();
            if (permission.status === 'granted') {
                const result = await Contacts.getContactsAsync({
                    fields: [Contacts.Fields.Emails],
                });

                if (result && result.data) {
                    setOpenContact(true);

                    setContacts(result.data.filter(item => Array.isArray(item.emails)).map(contact => {
                        return {
                            name: contact.name,
                            email: contact.emails![0].email || 'N/A',
                        }
                    }));

                }
            } else {
                ToastAndroid.show("Get contacts dined", ToastAndroid.SHORT);
            }
        } catch (err) {}
    }

    const sendSms = async (contact: Contact, todo: TodoItem) => {
        try {
            const canUse = await ExpoSms.isAvailableAsync();
            if (canUse) {
               const result = await ExpoSms.sendSMSAsync(
        [contact.phone!],
                   `${todo.title} - ${todo.completed ? 'Completed' : 'Not Completed'}`
               );
               if (result.result === 'sent') {
                     ToastAndroid.show("Success sent", ToastAndroid.SHORT);
               } else {
               }
            } else {
                ToastAndroid.show("SMS not available", ToastAndroid.SHORT);
            }
        } catch (err) {

        }
    }

    const openEmail = async (contact: Contact, todo: TodoItem) => {
        console.log(contact);
        if (contact.email) {
            Linking.openURL(`mailto:${contact.email}?subject=TodoItem&body=${todo.title} - ${todo.completed ? 'Completed' : 'Not Completed'}`);
        } else {
            ToastAndroid.show("Email not available", ToastAndroid.SHORT);
        }
    }

    useEffect(() => {
        refreshTodos();
    }, []);




    const QuickActions = (index: number, todo: TodoItem) => {
        return (
            <View style={styles.qaContainer}>
                <TouchableOpacity
                    onPress={() => editItem(todo)}
                >
                    <Image style={styles.actionIcon} source={require('./assets/edit.png')}/>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => removeItem(todo)}
                >
                    <Image style={styles.actionIcon} source={require('./assets/delete.png')}/>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleShareSms(todo)}>
                    <Image style={styles.actionIcon} source={require('./assets/sms.png')}/>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleShareEmail(todo)}>
                    <Image style={styles.actionIcon} source={require('./assets/send.png')}/>
                </TouchableOpacity>
            </View>
        );
    };

    return (
        <View style={styles.container}>
            <StatusBar barStyle="dark-content" />
            <SafeAreaView style={styles.container}>
                <View style={styles.headerContainer}>
                    <Text style={styles.headerText}>Todo List</Text>
                </View>
                <View style={{display: 'flex', flexDirection: 'row', padding: 10, gap:5, alignItems: 'center'}}>
                    <Checkbox
                        status={completedVisible ? 'checked' : 'unchecked'} onPress={() => setCompletedVisible(!completedVisible)} />
                    <Text onPress={() => setCompletedVisible(!completedVisible)} style={{marginRight: 20, ...styles.text}}>Completed</Text>

                    <Checkbox status={inCompletedVisible ? 'checked' : 'unchecked'} onPress={() => setInCompletedVisible(!inCompletedVisible)} />
                    <Text onPress={() => setInCompletedVisible(!inCompletedVisible)} style={styles.text}>InCompleted</Text>
                </View>
                {isLoading && (
                    <ActivityIndicator animating={true} color={MD2Colors.blue100}/>
                )}
                {!isLoading && (
                    <SwipeableFlatList
                        keyExtractor={extractItemKey}
                        data={todoList}
                        renderItem={({item}: {item: TodoItem}) => (
                            <TodoItemComponent todo={item}
                                               onToggle={todo => {
                                                   toggleItem(todo);
                                               }}
                            />
                        )}
                        maxSwipeDistance={240}
                        renderQuickActions={({index, item}: {index: number, item: TodoItem}) => QuickActions(index, item)}
                        contentContainerStyle={styles.contentContainerStyle}
                        shouldBounceOnMount={true}
                        ItemSeparatorComponent={renderItemSeparator}
                    />
                )}
            </SafeAreaView>
            <UpdateTodoModal todo={editTodo} onSubmit={onEditSubmit} onClose={() => setEditTodo(null)} />
            <CreateTodoModal open={open} onSubmit={onSubmit} onClose={() => setOpen(false)} />
            <ContactsList
                todo={sharedTodo}
                onClickContact={(contact: Contact, todo: TodoItem) => {
                    if (touchContactHandler) {
                        touchContactHandler(contact, todo)
                    }
                }}
                contacts={contacts} open={openContact} onClose={() => setOpenContact(false)} />
            <FAB
                style={{
                    position: 'absolute',
                    margin: 10,
                    right: 12,
                    bottom: 12,
                    zIndex: 200,
                    backgroundColor: '#000000',
                }}
                color={'white'}
                label={'Add Todo'}
                icon="plus"
                onPress={() => {
                    setOpen(true)
                }}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#121212',
        flex: 1
    },
    headerContainer: {
        height: 80,
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: 10,
    },
    headerText: {
        fontSize: 30,
        fontWeight: '800',
        color: darkColors.onBackground,
        opacity: colorEmphasis.high,
    },
    item: {
        backgroundColor: '#121212',
        height: 80,
        flexDirection: 'row',
        padding: 10,
    },

    subject: {
        fontSize: 14,
        color: darkColors.onBackground,
        opacity: colorEmphasis.high,
        fontWeight: 'bold',
        textShadowColor: darkColors.secondary,
        textShadowOffset: {width: 1, height: 1},
        textShadowRadius: 4,
    },
    text: {
        fontSize: 10,
        color: darkColors.onBackground,
        opacity: colorEmphasis.medium,
    },

    itemSeparator: {
        height: StyleSheet.hairlineWidth,
        backgroundColor: darkColors.onBackground,
        opacity: colorEmphasis.medium,
    },
    qaContainer: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'flex-end',
        gap: 15
    },
    actionIcon: {
        width: 35,
        height: 35
    },
    button: {
        width: 80,
        alignItems: 'center',
        justifyContent: 'center',
    },
    buttonText: {
        fontWeight: 'bold',
        opacity: colorEmphasis.high,
    },
    button1Text: {
        color: darkColors.primary,
    },
    button2Text: {
        color: darkColors.secondary,
    },
    button3Text: {
        color: darkColors.error,
    },
    contentContainerStyle: {
        flexGrow: 1,
    },
});

export default App;
