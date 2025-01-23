import React from 'react';
import {IonItem, IonLabel, IonButton } from '@ionic/react';

const CronJobListItem: React.FC<{job: any}> = ({ job }) => {
    return (
        <IonItem>
            <IonLabel>
                <h2>{job.taskName}</h2>
                <p>{job.cronExpression}</p>
            </IonLabel>
            <IonButton slot="end" href={`/edit-cron/${job.id}`}>Edit</IonButton>
            <IonButton slot="end" color="danger">Delete</IonButton>
        </IonItem>
    );
};

export default CronJobListItem;