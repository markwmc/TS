import React, { useState } from 'react';
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonInput, IonItem, IonLabel, IonButton } from '@ionic/react';
import CronJobForm from '../components/CronJobForm';

const CreateCronJobPage: React.FC = () => {
    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonTitle>Create Cron Job</IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContent>
                <CronJobForm />
            </IonContent>
        </IonPage>
    );
};

export default CreateCronJobPage;