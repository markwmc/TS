import { IonButton, IonContent, IonHeader, IonInput, IonItem, IonLabel, IonPage, IonText, IonTitle, IonToolbar } from '@ionic/react';
import React, { useEffect, useState } from 'react';
import './Home.css';
import CronJobListItem from '../components/CronJobListItem'

const Home: React.FC = () => {
  const [cronExpression, setCronExpression] = useState('');
  const [taskName, setTaskName] = useState('');
  const [cronJobs, setCronJobs] = useState<any[]>([]);
  const [errorMessage, setErrorMessage] = useState<string>('');

  const fetchCronJobs = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/cron-jobs');
      if (response.ok) {
        const data = await response.json();
        setCronJobs(data);
      } else {
        setErrorMessage('Failed to load cron jobs');
      }
    } catch (error) {
      setErrorMessage('Error fetching cron jobs');
    }
  };

  useEffect(() => {
    fetchCronJobs();
  }, [])

  const createCronJob = async () => {

    if (!cronExpression || !taskName) {
      setErrorMessage('Please fill in both the task name and cron expression.');
      return;
    }

    try {
      const response = await fetch('http://localhost:8080/api/create-cron', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          cronExpression,
          taskName,
        }),
      });
      if (response.ok) {
        const data = await response.json();
        console.log('Cron job created: ', data);
        setCronExpression('');
        setTaskName('');
        fetchCronJobs();
        setErrorMessage('');
      } else {
        throw new Error('Failed to create cron job')
      }
    } catch (error) {
      console.error('Error creating cron job: ', error);
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Cron Job Manager</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Create a Cron Job</IonTitle>
          </IonToolbar>
        </IonHeader>

        {errorMessage && <IonText color="danger"><p>{errorMessage}</p></IonText>}
        <IonItem>
          <IonLabel position="floating">Cron Expression</IonLabel>
          <IonInput
            value={cronExpression}
            onIonChange={(e) => setCronExpression(e.detail.value!)}
            placeholder="Enter cron expression (e.g., * * * * *)" />
        </IonItem>

        <IonItem>
          <IonLabel position="floating"> Task Name</IonLabel>
          <IonInput
            value={taskName}
            onIonChange={(e) => setTaskName(e.detail.value!)}
            placeholder="Enter task name" />
        </IonItem>

        <IonButton expand="full" onClick={createCronJob}>Create Cron Job</IonButton>
      <div className="cron-job-list">
        {cronJobs.length > 0 ? (
          cronJobs.map((job) => (
            <CronJobListItem key={job.id} job={job} />
          ))
        ) : (
          <IonText color="medium">No cron jobs found</IonText>
        )}
      </div>
      </IonContent>
    </IonPage>
  );
};

export default Home;
