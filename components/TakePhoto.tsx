import React from "react";
import {Image, ToastAndroid, TouchableOpacity, View} from "react-native";
import * as ImagePicker from 'expo-image-picker';
interface TakePhotoProps {
    onChange: (photo: string) => void;
    oldPhoto?: string;
}
export const TakePhoto: React.FC<TakePhotoProps> = ({onChange, oldPhoto}) => {
    const [photo, setPhoto] = React.useState<string>(oldPhoto || '');
    const clickCamera = async () => {
        try {
            const result = await ImagePicker.requestMediaLibraryPermissionsAsync();
            if (result.status !== 'granted') {
                ToastAndroid.show('Camera permission dined', ToastAndroid.SHORT);
                return;
            }
            const photoResult = await ImagePicker.launchCameraAsync({
                allowsEditing: true,
                quality: 1
            });
            if (!photoResult.canceled) {
                setPhoto(photoResult.assets[0].uri);
                onChange(photoResult.assets[0].uri);
            }
        } catch (err) {
            ToastAndroid.show('Error while taking photo', ToastAndroid.SHORT);
        }
    }
    return (
        <View style={{marginTop: 20}}>
            {photo && (
                <Image source={{uri: photo}} style={{
                    width: 200,
                    height: 200,
                }}/>
            )}
            <View style={{display: 'flex', flexDirection: 'row'}}>
                <TouchableOpacity onPress={clickCamera}>
                    <Image
                        style={{
                            width: 60,
                            height: 60
                        }}
                        source={require("../assets/camera.png")}/>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => {
                    setPhoto('');
                    onChange('');
                }}>
                    <Image
                        style={{
                            width: 60,
                            height: 60
                        }}
                        source={require("../assets/delete.png")}/>
                </TouchableOpacity>
            </View>
        </View>
    )
}
