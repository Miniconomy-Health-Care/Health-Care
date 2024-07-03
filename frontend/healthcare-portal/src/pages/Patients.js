import React, { useEffect, useState } from 'react';
import { Container, Paper, Typography } from '@mui/material';
import TableTemplate from '../components/TableTemplate';
import { getPersonaRecords } from '../api/api';

const Patients = () => {
  const columns = ['Persona ID', 'Persona Status', 'Record ID', 'Date', 'Treatment Type', 'Problem', 'Cost'];
  const [patients, setPatients] = useState([]);

  useEffect(() => {
    const sampleJson = `[
      {"personaid":"3","isadmitted":true,"recordid":1,"date":"01|02|03","treatmentname":"Doctor Visit","problem":"Sickness","treatmentcost":409600},
      {"personaid":"3","isadmitted":true,"recordid":2,"date":"01|02|03","treatmentname":"Medication","problem":"Prescription","treatmentcost":2044800},
      {"personaid":"3","isadmitted":true,"recordid":3,"date":"01|02|03","treatmentname":"Surgery","problem":"Prescription","treatmentcost":2044800}
      {"personaid":"4","isadmitted":true,"recordid":4,"date":"01|02|03","treatmentname":"Surgery","problem":"Prescription","treatmentcost":2044800}
      ]`;

    const patientRecords = JSON.parse(sampleJson);

    const formattedPatients = patientRecords.map(patient => ({
      PersonaID: patient.personaid,
      PersonaStatus: patient.isadmitted ? 'Admitted' : 'Discharged',
      RecordID: patient.recordid,
      Date: patient.date,
      TreatmentType: patient.treatmentname,
      Problem: patient.problem,
      Cost: patient.treatmentcost
    }));
    console.table( formattedPatients);

    setPatients(formattedPatients);

    //Remove the code above once you make sure getPersonaRecords() works when the actual API is ready
     getPersonaRecords()
      .then((records) => {
        const formattedPatients = records.map(patient => ({
          PersonaID: patient.personaid,
          PersonaStatus: patient.isadmitted ? 'Admitted' : 'Discharged',
          RecordID: patient.recordid,
          Date: patient.date,
          TreatmentType: patient.treatmentname,
          Problem: patient.problem,
          Cost: patient.treatmentcost
        }));
        setPatients(formattedPatients);
      })
      .catch((err) => console.log(err));

  }, []);

  return (
    <Container maxWidth="lg">
      <Paper className="tablePaper">
        <Typography variant="h4" align="center" className="tableHeading">Persona Table</Typography>
        <TableTemplate columns={columns} rows={patients} />
      </Paper>
    </Container>
  );
};

export default Patients;