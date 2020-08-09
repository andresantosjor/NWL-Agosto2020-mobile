import React, { useState } from 'react';
import { View, Text } from 'react-native';
import { ScrollView, TextInput, BorderlessButton, RectButton } from 'react-native-gesture-handler';
import { Feather } from '@expo/vector-icons';
import AsyncStorage from '@react-native-community/async-storage';
import { useFocusEffect } from '@react-navigation/native';

import PageHeader from '../../components/PageHeader';
import TeacherItem, {Teacher} from '../../components/TeacherItem';

import styles from './styles';
import api from '../../services/api';

function TeacherList() {
    const [filterIsVisible, setFilterIsVisible] = useState(false);

    const [favorites, setFavorites] = useState<number[]>([]);

    const [teachers, setTeachers] = useState([]);
    const [subject, setSubject] = useState('');
    const [week_day, setWeekDay] = useState('');
    const [time, setTime] = useState('');

    function loadFavorites() {
        AsyncStorage.getItem('favorites').then(response => {
            if  (response) {
                const favoritedTeachers = JSON.parse(response);
                const favoritedTeachersIDs = favoritedTeachers.map((teacher: Teacher) => teacher.id);
                setFavorites(favoritedTeachersIDs);
            }
        });
    }

    useFocusEffect(() => {
        loadFavorites();
    });

    async function handleFilterSubmit() {
        loadFavorites();
        
        const response = await api.get('/classes', {
            params: {  
                subject,
                week_day,
                time
            }
        });
    
        setTeachers(response.data);
        setFilterIsVisible(false);
    }

    function handleToggleFiltersVisible() {
        setFilterIsVisible(!filterIsVisible);
    }

    return (
        <View style={styles.container} >
            <PageHeader 
                title="Proffys disponíveis" 
                headerRight={
                    <BorderlessButton onPress={handleToggleFiltersVisible}>
                        <Feather name="filter" size={20} color="#FFF" />
                    </BorderlessButton>
                }
            >
                { filterIsVisible && ( <View style={styles.searchForm}>
                        <Text style={styles.label}>Matérias</Text>
                        <TextInput
                        value={subject}
                        onChangeText={text => setSubject(text)}
                        style={styles.input}
                        placeholderTextColor="#c1bccc"
                        placeholder="Qual a matéria?" 
                        />

                        <View style={styles.inputGroup}>
                            <View style={styles.inputBlock}>
                                <Text style={styles.label}>Dia da semana</Text>
                                <TextInput
                                    value={week_day}
                                    onChangeText={text => setWeekDay(text)}
                                    style={styles.input}
                                    placeholderTextColor="#c1bccc"
                                    placeholder="Qual o dia?" 
                                />
                            </View>

                            <View style={styles.inputBlock}>
                                <Text style={styles.label}>Horário</Text>
                                <TextInput
                                    value={time}
                                    onChangeText={text => setTime(text)}
                                    style={styles.input}
                                    placeholderTextColor="#c1bccc"
                                    placeholder="Qual o horário?" 
                                />
                            </View>
                        </View>

                        <RectButton style={styles.submitButton} onPress={handleFilterSubmit}>
                            <Text style={styles.submitButtonText}>Filtrar</Text>
                        </RectButton>
                    </View> ) }
            </PageHeader>

            <ScrollView 
                style={styles.teacherList}
                contentContainerStyle={ {
                    paddingHorizontal: 16,
                    paddingBottom: 16,
                } } 
            >
                {teachers.map((teacher: Teacher) => {
                    return (
                        <TeacherItem 
                            key={teacher.id} 
                            teacher={teacher}
                            favorited={favorites.includes(teacher.id)}
                        />
                    )
                })}
            </ScrollView>
        </View>
    );
}

export default TeacherList;