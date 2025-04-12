import React from 'react';
import { View, StyleSheet, Modal, ScrollView, TouchableOpacity } from 'react-native';
import { Surface, Text, IconButton, Portal, Divider } from 'react-native-paper';
import { Task } from '../types/task';
import { format } from 'date-fns';
import { uk } from 'date-fns/locale';
import { useTranslation } from 'react-i18next';

interface TaskDetailsModalProps {
    visible: boolean;
    task: Task | null;
    onDismiss: () => void;
    onComplete: (task: Task) => void;
    onDelete: (task: Task) => void;
    onEdit: (task: Task) => void;
    isDarkMode: boolean;
}

const TaskDetailsModal: React.FC<TaskDetailsModalProps> = ({
    visible,
    task,
    onDismiss,
    onComplete,
    onDelete,
    onEdit,
    isDarkMode,
}) => {
    if (!task) return null;
    const { t } = useTranslation();

    const formatDateTime = (date: string) => {
        return format(new Date(date), "d MMMM yyyy, HH:mm", { locale: uk });
    };

    const getStatusColor = (isCompleted: boolean) => {
        return isCompleted ? '#00b894' : '#FFB344';
    };

    const getPriorityColor = (priority?: string) => {
        switch (priority) {
            case 'Високий': return '#FF6B6B';
            case 'Середній': return '#FFD93D';
            case 'Низький': return '#00b894';
            default: return '#666';
        }
    };

    const translatePriority = (priority?: string) => {
        switch (priority) {
            case 'Високий': return t('priority.high');
            case 'Середній': return t('priority.medium');
            case 'Низький': return t('priority.low');
            default: return priority;
        }
    };

    const translateCategory = (category?: string) => {
        switch (category) {
            case 'Робота': return t('categories.work');
            case 'Навчання': return t('categories.study');
            case 'Особисте': return t('categories.personal');
            case 'Покупки': return t('categories.shopping');
            case 'Здоров\'я': return t('categories.health');
            default: return category;
        }
    };

    return (
        <Portal>
            <Modal
                visible={visible}
                onDismiss={onDismiss}
                transparent
                animationType="fade"
            >
                <View style={styles.modalOverlay}>
                    <Surface style={[
                        styles.modalContent,
                        isDarkMode && styles.modalContentDark
                    ]}>
                        <View style={[styles.header, isDarkMode && styles.headerDark]}>
                            <View style={styles.headerTop}>
                                <View style={styles.headerActions}>
                                    <View style={styles.headerIcons}>
                                        {task.colorMarking && (
                                            <View style={[styles.colorIndicator, { backgroundColor: task.colorMarking }]} />
                                        )}
                                        {task.icon && (
                                            <Text style={styles.taskIcon}>{task.icon}</Text>
                                        )}
                                    </View>
                                    <View style={[styles.statusBadge, { backgroundColor: getStatusColor(task.isCompleted) }]}>
                                        <Text style={styles.statusText}>
                                            {task.isCompleted ? t('taskDetails.completed') : t('taskDetails.inProgress')}
                                        </Text>
                                    </View>
                                </View>
                                <IconButton
                                    icon="close"
                                    size={24}
                                    onPress={onDismiss}
                                    iconColor={isDarkMode ? '#fff' : '#000'}
                                    style={styles.closeButton}
                                />
                            </View>

                            <Text style={[styles.title, isDarkMode && styles.titleDark]} numberOfLines={2}>
                                {task.title}
                            </Text>
                        </View>

                        <ScrollView
                            style={styles.content}
                            showsVerticalScrollIndicator={false}
                            bounces={false}
                        >
                            {task.description && (
                                <View style={styles.section}>
                                    <Surface style={[styles.card, isDarkMode && styles.cardDark]}>
                                        <View style={styles.cardHeader}>
                                            <IconButton icon="text" size={20} iconColor={isDarkMode ? '#fff' : '#666'} />
                                            <Text style={[styles.sectionTitle, isDarkMode && styles.textDark]}>
                                                {t('taskDetails.description')}
                                            </Text>
                                        </View>
                                        <Text style={[styles.description, isDarkMode && styles.textDark]}>
                                            {task.description}
                                        </Text>
                                    </Surface>
                                </View>
                            )}

                            <View style={styles.section}>
                                <Surface style={[styles.card, isDarkMode && styles.cardDark]}>
                                    <View style={styles.cardHeader}>
                                        <IconButton icon="information" size={20} iconColor={isDarkMode ? '#fff' : '#666'} />
                                        <Text style={[styles.sectionTitle, isDarkMode && styles.textDark]}>
                                            {t('taskDetails.mainInfo')}
                                        </Text>
                                    </View>
                                    <View style={styles.infoGrid}>
                                        {task.category && (
                                            <View style={styles.infoItem}>
                                                <IconButton
                                                    icon="folder-outline"
                                                    size={20}
                                                    iconColor={isDarkMode ? '#fff' : '#666'}
                                                />
                                                <View style={styles.infoContent}>
                                                    <Text style={[styles.infoLabel, isDarkMode && styles.infoLabelDark]}>
                                                        {t('taskDetails.category')}
                                                    </Text>
                                                    <Text style={[styles.infoText, isDarkMode && styles.textDark]}>
                                                        {translateCategory(task.category)}
                                                    </Text>
                                                </View>
                                            </View>
                                        )}

                                        {task.priority && (
                                            <View style={styles.infoItem}>
                                                <IconButton
                                                    icon="flag"
                                                    size={20}
                                                    iconColor={getPriorityColor(task.priority)}
                                                />
                                                <View style={styles.infoContent}>
                                                    <Text style={[styles.infoLabel, isDarkMode && styles.infoLabelDark]}>
                                                        {t('taskDetails.priority')}
                                                    </Text>
                                                    <View style={[styles.priorityBadge, { backgroundColor: `${getPriorityColor(task.priority)}20` }]}>
                                                        <Text style={[styles.priorityText, { color: getPriorityColor(task.priority) }]}>
                                                            {translatePriority(task.priority)}
                                                        </Text>
                                                    </View>
                                                </View>
                                            </View>
                                        )}
                                    </View>
                                </Surface>
                            </View>

                            {(task.deadline || task.executionTime || task.reminder) && (
                                <View style={styles.section}>
                                    <Surface style={[styles.card, isDarkMode && styles.cardDark]}>
                                        <View style={styles.cardHeader}>
                                            <IconButton icon="clock-outline" size={20} iconColor={isDarkMode ? '#fff' : '#666'} />
                                            <Text style={[styles.sectionTitle, isDarkMode && styles.textDark]}>
                                                {t('taskDetails.timeSettings')}
                                            </Text>
                                        </View>
                                        <View style={styles.infoGrid}>
                                            {task.deadline && (
                                                <View style={styles.infoItem}>
                                                    <IconButton
                                                        icon="clock-outline"
                                                        size={20}
                                                        iconColor={isDarkMode ? '#fff' : '#666'}
                                                    />
                                                    <View>
                                                        <Text style={styles.infoLabel}>
                                                            {t('taskDetails.deadline')}
                                                        </Text>
                                                        <Text style={[styles.infoText, isDarkMode && styles.textDark]}>
                                                            {formatDateTime(task.deadline)}
                                                        </Text>
                                                    </View>
                                                </View>
                                            )}

                                            {task.executionTime && (
                                                <View style={styles.infoItem}>
                                                    <IconButton
                                                        icon="timer-outline"
                                                        size={20}
                                                        iconColor={isDarkMode ? '#fff' : '#666'}
                                                    />
                                                    <View>
                                                        <Text style={styles.infoLabel}>
                                                            {t('taskDetails.executionTime')}
                                                        </Text>
                                                        <Text style={[styles.infoText, isDarkMode && styles.textDark]}>
                                                            {task.executionTime}
                                                        </Text>
                                                    </View>
                                                </View>
                                            )}

                                            {task.reminder && (
                                                <View style={styles.infoItem}>
                                                    <IconButton
                                                        icon="bell-outline"
                                                        size={20}
                                                        iconColor={isDarkMode ? '#fff' : '#666'}
                                                    />
                                                    <View>
                                                        <Text style={styles.infoLabel}>
                                                            {t('taskDetails.reminder')}
                                                        </Text>
                                                        <Text style={[styles.infoText, isDarkMode && styles.textDark]}>
                                                            {task.reminder}
                                                        </Text>
                                                    </View>
                                                </View>
                                            )}
                                        </View>
                                    </Surface>
                                </View>
                            )}
                        </ScrollView>

                        <Surface style={[styles.actions, isDarkMode && styles.actionsDark]}>

                            <View style={styles.actionsSeparator}>
                                <TouchableOpacity
                                    style={[styles.actionButton, styles.editButton]}
                                    onPress={() => {
                                        onEdit(task);
                                        onDismiss();
                                    }}
                                >
                                    <IconButton icon="pencil" size={20} iconColor="#fff" />
                                    <Text style={styles.actionButtonText}>
                                        {t('buttonsHome.edit')}
                                    </Text>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    style={[styles.actionButton, styles.deleteButton]}
                                    onPress={() => {
                                        onDelete(task);
                                        onDismiss();
                                    }}
                                >
                                    <IconButton icon="delete-outline" size={20} iconColor="#fff" />
                                    <Text style={styles.actionButtonText}>
                                        {t('buttonsHome.delete')}
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </Surface>
                    </Surface>
                </View>
            </Modal>
        </Portal>
    );
};

const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        justifyContent: 'center',
        padding: 16,
    },
    modalContent: {
        backgroundColor: '#fff',
        borderRadius: 20,
        maxHeight: '85%',
        elevation: 8,
        overflow: 'hidden',
    },
    modalContentDark: {
        backgroundColor: '#1E1E1E',
    },
    header: {
        padding: 16,
        backgroundColor: '#f8f9fa',
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(0,0,0,0.1)',
    },
    headerDark: {
        backgroundColor: '#2C2C2C',
        borderBottomColor: 'rgba(255,255,255,0.1)',
    },
    headerTop: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    headerActions: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginRight: 8,
    },
    headerIcons: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    closeButton: {
        margin: -8,
    },
    title: {
        fontSize: 22,
        fontWeight: '600',
        color: '#000',
        marginTop: 12,
        lineHeight: 28,
    },
    titleDark: {
        color: '#fff',
    },
    statusBadge: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
    },
    statusText: {
        color: '#fff',
        fontSize: 13,
        fontWeight: '600',
    },
    content: {
        padding: 16,
    },
    section: {
        marginBottom: 16,
    },
    card: {
        borderRadius: 16,
        backgroundColor: '#fff',
        elevation: 2,
        overflow: 'hidden',
    },
    cardDark: {
        backgroundColor: '#2C2C2C',
    },
    cardHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(0,0,0,0.05)',
    },
    sectionTitle: {
        fontSize: 15,
        fontWeight: '600',
        color: '#666',
        marginLeft: 4,
    },
    description: {
        fontSize: 15,
        lineHeight: 24,
        color: '#333',
        padding: 16,
    },
    textDark: {
        color: '#fff',
    },
    infoGrid: {
        padding: 16,
        gap: 16,
    },
    infoItem: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    infoContent: {
        flex: 1,
        marginLeft: 8,
    },
    infoLabel: {
        fontSize: 12,
        color: '#666',
        marginBottom: 4,
    },
    infoLabelDark: {
        color: '#999',
    },
    infoText: {
        fontSize: 14,
        color: '#333',
        fontWeight: '500',
    },
    priorityBadge: {
        alignSelf: 'flex-start',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 12,
    },
    priorityText: {
        fontSize: 13,
        fontWeight: '600',
    },
    taskIcon: {
        fontSize: 20,
    },
    colorIndicator: {
        width: 20,
        height: 20,
        borderRadius: 10,
        borderWidth: 2,
        borderColor: '#fff',
        elevation: 2,
    },
    actions: {
        padding: 16,
        borderTopWidth: 1,
        borderTopColor: 'rgba(0,0,0,0.1)',
        backgroundColor: '#f8f9fa',
    },
    actionsDark: {
        backgroundColor: '#2C2C2C',
        borderTopColor: 'rgba(255,255,255,0.1)',
    },
    actionsSeparator: {
        flexDirection: 'row',
        gap: 8,
        marginTop: 8,
    },
    actionButton: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        // justifyContent: 'center',
        padding: 12,
        borderRadius: 12,
        elevation: 2,
    },
    completeButton: {
        backgroundColor: '#00b894',
    },
    editButton: {
        backgroundColor: '#4CAF50',
    },
    deleteButton: {
        backgroundColor: '#FF6B6B',
    },
    actionButtonText: {
        
        color: '#fff',
        fontSize: 14,
        fontWeight: '600',
        // marginLeft: 4,
    },
});

export default TaskDetailsModal;