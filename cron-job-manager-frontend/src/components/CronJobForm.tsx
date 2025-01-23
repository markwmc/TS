import React, { useState } from 'react';
import {IonInput, IonItem, IonLabel, IonButton } from '@ionic/react';

const CronJobForm: React.FC = () => {
    const [taskName, setTaskName] = useState('');
    const [cronExpression, setCronExpression] = useState('');

    const handleSubmit = () => {
        console.log("submit clicked")

    }

    return (
        <>
        <IonItem>
            <IonLabel position="floating">Task Name</IonLabel>
            <IonInput value={taskName} onIonChange={(e) => setTaskName(e.detail.value!)} />
        </IonItem>
        <IonItem>
            <IonLabel position="floating"> Cron Expression</IonLabel>
            <IonInput value={cronExpression} onIonChange={(e)=> setCronExpression(e.detail.value!)} />
        </IonItem>
        <IonButton onClick={handleSubmit}>Submit</IonButton>
        </>
       );
};

export default CronJobForm;